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
