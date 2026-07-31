import type { TipoBlock, ClaseBlock, ColocacionMortero } from '../block';

export interface FilaAnchoCimiento {
  descripcion: string;
  tipoBlock: TipoBlock;
  espesorCm: 14 | 19;
  colocacionMortero?: ColocacionMortero;
  grouteado?: boolean;
  tipoPorClase: Record<ClaseBlock, string>;
}

/** Cuadro 6-E1 — Ancho de cimiento corrido CENTRADO en pared. */
export const CUADRO_6E1_CENTRADO: FilaAnchoCimiento[] = [
  { descripcion: 'DT 19cm, lecho completo', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', tipoPorClase: { A: 'CC6', B: 'CC4', C: 'CC2', D: 'CC1' } },
  { descripcion: 'DT 14cm, lecho completo', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', tipoPorClase: { A: 'CC4', B: 'CC3', C: 'CC1', D: 'CC1' } },
  { descripcion: 'DT 19cm, lecho parcial', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC5', B: 'CC3', C: 'CC2', D: 'CC1' } },
  { descripcion: 'DT 14cm, lecho parcial', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC3', B: 'CC2', C: 'CC1', D: 'CC1' } },
  { descripcion: 'UT 19cm, lecho parcial', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC5', B: 'CC3', C: 'CC1', D: 'CC1' } },
  { descripcion: 'UT 14cm, lecho parcial', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC3', B: 'CC2', C: 'CC1', D: 'CC1' } },
  { descripcion: 'UT/DT + graut, 19cm', tipoBlock: 'UT', espesorCm: 19, grouteado: true, tipoPorClase: { A: 'CC7', B: 'CC6', C: 'CC3', D: 'CC2' } },
  { descripcion: 'UT/DT + graut, 14cm', tipoBlock: 'UT', espesorCm: 14, grouteado: true, tipoPorClase: { A: 'CC6', B: 'CC4', C: 'CC2', D: 'CC1' } },
];

/** Cuadro 6-E2 — Ancho de cimiento EXCÉNTRICO de lindero (sobre-esfuerzo permitido 50%). */
export const CUADRO_6E2_LINDERO: FilaAnchoCimiento[] = [
  { descripcion: 'DT 19cm, lecho completo', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', tipoPorClase: { A: 'CC8-L', B: 'CC6-L', C: 'CC3-L', D: 'CC2-L' } },
  { descripcion: 'DT 14cm, lecho completo', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', tipoPorClase: { A: 'CC6-L', B: 'CC4-L', C: 'CC2-L', D: 'CC1-L' } },
  { descripcion: 'DT 19cm, lecho parcial', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC7-L', B: 'CC5-L', C: 'CC3-L', D: 'CC2-L' } },
  { descripcion: 'DT 14cm, lecho parcial', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC5-L', B: 'CC3-L', C: 'CC2-L', D: 'CC1-L' } },
  { descripcion: 'UT 19cm, lecho parcial', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC7-L', B: 'CC5-L', C: 'CC2-L', D: 'CC1-L' } },
  { descripcion: 'UT 14cm, lecho parcial', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', tipoPorClase: { A: 'CC5-L', B: 'CC3-L', C: 'CC1-L', D: 'CC1-L' } },
  { descripcion: 'UT/DT + graut, 19cm', tipoBlock: 'UT', espesorCm: 19, grouteado: true, tipoPorClase: { A: 'CC9-L', B: 'CC8-L', C: 'CC5-L', D: 'CC3-L' } },
  { descripcion: 'UT/DT + graut, 14cm', tipoBlock: 'UT', espesorCm: 14, grouteado: true, tipoPorClase: { A: 'CC8-L', B: 'CC6-L', C: 'CC3-L', D: 'CC2-L' } },
];

export interface FilaDimensionCimiento {
  tipo: string;
  anchoM: number;
  espesorM: number;
  refuerzoTransversal: string;
  refuerzoLongitudinal: string;
}

/** Cuadro 6-F1 — Dimensiones/refuerzo cimiento corrido CONCÉNTRICO (concreto 210, grado 40). */
export const CUADRO_6F1_CONCENTRICO: FilaDimensionCimiento[] = [
  { tipo: 'CC7', anchoM: 1.0, espesorM: 0.2, refuerzoTransversal: '#3@0.18', refuerzoLongitudinal: '5#3' },
  { tipo: 'CC6', anchoM: 0.8, espesorM: 0.18, refuerzoTransversal: '#3@0.20', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC5', anchoM: 0.7, espesorM: 0.18, refuerzoTransversal: '#3@0.22', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC4', anchoM: 0.6, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC3', anchoM: 0.5, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC2', anchoM: 0.4, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC1', anchoM: 0.3, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
];

/** Cuadro 6-F2 — Dimensiones/refuerzo cimiento corrido de LINDERO. */
export const CUADRO_6F2_LINDERO: FilaDimensionCimiento[] = [
  { tipo: 'CC9-L', anchoM: 1.35, espesorM: 0.22, refuerzoTransversal: '#4@0.28', refuerzoLongitudinal: '6#3' },
  { tipo: 'CC8-L', anchoM: 1.0, espesorM: 0.2, refuerzoTransversal: '#3@0.18', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC7-L', anchoM: 0.9, espesorM: 0.18, refuerzoTransversal: '#3@0.20', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC6-L', anchoM: 0.8, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '4#3' },
  { tipo: 'CC5-L', anchoM: 0.7, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC4-L', anchoM: 0.6, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC3-L', anchoM: 0.5, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC2-L', anchoM: 0.4, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
  { tipo: 'CC1-L', anchoM: 0.3, espesorM: 0.18, refuerzoTransversal: '#3@0.25', refuerzoLongitudinal: '3#3' },
];

export interface FilaZapataSegunElemento {
  elemento: 'mocheta_de_carga' | 'columna_aislada';
  numVigas: number;
  /** Índice 0 = 1 nivel, 1 = 2 niveles, 2 = 3 niveles. null = no aplica en el cuadro original. */
  interior: (string | null)[];
  lindero: (string | null)[];
}

/** Cuadro 6-G — Zapata según mocheta de carga / columna aislada. */
export const CUADRO_6G_ZAPATA_SEGUN_ELEMENTO: FilaZapataSegunElemento[] = [
  { elemento: 'mocheta_de_carga', numVigas: 1, interior: ['Z1', 'Z2', 'Z3'], lindero: ['Z1-L', 'Z2-L', 'Z3-L'] },
  { elemento: 'mocheta_de_carga', numVigas: 2, interior: ['Z2', 'Z4', 'Z5'], lindero: ['Z2-L', 'Z4-L', 'Z5-L'] },
  { elemento: 'mocheta_de_carga', numVigas: 3, interior: ['Z3', 'Z5', 'Z7'], lindero: [null, null, null] },
  { elemento: 'columna_aislada', numVigas: 1, interior: ['Z1', 'Z2', 'Z3'], lindero: ['Z1-L', 'Z2-L', 'Z3-L'] },
  { elemento: 'columna_aislada', numVigas: 2, interior: ['Z2', 'Z4', 'Z5'], lindero: ['Z2-L', 'Z4-L', 'Z5-L'] },
  { elemento: 'columna_aislada', numVigas: 3, interior: ['Z3', 'Z5', 'Z7'], lindero: ['Z3-L', 'Z5-L', 'Z6-L'] },
  { elemento: 'columna_aislada', numVigas: 4, interior: ['Z4', 'Z6', 'Z8'], lindero: [null, null, null] },
];

export interface FilaZapataTipo {
  codigo: string;
  ladoM: number;
  espesorM: number;
  refuerzo: string;
}

/** Cuadro 6-H — Planilla de zapatas-tipo. */
export const CUADRO_6H_ZAPATAS_TIPO: FilaZapataTipo[] = [
  { codigo: 'Z1', ladoM: 0.5, espesorM: 0.18, refuerzo: '#3@20' },
  { codigo: 'Z2', ladoM: 0.7, espesorM: 0.18, refuerzo: '#3@20' },
  { codigo: 'Z3', ladoM: 0.85, espesorM: 0.2, refuerzo: '#4@30' },
  { codigo: 'Z4', ladoM: 1.0, espesorM: 0.2, refuerzo: '#4@30' },
  { codigo: 'Z5', ladoM: 1.2, espesorM: 0.25, refuerzo: '#4@25' },
  { codigo: 'Z6', ladoM: 1.4, espesorM: 0.3, refuerzo: '#4@20' },
  { codigo: 'Z7', ladoM: 1.5, espesorM: 0.35, refuerzo: '#5@28' },
  { codigo: 'Z8', ladoM: 1.7, espesorM: 0.4, refuerzo: '#5@25' },
  { codigo: 'Z1-L', ladoM: 0.6, espesorM: 0.18, refuerzo: '#3@20' },
  { codigo: 'Z2-L', ladoM: 0.8, espesorM: 0.2, refuerzo: '#3@20' },
  { codigo: 'Z3-L', ladoM: 1.0, espesorM: 0.2, refuerzo: '#4@30' },
  { codigo: 'Z4-L', ladoM: 1.2, espesorM: 0.25, refuerzo: '#4@25' },
  { codigo: 'Z5-L', ladoM: 1.4, espesorM: 0.3, refuerzo: '#4@20' },
  { codigo: 'Z6-L', ladoM: 1.7, espesorM: 0.4, refuerzo: '#5@25' },
];
