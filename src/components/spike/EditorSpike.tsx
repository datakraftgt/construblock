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
