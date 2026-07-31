export type GrupoPiso = 1 | 2 | 3;
export type SistemaMochetaPrincipal = 'DT' | 'UT' | 'DT/UT+graut';

export interface FilaMochetaPrincipal {
  grupo: GrupoPiso;
  sistema: SistemaMochetaPrincipal;
  espesorCm: 14 | 19;
  seccionCm: string;
  seccionAltCm: string; // sección para columnas C/D
  refuerzoA: string;
  refuerzoB: string;
  refuerzoC: string;
  refuerzoD: string;
  areaAceroACm2: number;
  areaAceroBCm2: number;
  areaAceroCCm2: number;
  areaAceroDCm2: number;
}

/**
 * Cuadro 5-B (Cap.5, pág.54-55, arreglos de barras) + Cuadro 5-C (Cap.5,
 * pág.55-56, mismo contenido en área de acero cm²) — Refuerzo de mochetas
 * principales, Grado 40. Grupos de piso: 1=1 piso o último piso de 2-3
 * niveles; 2=primer piso de 2 niveles o segundo de 3; 3=primer piso de 3.
 */
export const CUADRO_MOCHETAS_PRINCIPALES: FilaMochetaPrincipal[] = [
  // Grupo 1
  { grupo: 1, sistema: 'DT', espesorCm: 19, seccionCm: '19x20', seccionAltCm: '19x15', refuerzoA: '4#4+2#3', refuerzoB: '4#4', refuerzoC: '6#3', refuerzoD: '6#3', areaAceroACm2: 5.7, areaAceroBCm2: 4.9, areaAceroCCm2: 4.0, areaAceroDCm2: 3.5 },
  { grupo: 1, sistema: 'DT', espesorCm: 14, seccionCm: '14x20', seccionAltCm: '14x15', refuerzoA: '4#4', refuerzoB: '6#3', refuerzoC: '2#4+2#3', refuerzoD: '4#3', areaAceroACm2: 4.3, areaAceroBCm2: 3.8, areaAceroCCm2: 3.1, areaAceroDCm2: 2.7 },
  { grupo: 1, sistema: 'UT', espesorCm: 19, seccionCm: '19x20', seccionAltCm: '19x15', refuerzoA: '4#4', refuerzoB: '4#4', refuerzoC: '2#4+2#3', refuerzoD: '2#4+2#3', areaAceroACm2: 5.1, areaAceroBCm2: 4.4, areaAceroCCm2: 3.6, areaAceroDCm2: 3.1 },
  { grupo: 1, sistema: 'UT', espesorCm: 14, seccionCm: '14x20', seccionAltCm: '14x15', refuerzoA: '6#3', refuerzoB: '6#3', refuerzoC: '4#3', refuerzoD: '4#3', areaAceroACm2: 3.9, areaAceroBCm2: 3.3, areaAceroCCm2: 2.8, areaAceroDCm2: 2.4 },
  { grupo: 1, sistema: 'DT/UT+graut', espesorCm: 19, seccionCm: '19x20', seccionAltCm: '19x20', refuerzoA: '4#5+2#3', refuerzoB: '4#5', refuerzoC: '4#4+2#3', refuerzoD: '4#4', areaAceroACm2: 8.2, areaAceroBCm2: 7.1, areaAceroCCm2: 5.7, areaAceroDCm2: 5.0 },
  { grupo: 1, sistema: 'DT/UT+graut', espesorCm: 14, seccionCm: '14x25', seccionAltCm: '14x20', refuerzoA: '4#4+2#3', refuerzoB: '4#4+2#3', refuerzoC: '6#3', refuerzoD: '2#4+2#3', areaAceroACm2: 6.0, areaAceroBCm2: 5.2, areaAceroCCm2: 4.2, areaAceroDCm2: 3.7 },
  // Grupo 2
  { grupo: 2, sistema: 'DT', espesorCm: 19, seccionCm: '19x20', seccionAltCm: '19x20', refuerzoA: '4#5+2#3', refuerzoB: '4#5', refuerzoC: '4#4+2#3', refuerzoD: '4#4+2#3', areaAceroACm2: 8.5, areaAceroBCm2: 7.4, areaAceroCCm2: 6.0, areaAceroDCm2: 5.2 },
  { grupo: 2, sistema: 'DT', espesorCm: 14, seccionCm: '14x20', seccionAltCm: '14x20', refuerzoA: '4#4+2#3', refuerzoB: '4#4+2#3', refuerzoC: '4#4', refuerzoD: '2#4+2#3', areaAceroACm2: 6.5, areaAceroBCm2: 5.6, areaAceroCCm2: 4.6, areaAceroDCm2: 4.0 },
  { grupo: 2, sistema: 'UT', espesorCm: 19, seccionCm: '19x20', seccionAltCm: '19x20', refuerzoA: '6#4', refuerzoB: '6#4', refuerzoC: '4#4+2#3', refuerzoD: '4#4+2#3', areaAceroACm2: 7.6, areaAceroBCm2: 6.6, areaAceroCCm2: 5.4, areaAceroDCm2: 4.7 },
  { grupo: 2, sistema: 'UT', espesorCm: 14, seccionCm: '14x20', seccionAltCm: '14x20', refuerzoA: '4#4+2#3', refuerzoB: '4#4', refuerzoC: '4#4', refuerzoD: '6#3', areaAceroACm2: 5.8, areaAceroBCm2: 5.0, areaAceroCCm2: 4.1, areaAceroDCm2: 3.5 },
  { grupo: 2, sistema: 'DT/UT+graut', espesorCm: 19, seccionCm: '19x30', seccionAltCm: '19x25', refuerzoA: '4#5+4#4', refuerzoB: '4#5+2#4', refuerzoC: '4#5+2#3', refuerzoD: '4#5', areaAceroACm2: 12.2, areaAceroBCm2: 10.6, areaAceroCCm2: 8.6, areaAceroDCm2: 7.5 },
  { grupo: 2, sistema: 'DT/UT+graut', espesorCm: 14, seccionCm: '14x30', seccionAltCm: '14x25', refuerzoA: '4#5+2#3', refuerzoB: '4#5', refuerzoC: '4#4+2#3', refuerzoD: '4#4+2#3', areaAceroACm2: 9.0, areaAceroBCm2: 7.8, areaAceroCCm2: 6.3, areaAceroDCm2: 5.5 },
  // Grupo 3
  { grupo: 3, sistema: 'DT', espesorCm: 19, seccionCm: '19x25', seccionAltCm: '19x20', refuerzoA: '4#5+2#4', refuerzoB: '4#5+2#3', refuerzoC: '4#5', refuerzoD: '4#4+2#3', areaAceroACm2: 9.5, areaAceroBCm2: 8.2, areaAceroCCm2: 6.7, areaAceroDCm2: 5.8 },
  { grupo: 3, sistema: 'DT', espesorCm: 14, seccionCm: '14x25', seccionAltCm: '14x20', refuerzoA: '4#5', refuerzoB: '4#4+2#3', refuerzoC: '4#4', refuerzoD: '4#4', areaAceroACm2: 7.2, areaAceroBCm2: 6.3, areaAceroCCm2: 5.1, areaAceroDCm2: 4.4 },
  { grupo: 3, sistema: 'UT', espesorCm: 19, seccionCm: '19x30', seccionAltCm: '19x20', refuerzoA: '4#5+2#3', refuerzoB: '4#5', refuerzoC: '4#4+2#3', refuerzoD: '4#4+2#3', areaAceroACm2: 8.5, areaAceroBCm2: 7.4, areaAceroCCm2: 6.0, areaAceroDCm2: 5.2 },
  { grupo: 3, sistema: 'UT', espesorCm: 14, seccionCm: '14x30', seccionAltCm: '14x20', refuerzoA: '6#4', refuerzoB: '4#4+2#3', refuerzoC: '4#4', refuerzoD: '4#4', areaAceroACm2: 6.4, areaAceroBCm2: 5.6, areaAceroCCm2: 4.5, areaAceroDCm2: 3.9 },
  { grupo: 3, sistema: 'DT/UT+graut', espesorCm: 19, seccionCm: '19x40', seccionAltCm: '19x30', refuerzoA: '4#5+4#4', refuerzoB: '6#5', refuerzoC: '4#5+2#3', refuerzoD: '4#5+2#3', areaAceroACm2: 13.5, areaAceroBCm2: 11.7, areaAceroCCm2: 9.5, areaAceroDCm2: 8.3 },
  { grupo: 3, sistema: 'DT/UT+graut', espesorCm: 14, seccionCm: '14x40', seccionAltCm: '14x35', refuerzoA: '4#5+2#4', refuerzoB: '4#5+2#3', refuerzoC: '6#4', refuerzoD: '4#4+2#3', areaAceroACm2: 10.0, areaAceroBCm2: 8.6, areaAceroCCm2: 7.0, areaAceroDCm2: 6.1 },
];

/** Refuerzo mínimo absoluto en cualquier caso, aunque la tabla indicara menos. */
export const REFUERZO_MINIMO_MOCHETA_PRINCIPAL = { arreglo: '4#3', areaCm2: 2.8 };
