# Fase 3 — Spike geométrico (instrucciones para Claude Code)
**Documento de ejecución para la sesión de Claude Code local en la carpeta `Construblock`, Mac mini.**

Pega este documento como mensaje en Claude Code, o dile "lee y sigue `docs/Fase3_Spike_Geometrico.md`".

---

## 0. Contexto y objetivo

La Fase 3 del plan (`docs/Plan_Fases_Proyecto_Greblock.md`) es el **spike geométrico**: validar la parte más riesgosa de la arquitectura antes de construir el wizard completo — dibujar muros con espesor real y detectar tableros cerrados automáticamente.

**Criterio de "listo":** se puede dibujar un cuarto simple en un canvas, el sistema detecta el tablero cerrado y calcula su área correctamente. Es el punto de no-retorno del stack geométrico.

**Importante — el código de esta fase ya está escrito y verificado.** El módulo de geometría (clipper + grafo half-edge) fue probado en un entorno aparte con **vitest: 8/8 pruebas pasan**, y todo compila con TypeScript estricto contra las mismas versiones que usa este repo (react-konva 19.2.5, konva 10.3.0, React 19.2.x, clipper-lib 6.4.2). Tu trabajo en esta sesión es: crear los archivos EXACTAMENTE como vienen abajo (no los reescribas ni "mejores" — si encuentras un error real al compilar o correr, corrígelo y repórtalo al final), instalar vitest, correr las pruebas, verificar la página `/spike` a mano, y hacer commit + push.

Decisiones vigentes que NO se rediscuten (ver `docs/Bitacora_Proyecto_Greblock.md`):
- Fuente de verdad numérica: manual PDF AGIES DSE 4.1-2014. (No aplica a esta fase, que es solo geometría.)
- Convención de unidades: el modelo trabaja en **metros**; los píxeles solo existen al renderizar.
- Las áreas de tablero se miden **a ejes de muro** (así lo hace la metodología AGIES).

Advertencia Next.js 16: este repo usa Next 16 (posterior al conocimiento de entrenamiento). Si algo del App Router se comporta distinto a lo esperado, consulta la documentación local (`node_modules/next/dist/docs/` o docs oficiales) antes de improvisar. En particular: `dynamic(..., { ssr: false })` debe vivir dentro de un componente cliente — la página `/spike` de abajo ya está escrita así.

---

## 1. Verificación previa

1. Confirma que estás en la carpeta `Construblock` (raíz del repo) y que `git status` está limpio. Si la Fase 2 tiene cambios sin commit, haz primero ese commit (o repórtalo) antes de tocar la Fase 3.
2. Verifica que existen `src/lib/data/` (Fase 2) y el placeholder `src/lib/geometry/index.ts` (Fase 1). El placeholder se va a **reemplazar** en esta fase.

## 2. Instalar vitest y agregar el script de pruebas

```
npm install -D vitest
```

En `package.json`, agrega a `"scripts"`:

```json
"test": "vitest run"
```

(No hace falta archivo de configuración de vitest: los tests usan imports relativos y vitest los descubre por el patrón `__tests__/*.test.ts`.)

## 3. Crear los archivos


### `src/lib/geometry/tipos.ts`
Tipos del dominio geométrico.

```ts
// Tipos del módulo de geometría del editor de planta.
// Convención de unidades: TODO el modelo trabaja en METROS.
// La conversión a píxeles ocurre únicamente al renderizar (en los componentes).

/** Punto en coordenadas de plano, en metros. */
export interface Punto {
  x: number;
  y: number;
}

/** Eje de un muro: segmento entre dos puntos, con espesor real del muro. */
export interface MuroEje {
  id: string;
  a: Punto;
  b: Punto;
  /** Espesor del muro en metros (p. ej. 0.14 para block de 14 cm). */
  espesor: number;
}

/** Polígono simple (anillo cerrado, sin repetir el primer punto al final). */
export type Poligono = Punto[];

/** Tablero detectado: un recinto cerrado delimitado por ejes de muro. */
export interface TableroDetectado {
  /** Ids de los muros que forman el perímetro, en orden de recorrido. */
  muroIds: string[];
  /** Vértices del perímetro (los nodos del grafo), en orden de recorrido. */
  perimetro: Poligono;
  /** Área del tablero en m² (medida a ejes de muro). */
  areaM2: number;
}
```

### `src/lib/geometry/muros.ts`
Ejes → polígonos reales de muro con clipper-lib (offset + unión).

```ts
// Conversión de ejes de muro (segmentos sin espesor) a polígonos reales de muro,
// con esquinas bien unidas, usando clipper-lib (offset + unión booleana).
//
// clipper-lib trabaja con coordenadas ENTERAS, así que escalamos los metros
// por ESCALA_CLIPPER antes de operar y des-escalamos al devolver resultados.

import ClipperLib from 'clipper-lib';
import type { MuroEje, Poligono, Punto } from './tipos';

/** 1 m = 10 000 unidades clipper → precisión de 0.1 mm, suficiente de sobra. */
const ESCALA_CLIPPER = 10_000;

type ClipperPunto = { X: number; Y: number };
type ClipperPath = ClipperPunto[];

function aClipper(p: Punto): ClipperPunto {
  return {
    X: Math.round(p.x * ESCALA_CLIPPER),
    Y: Math.round(p.y * ESCALA_CLIPPER),
  };
}

function deClipper(path: ClipperPath): Poligono {
  return path.map((p) => ({ x: p.X / ESCALA_CLIPPER, y: p.Y / ESCALA_CLIPPER }));
}

/**
 * Convierte UN eje de muro a su polígono (rectángulo) real,
 * expandiendo el segmento por espesor/2 hacia cada lado.
 * Extremos cuadrados (etOpenSquare): el rectángulo se extiende espesor/2 más
 * allá de cada nodo del eje. Así, cuando dos muros se encuentran en una
 * esquina o en T, la unión booleana produce una junta llena y limpia
 * (sin la muesca que dejarían los extremos rectos en la esquina exterior).
 */
export function ejeAPoligono(muro: MuroEje): Poligono[] {
  const offset = new ClipperLib.ClipperOffset(2, 0.25);
  offset.AddPath(
    [aClipper(muro.a), aClipper(muro.b)],
    ClipperLib.JoinType.jtMiter,
    ClipperLib.EndType.etOpenSquare,
  );
  const solucion: ClipperPath[] = [];
  offset.Execute(solucion, (muro.espesor / 2) * ESCALA_CLIPPER);
  return solucion.map(deClipper);
}

/**
 * Convierte TODOS los ejes a polígonos y los une en una sola masa de muro:
 * donde dos muros se tocan o cruzan, la unión produce esquinas limpias
 * (sin traslapes dobles ni huecos en las juntas).
 * Devuelve una lista de polígonos (puede haber varios si hay muros sueltos).
 */
export function murosAPoligonos(muros: MuroEje[]): Poligono[] {
  if (muros.length === 0) return [];
  const clipper = new ClipperLib.Clipper();
  for (const muro of muros) {
    const offset = new ClipperLib.ClipperOffset(2, 0.25);
    offset.AddPath(
      [aClipper(muro.a), aClipper(muro.b)],
      ClipperLib.JoinType.jtMiter,
      ClipperLib.EndType.etOpenSquare,
    );
    const rect: ClipperPath[] = [];
    offset.Execute(rect, (muro.espesor / 2) * ESCALA_CLIPPER);
    clipper.AddPaths(rect, ClipperLib.PolyType.ptSubject, true);
  }
  const solucion: ClipperPath[] = [];
  clipper.Execute(
    ClipperLib.ClipType.ctUnion,
    solucion,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero,
  );
  return solucion.map(deClipper);
}

/** Área de un polígono en m² (shoelace, valor absoluto). */
export function areaPoligonoM2(poligono: Poligono): number {
  let suma = 0;
  for (let i = 0; i < poligono.length; i++) {
    const p = poligono[i];
    const q = poligono[(i + 1) % poligono.length];
    suma += p.x * q.y - q.x * p.y;
  }
  return Math.abs(suma) / 2;
}
```

### `src/lib/geometry/tableros.ts`
Detección de tableros cerrados con grafo half-edge.

```ts
// Detección automática de tableros (recintos cerrados) a partir de los EJES
// de muro, usando un grafo planar con recorrido tipo half-edge:
//
//   1. Los extremos de los ejes se agrupan en nodos (con tolerancia de snap).
//   2. Cada eje genera dos medias-aristas dirigidas (ida y vuelta).
//   3. En cada nodo, las medias-aristas salientes se ordenan por ángulo.
//   4. Recorrer "siempre girando lo más a la derecha posible" traza las caras
//      del grafo planar. Las caras interiores (con área encerrada) son los
//      tableros; la cara exterior se descarta por el signo de su área.
//
// El área se calcula con la fórmula del polígono (shoelace) sobre los nodos
// del perímetro — es decir, área medida A EJES de muro, que es lo que usa
// la metodología AGIES para tableros y áreas tributarias.

import type { MuroEje, Punto, TableroDetectado } from './tipos';

interface MediaArista {
  desde: number; // índice de nodo
  hacia: number; // índice de nodo
  muroId: string;
  gemela: number; // índice de la media-arista opuesta
  siguiente: number; // índice de la siguiente media-arista en la cara (se llena luego)
}

/** Área con signo (shoelace, sin valor absoluto). Positiva si el recorrido es antihorario en un plano con Y hacia arriba. */
function areaConSigno(puntos: Punto[]): number {
  let suma = 0;
  for (let i = 0; i < puntos.length; i++) {
    const p = puntos[i];
    const q = puntos[(i + 1) % puntos.length];
    suma += p.x * q.y - q.x * p.y;
  }
  return suma / 2;
}

/**
 * Detecta los tableros cerrados formados por los ejes de muro.
 * `toleranciaM`: distancia máxima (en metros) para considerar que dos extremos
 * de muro son el mismo nodo (snap). Con la grilla del editor esto casi no
 * importa, pero hace la detección robusta a errores de redondeo.
 */
export function detectarTableros(
  muros: MuroEje[],
  toleranciaM = 0.001,
): TableroDetectado[] {
  if (muros.length < 3) return [];

  // --- 1. Nodos con snap por tolerancia -----------------------------------
  const nodos: Punto[] = [];
  const indicePorClave = new Map<string, number>();
  const nodoDe = (p: Punto): number => {
    const clave = `${Math.round(p.x / toleranciaM)}|${Math.round(p.y / toleranciaM)}`;
    const existente = indicePorClave.get(clave);
    if (existente !== undefined) return existente;
    const indice = nodos.length;
    nodos.push(p);
    indicePorClave.set(clave, indice);
    return indice;
  };

  // --- 2. Medias-aristas (dos por muro) -----------------------------------
  const aristas: MediaArista[] = [];
  for (const muro of muros) {
    const na = nodoDe(muro.a);
    const nb = nodoDe(muro.b);
    if (na === nb) continue; // muro degenerado (largo ~0), se ignora
    const i = aristas.length;
    aristas.push({ desde: na, hacia: nb, muroId: muro.id, gemela: i + 1, siguiente: -1 });
    aristas.push({ desde: nb, hacia: na, muroId: muro.id, gemela: i, siguiente: -1 });
  }

  // --- 3. Ordenar salientes por ángulo en cada nodo ------------------------
  const salientesPorNodo: number[][] = nodos.map(() => []);
  aristas.forEach((arista, i) => salientesPorNodo[arista.desde].push(i));
  const anguloDe = (i: number): number => {
    const a = aristas[i];
    const p = nodos[a.desde];
    const q = nodos[a.hacia];
    return Math.atan2(q.y - p.y, q.x - p.x);
  };
  for (const salientes of salientesPorNodo) {
    salientes.sort((i, j) => anguloDe(i) - anguloDe(j));
  }

  // --- 4. Enlazar cada media-arista con la siguiente de su cara ------------
  // Al llegar al nodo destino, la siguiente arista de la cara es la que está
  // justo ANTES de la gemela en el orden angular (giro máximo a la derecha).
  for (let i = 0; i < aristas.length; i++) {
    const salientes = salientesPorNodo[aristas[i].hacia];
    const posGemela = salientes.indexOf(aristas[i].gemela);
    aristas[i].siguiente = salientes[(posGemela - 1 + salientes.length) % salientes.length];
  }

  // --- 5. Recorrer las caras ------------------------------------------------
  const visitada = new Array<boolean>(aristas.length).fill(false);
  const tableros: TableroDetectado[] = [];
  for (let inicio = 0; inicio < aristas.length; inicio++) {
    if (visitada[inicio]) continue;
    const perimetro: Punto[] = [];
    const muroIds: string[] = [];
    let actual = inicio;
    do {
      visitada[actual] = true;
      perimetro.push(nodos[aristas[actual].desde]);
      muroIds.push(aristas[actual].muroId);
      actual = aristas[actual].siguiente;
    } while (actual !== inicio);

    // Con la regla del paso 4 (giro a la derecha), las caras interiores se
    // recorren en sentido antihorario → área con signo POSITIVA.
    // La cara exterior sale negativa y las aristas colgantes suman ~0.
    const area = areaConSigno(perimetro);
    if (area > 1e-6) {
      tableros.push({
        muroIds,
        perimetro,
        areaM2: area,
      });
    }
  }

  // Tableros más grandes primero, solo por presentación estable.
  tableros.sort((t1, t2) => t2.areaM2 - t1.areaM2);
  return tableros;
}
```

### `src/lib/geometry/index.ts`
**REEMPLAZA** el placeholder existente de la Fase 1.

```ts
// Módulo de geometría del plano (Fase 3 — spike geométrico).
export type { MuroEje, Poligono, Punto, TableroDetectado } from './tipos';
export { areaPoligonoM2, ejeAPoligono, murosAPoligonos } from './muros';
export { detectarTableros } from './tableros';
```

### `src/lib/geometry/__tests__/geometria.test.ts`
Las 8 pruebas verificadas (vitest).

```ts
import { describe, expect, it } from 'vitest';
import { areaPoligonoM2, ejeAPoligono, murosAPoligonos } from '../muros';
import { detectarTableros } from '../tableros';
import type { MuroEje } from '../tipos';

const muro = (id: string, ax: number, ay: number, bx: number, by: number, espesor = 0.14): MuroEje => ({
  id,
  a: { x: ax, y: ay },
  b: { x: bx, y: by },
  espesor,
});

describe('ejeAPoligono / murosAPoligonos (clipper)', () => {
  it('convierte un eje horizontal de 4 m y 14 cm en un rectángulo', () => {
    const poligonos = ejeAPoligono(muro('m1', 0, 0, 4, 0));
    expect(poligonos).toHaveLength(1);
    // extremos cuadrados: el rectángulo mide (4 + 0.14) × 0.14
    expect(areaPoligonoM2(poligonos[0])).toBeCloseTo((4 + 0.14) * 0.14, 3);
  });

  it('une dos muros en L en una sola masa con la esquina llena', () => {
    const poligonos = murosAPoligonos([muro('m1', 0, 0, 4, 0), muro('m2', 0, 0, 0, 3)]);
    expect(poligonos).toHaveLength(1);
    // (4+0.14)·0.14 + (3+0.14)·0.14 − 0.14² de traslape en la junta
    const esperado = 4.14 * 0.14 + 3.14 * 0.14 - 0.14 * 0.14;
    expect(areaPoligonoM2(poligonos[0])).toBeCloseTo(esperado, 3);
  });

  it('mantiene separados dos muros que no se tocan', () => {
    const poligonos = murosAPoligonos([muro('m1', 0, 0, 4, 0), muro('m2', 0, 2, 4, 2)]);
    expect(poligonos).toHaveLength(2);
  });
});

describe('detectarTableros (grafo half-edge)', () => {
  it('detecta un cuarto rectangular de 4×3 m y calcula 12 m²', () => {
    const tableros = detectarTableros([
      muro('m1', 0, 0, 4, 0),
      muro('m2', 4, 0, 4, 3),
      muro('m3', 4, 3, 0, 3),
      muro('m4', 0, 3, 0, 0),
    ]);
    expect(tableros).toHaveLength(1);
    expect(tableros[0].areaM2).toBeCloseTo(12, 6);
    expect(tableros[0].perimetro).toHaveLength(4);
    expect([...tableros[0].muroIds].sort()).toEqual(['m1', 'm2', 'm3', 'm4']);
  });

  it('detecta dos cuartos que comparten un muro medianero', () => {
    const tableros = detectarTableros([
      // rectángulo exterior de 8×3 con divisor en x=4
      muro('inf-izq', 0, 0, 4, 0),
      muro('inf-der', 4, 0, 8, 0),
      muro('der', 8, 0, 8, 3),
      muro('sup-der', 8, 3, 4, 3),
      muro('sup-izq', 4, 3, 0, 3),
      muro('izq', 0, 3, 0, 0),
      muro('divisor', 4, 0, 4, 3),
    ]);
    expect(tableros).toHaveLength(2);
    expect(tableros[0].areaM2).toBeCloseTo(12, 6);
    expect(tableros[1].areaM2).toBeCloseTo(12, 6);
    // el divisor pertenece al perímetro de ambos tableros
    expect(tableros[0].muroIds).toContain('divisor');
    expect(tableros[1].muroIds).toContain('divisor');
  });

  it('no reporta tableros si la figura no cierra', () => {
    const tableros = detectarTableros([
      muro('m1', 0, 0, 4, 0),
      muro('m2', 4, 0, 4, 3),
      muro('m3', 4, 3, 0, 3),
      // falta el cuarto muro
    ]);
    expect(tableros).toHaveLength(0);
  });

  it('ignora muros colgantes que no forman parte de un recinto', () => {
    const tableros = detectarTableros([
      muro('m1', 0, 0, 4, 0),
      muro('m2', 4, 0, 4, 3),
      muro('m3', 4, 3, 0, 3),
      muro('m4', 0, 3, 0, 0),
      muro('colgante', 4, 0, 6, 0), // muñón que sale del cuarto
    ]);
    expect(tableros).toHaveLength(1);
    expect(tableros[0].areaM2).toBeCloseTo(12, 6);
    expect(tableros[0].muroIds).not.toContain('colgante');
  });

  it('une extremos casi coincidentes gracias a la tolerancia de snap', () => {
    const tableros = detectarTableros([
      muro('m1', 0, 0, 4, 0),
      muro('m2', 4.0004, 0.0003, 4, 3), // arranca a menos de 1 mm del extremo de m1... no: 0.4 mm en x
      muro('m3', 4, 3, 0, 3),
      muro('m4', 0, 3, 0, 0.0004),
    ]);
    expect(tableros).toHaveLength(1);
    expect(tableros[0].areaM2).toBeCloseTo(12, 2);
  });
});
```

### `src/components/spike/EditorSpike.tsx`
Canvas Konva del spike (componente cliente). Crear también la carpeta `src/components/spike/`.

```tsx
'use client';

// Fase 3 — Spike geométrico.
// Canvas mínimo para validar el stack de geometría:
//   trazar ejes de muro → polígonos reales (clipper) → detección de tableros
//   (half-edge) → área del tablero en m².
//
// Interacción:
//   - Clic: coloca el primer punto del muro; cada clic siguiente crea un muro
//     encadenado desde el punto anterior (con snap a la grilla de 0.5 m).
//   - Esc o clic derecho: termina la cadena actual.
//   - Botones: cambiar espesor, deshacer último muro, limpiar todo.

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Circle, Layer, Line, Stage, Text } from 'react-konva';
import type Konva from 'konva';
import { detectarTableros, murosAPoligonos } from '@/lib/geometry';
import type { MuroEje, Poligono, Punto } from '@/lib/geometry';

const PX_POR_M = 60; // escala de render: 60 px = 1 m
const SNAP_M = 0.5; // grilla de dibujo
const ANCHO_PX = 960;
const ALTO_PX = 600;
const ESPESORES = [0.14, 0.19] as const;

const aPx = (p: Punto): Punto => ({ x: p.x * PX_POR_M, y: p.y * PX_POR_M });

const snap = (p: Punto): Punto => ({
  x: Math.round(p.x / SNAP_M) * SNAP_M,
  y: Math.round(p.y / SNAP_M) * SNAP_M,
});

function puntoDelEvento(e: Konva.KonvaEventObject<MouseEvent>): Punto | null {
  const pos = e.target.getStage()?.getPointerPosition();
  if (!pos) return null;
  return snap({ x: pos.x / PX_POR_M, y: pos.y / PX_POR_M });
}

function aplanarPx(poligono: Poligono): number[] {
  return poligono.flatMap((p) => [p.x * PX_POR_M, p.y * PX_POR_M]);
}

function centroide(poligono: Poligono): Punto {
  const n = poligono.length;
  const suma = poligono.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
    x: 0,
    y: 0,
  });
  return { x: suma.x / n, y: suma.y / n };
}

export default function EditorSpike() {
  const [muros, setMuros] = useState<MuroEje[]>([]);
  const [espesor, setEspesor] = useState<number>(ESPESORES[0]);
  const [puntoActivo, setPuntoActivo] = useState<Punto | null>(null);
  const [cursor, setCursor] = useState<Punto | null>(null);
  const [contador, setContador] = useState(1);

  // Derivados: la geometría se recalcula en cada edición (son puros y rápidos).
  const poligonosMuro = useMemo(() => murosAPoligonos(muros), [muros]);
  const tableros = useMemo(() => detectarTableros(muros), [muros]);

  const terminarCadena = useCallback(() => setPuntoActivo(null), []);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') terminarCadena();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [terminarCadena]);

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) return; // el clic derecho solo termina la cadena
    const p = puntoDelEvento(e);
    if (!p) return;
    if (!puntoActivo) {
      setPuntoActivo(p);
      return;
    }
    if (p.x === puntoActivo.x && p.y === puntoActivo.y) return; // muro de largo 0
    setMuros((previos) => [
      ...previos,
      { id: `M${contador}`, a: puntoActivo, b: p, espesor },
    ]);
    setContador((c) => c + 1);
    setPuntoActivo(p); // encadenar el siguiente muro
  };

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setCursor(puntoDelEvento(e));
  };

  const lineasGrilla = useMemo(() => {
    const lineas: { key: string; points: number[] }[] = [];
    for (let x = 0; x <= ANCHO_PX; x += SNAP_M * PX_POR_M) {
      lineas.push({ key: `v${x}`, points: [x, 0, x, ALTO_PX] });
    }
    for (let y = 0; y <= ALTO_PX; y += SNAP_M * PX_POR_M) {
      lineas.push({ key: `h${y}`, points: [0, y, ANCHO_PX, y] });
    }
    return lineas;
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>
        Spike geométrico — muros y detección de tableros
      </h1>
      <p style={{ margin: '8px 0', color: '#555' }}>
        Clic para trazar ejes de muro (snap a {SNAP_M} m) · Esc o clic derecho
        para terminar la cadena · área medida a ejes.
      </p>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
        <label>
          Espesor:{' '}
          <select
            value={espesor}
            onChange={(ev) => setEspesor(Number(ev.target.value))}
          >
            {ESPESORES.map((e) => (
              <option key={e} value={e}>
                {(e * 100).toFixed(0)} cm
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => setMuros((m) => m.slice(0, -1))}>
          Deshacer muro
        </button>
        <button
          onClick={() => {
            setMuros([]);
            setPuntoActivo(null);
            setContador(1);
          }}
        >
          Limpiar
        </button>
        <span style={{ color: '#555' }}>
          {muros.length} muro(s) · {tableros.length} tablero(s) detectado(s)
        </span>
      </div>

      <div
        style={{ border: '1px solid #ccc', width: ANCHO_PX, cursor: 'crosshair' }}
        onContextMenu={(ev) => {
          ev.preventDefault();
          terminarCadena();
        }}
      >
        <Stage
          width={ANCHO_PX}
          height={ALTO_PX}
          onClick={onClick}
          onMouseMove={onMouseMove}
        >
          {/* Grilla */}
          <Layer listening={false}>
            {lineasGrilla.map((l) => (
              <Line key={l.key} points={l.points} stroke="#eee" strokeWidth={1} />
            ))}
          </Layer>

          {/* Tableros detectados (debajo de los muros) */}
          <Layer listening={false}>
            {tableros.map((t, i) => {
              const c = aPx(centroide(t.perimetro));
              return (
                <Fragment key={`t${i}`}>
                  <Line
                    points={aplanarPx(t.perimetro)}
                    closed
                    fill="rgba(46, 160, 67, 0.25)"
                    stroke="#2ea043"
                    strokeWidth={1.5}
                  />
                  <Text
                    x={c.x - 60}
                    y={c.y - 10}
                    width={120}
                    align="center"
                    text={`Tablero ${i + 1}\n${t.areaM2.toFixed(2)} m²`}
                    fontSize={14}
                    fontStyle="bold"
                    fill="#1a7f37"
                  />
                </Fragment>
              );
            })}
          </Layer>

          {/* Polígonos reales de muro (clipper) */}
          <Layer listening={false}>
            {poligonosMuro.map((poligono, i) => (
              <Line
                key={`p${i}`}
                points={aplanarPx(poligono)}
                closed
                fill="rgba(90, 90, 90, 0.85)"
                stroke="#333"
                strokeWidth={1}
              />
            ))}
          </Layer>

          {/* Ejes, nodos y previsualización */}
          <Layer listening={false}>
            {muros.map((m) => (
              <Line
                key={m.id}
                points={[aPx(m.a).x, aPx(m.a).y, aPx(m.b).x, aPx(m.b).y]}
                stroke="#d33"
                strokeWidth={1}
                dash={[6, 4]}
              />
            ))}
            {muros.flatMap((m) => [m.a, m.b]).map((p, i) => (
              <Circle
                key={`n${i}`}
                x={aPx(p).x}
                y={aPx(p).y}
                radius={3}
                fill="#d33"
              />
            ))}
            {puntoActivo && cursor && (
              <Line
                points={[
                  aPx(puntoActivo).x,
                  aPx(puntoActivo).y,
                  aPx(cursor).x,
                  aPx(cursor).y,
                ]}
                stroke="#08c"
                strokeWidth={2}
                dash={[8, 4]}
              />
            )}
            {puntoActivo && (
              <Circle
                x={aPx(puntoActivo).x}
                y={aPx(puntoActivo).y}
                radius={5}
                stroke="#08c"
                strokeWidth={2}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {tableros.length > 0 && (
        <ul style={{ marginTop: 12 }}>
          {tableros.map((t, i) => (
            <li key={i}>
              <strong>Tablero {i + 1}:</strong> {t.areaM2.toFixed(2)} m² — muros{' '}
              {[...new Set(t.muroIds)].join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### `src/app/spike/page.tsx`
Página de la ruta `/spike`.

```tsx
'use client';

import dynamic from 'next/dynamic';

// react-konva necesita `window`; el editor se carga solo en el cliente.
// (En Next 16, `dynamic(..., { ssr: false })` debe usarse dentro de un
// componente cliente — por eso esta página lleva 'use client'.)
const EditorSpike = dynamic(() => import('@/components/spike/EditorSpike'), {
  ssr: false,
});

export default function SpikePage() {
  return <EditorSpike />;
}
```

## 4. Verificar que todo pasa

```
npm test
npm run lint
npm run build
```

Esperado: **8 pruebas pasan** (3 de clipper/muros, 5 de detección de tableros), lint sin errores nuevos, build sin errores.

## 5. Prueba manual de la página /spike

```
npm run dev
```

Abre `http://localhost:3000/spike` y verifica, en este orden:

1. **Cuarto simple:** dibuja un rectángulo de 4×3 m (los clics hacen snap a la grilla de 0.5 m; cada celda de la grilla es 0.5 m). Al cerrar el cuarto muro debe aparecer el relleno verde del tablero con la etiqueta "Tablero 1 — 12.00 m²". Termina la cadena con Esc o clic derecho.
2. **Esquinas:** los polígonos grises de muro deben verse como una sola masa con esquinas llenas (sin muescas ni traslapes visibles).
3. **Dos cuartos:** agrega un muro divisor vertical en medio de un rectángulo de 8×3 → deben aparecer 2 tableros de 12.00 m² cada uno.
4. **Muro colgante:** agrega un muro suelto que salga de una esquina sin cerrar nada → no debe aparecer ningún tablero nuevo ni romperse los existentes.
5. **Deshacer / Limpiar / cambio de espesor** (14 ↔ 19 cm) funcionan.

Si el punto 1 funciona, el criterio de "listo para avanzar" de la Fase 3 está cumplido.

## 6. Agregar las pruebas al CI

En `.github/workflows/ci.yml`, agrega el paso de pruebas entre lint y build:

```yaml
- run: npm test
```

(Ajústalo al formato que ya tenga el archivo — el objetivo es que el CI corra `npm ci`, lint, test y build.)

## 7. Commit y push

```
git add -A
git commit -m "Fase 3: spike geométrico — muros con espesor (clipper), detección de tableros (half-edge) y canvas /spike"
git push
```

## 8. Al terminar

Resume en un mensaje corto: confirmación de que las 8 pruebas + lint + build pasaron, resultado de la prueba manual de `/spike` (área del cuarto de 4×3), y cualquier corrección que hayas tenido que hacer sobre el código entregado (idealmente ninguna). 

Con eso la Fase 3 queda cerrada y lo siguiente es la **Fase 4 (motor de reglas AGIES)** — sus insumos ya existen: las tablas transcritas en `src/lib/data/tablas/` (Fase 2) y ahora la detección de tableros y áreas (Fase 3).

---

## Apéndice — notas de diseño (para referencia, no requieren acción)

- **Escala clipper:** clipper-lib opera con enteros; el módulo escala 1 m = 10 000 unidades (precisión 0.1 mm) y des-escala al devolver.
- **Extremos de muro `etOpenSquare`:** cada rectángulo de muro se extiende `espesor/2` más allá de cada nodo del eje. Así las esquinas en L y en T quedan llenas tras la unión booleana (con extremos rectos `etOpenButt` quedaba una muesca en la esquina exterior — se detectó en las pruebas). El costo es que un extremo libre de muro sobresale `espesor/2` del eje; es cosmético y aceptable para el editor.
- **Detección de tableros sobre EJES, no sobre polígonos:** el grafo half-edge se construye con los ejes de muro (nodos con snap de 1 mm de tolerancia). Regla de recorrido: en cada nodo se toma la arista "girando lo más a la derecha"; con esa regla las caras interiores salen con área con signo positiva y la cara exterior negativa — así se filtra. Los muros colgantes producen caras degeneradas de área ~0 y se descartan solos.
- **El área reportada es a ejes** (shoelace sobre los nodos del perímetro), que es lo que la metodología AGIES usa para tableros/áreas tributarias.
- **Rendimiento:** todo se recalcula en cada edición (useMemo); para decenas de muros es instantáneo. Si en la Fase 5 el plano crece mucho, se optimiza entonces — no antes.
