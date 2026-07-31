import type { TipoBlock, ClaseBlock, TipoMortero } from '../block';
import type { RangoNumerico } from './tipos';

export interface FilaPesoBlock {
  tipo: TipoBlock;
  clase: ClaseBlock;
  espesorCm: 14 | 19;
  pesoAproxLb: RangoNumerico;
}

/** Cuadro 5-A (Cap.4, pág.37) block DT + Cuadro 5-B (Cap.4, pág.38) block UT. */
export const CUADRO_PESO_BLOCK: FilaPesoBlock[] = [
  { tipo: 'DT', clase: 'A', espesorCm: 14, pesoAproxLb: { min: 32, max: 35 } },
  { tipo: 'DT', clase: 'A', espesorCm: 19, pesoAproxLb: { min: 37, max: 41 } },
  { tipo: 'DT', clase: 'B', espesorCm: 14, pesoAproxLb: { min: 27, max: 31 } },
  { tipo: 'DT', clase: 'B', espesorCm: 19, pesoAproxLb: { min: 33, max: 36 } },
  { tipo: 'DT', clase: 'C', espesorCm: 14, pesoAproxLb: { min: 24, max: 27 } },
  { tipo: 'DT', clase: 'C', espesorCm: 19, pesoAproxLb: { min: 29, max: 33 } },
  { tipo: 'DT', clase: 'D', espesorCm: 14, pesoAproxLb: { min: 21, max: 23 } },
  { tipo: 'DT', clase: 'D', espesorCm: 19, pesoAproxLb: { min: 24, max: 27 } },
  { tipo: 'UT', clase: 'A', espesorCm: 14, pesoAproxLb: { min: 28, max: 30 } },
  { tipo: 'UT', clase: 'A', espesorCm: 19, pesoAproxLb: { min: 34, max: 37 } },
  { tipo: 'UT', clase: 'B', espesorCm: 14, pesoAproxLb: { min: 25, max: 27 } },
  { tipo: 'UT', clase: 'B', espesorCm: 19, pesoAproxLb: { min: 30, max: 33 } },
  { tipo: 'UT', clase: 'C', espesorCm: 14, pesoAproxLb: { min: 21, max: 23 } },
  { tipo: 'UT', clase: 'C', espesorCm: 19, pesoAproxLb: { min: 25, max: 29 } },
  { tipo: 'UT', clase: 'D', espesorCm: 14, pesoAproxLb: { min: 18, max: 20 } },
  { tipo: 'UT', clase: 'D', espesorCm: 19, pesoAproxLb: { min: 21, max: 24 } },
];

export interface FilaAreaNetaBlock {
  tipo: TipoBlock;
  espesorCm: 14 | 19;
  areaNetaPorcentaje: RangoNumerico;
}

/** Área neta por tipo/espesor (no varía por clase). */
export const CUADRO_AREA_NETA_BLOCK: FilaAreaNetaBlock[] = [
  { tipo: 'DT', espesorCm: 14, areaNetaPorcentaje: { min: 53, max: 57 } },
  { tipo: 'DT', espesorCm: 19, areaNetaPorcentaje: { min: 52, max: 56 } },
  { tipo: 'UT', espesorCm: 14, areaNetaPorcentaje: { min: 51, max: 53 } },
  { tipo: 'UT', espesorCm: 19, areaNetaPorcentaje: { min: 50, max: 52 } },
];

/** Resistencia mínima (kg/cm² área neta) por clase — §3.1. Clase D no normada. */
export const RESISTENCIA_MINIMA_KGCM2: Record<ClaseBlock, number> = {
  A: 140,
  B: 100,
  C: 66,
  D: 50,
};

/** Cuadro 5-C (Cap.4, pág.40) — Proporciones de mortero en volumen. */
export const PROPORCIONES_MORTERO: Record<
  TipoMortero,
  { cemento: number; calHidratada: string; arenaDeRio: string }
> = {
  M: { cemento: 1, calHidratada: '1/10 a 1/4', arenaDeRio: '2¼ a 3 × (cemento+cal)' },
  S: { cemento: 1, calHidratada: '1/4 a 1/2', arenaDeRio: '2¼ a 3 × (cemento+cal)' },
  N: { cemento: 1, calHidratada: '1/2 a 1', arenaDeRio: '2¼ a 3 × (cemento+cal)' },
};
