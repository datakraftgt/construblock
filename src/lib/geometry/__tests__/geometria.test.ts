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
