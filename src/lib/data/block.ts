/**
 * Catálogo de tipos y clases de block de concreto (Base_Conocimiento §3.1).
 * Esto es clasificación/catálogo, no las tablas de capacidad de carga
 * (Cuadros 6-A a 6-K) — esas viven en ./tablas.
 */

export type TipoBlock = 'DT' | 'UT'; // Dos Tabiques / Un Tabique
export type ClaseBlock = 'A' | 'B' | 'C' | 'D';
export type EspesorBlock = 14 | 19; // cm
export type ColocacionMortero = 'lecho_completo' | 'lecho_parcial';
export type TipoMortero = 'M' | 'S' | 'N';

export const COLOR_CLASE_BLOCK: Record<ClaseBlock, string> = {
  A: 'Azul',
  B: 'Rojo',
  C: 'Verde',
  D: 'Negro',
};

/** Clase D no está normada por COGUANOR NTG 41054 (acuerdo de facto entre fabricantes). */
export const CLASE_NORMADA: Record<ClaseBlock, boolean> = {
  A: true,
  B: true,
  C: true,
  D: false,
};

/** Compatibilidad Block × Mortero (Cuadro 5-D, Cap.4). Clase D no normada: se trata como Clase C. */
export const MORTERO_COMPATIBLE: Record<ClaseBlock, TipoMortero[]> = {
  A: ['M', 'S'],
  B: ['S'],
  C: ['S'],
  D: ['S'],
};

/** Lecho Completo solo es viable con block DT (con UT solo se puede Lecho Parcial). */
export function lechoCompletoPermitido(tipo: TipoBlock): boolean {
  return tipo === 'DT';
}

export interface EspecificacionBlock {
  tipo: TipoBlock;
  clase: ClaseBlock;
  espesor: EspesorBlock;
  colocacionMortero: ColocacionMortero;
}
