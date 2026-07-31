import type { RangoNumerico } from './tipos';

export type CalibreAcero = '#2' | '4.5mm' | '5.5mm' | '6.2-6.4mm' | '#3' | '#4' | '#5';

export interface FilaCapacidadBarra {
  calibre: CalibreAcero;
  seccionCm2: number | RangoNumerico;
  grado: number;
  capacidadNominalLb: number | RangoNumerico;
  usoPermitido: string;
}

/** Cuadro 5-A (Cap.5, pág.52) — Comparación de capacidades de barras. */
export const CUADRO_5A_CAP5_BARRAS: FilaCapacidadBarra[] = [
  { calibre: '#2', seccionCm2: 0.32, grado: 30, capacidadNominalLb: 1500, usoPermitido: 'Solo estribos/eslabones' },
  { calibre: '4.5mm', seccionCm2: 0.159, grado: 70, capacidadNominalLb: 1700, usoPermitido: 'Solo estribos/eslabones y malla de losa' },
  { calibre: '5.5mm', seccionCm2: 0.24, grado: 70, capacidadNominalLb: 2600, usoPermitido: 'Malla soldada en losas; NO en mocheta' },
  { calibre: '6.2-6.4mm', seccionCm2: { min: 0.3, max: 0.32 }, grado: 70, capacidadNominalLb: { min: 3200, max: 3450 }, usoPermitido: 'Mínimo aceptable en mochetas secundarias; usable en losas' },
  { calibre: '#3', seccionCm2: 0.71, grado: 40, capacidadNominalLb: 4400, usoPermitido: 'Uso general (+25% capacidad de emergencia)' },
  { calibre: '#4', seccionCm2: 1.27, grado: 40, capacidadNominalLb: 7800, usoPermitido: 'Uso general (+25% capacidad de emergencia)' },
  { calibre: '#5', seccionCm2: 2.0, grado: 40, capacidadNominalLb: 12300, usoPermitido: 'Uso general (+25% capacidad de emergencia)' },
];

/** Reglas de ajuste por calidad/grado de acero (Base_Conocimiento §3.3). */
export const AJUSTE_ACERO_SIN_CERTIFICAR = 1.2; // incrementar 20% el área requerida
export const AJUSTE_ACERO_GRADO60_CERTIFICADO = 0.7; // reducir a 70%
/** "Hierro de alta resistencia" (Grado 70, ASTM A1094): prohibido en mochetas principales. */
export const GRADO70_PROHIBIDO_EN_MOCHETAS_PRINCIPALES = true;
