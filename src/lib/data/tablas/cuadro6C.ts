export interface FilaMochetaCarga {
  niveles: 1 | 2 | 3;
  numVigas: 1 | 2 | 3;
  pared14: { seccion: string; refuerzo: string };
  pared19: { seccion: string; refuerzo: string };
}

/** Cuadro 6-C — Mochetas de carga (usar la mayor entre esta tabla y el refuerzo sísmico 5-B/5-C). */
export const CUADRO_6C_MOCHETAS_CARGA: FilaMochetaCarga[] = [
  { niveles: 1, numVigas: 1, pared14: { seccion: '14x14', refuerzo: '4#4' }, pared19: { seccion: '19x15', refuerzo: '4#4' } },
  { niveles: 1, numVigas: 2, pared14: { seccion: '14x14', refuerzo: '4#4' }, pared19: { seccion: '19x15', refuerzo: '4#4' } },
  { niveles: 1, numVigas: 3, pared14: { seccion: '14x20', refuerzo: '4#4' }, pared19: { seccion: '19x20', refuerzo: '4#4' } },
  { niveles: 2, numVigas: 1, pared14: { seccion: '14x14', refuerzo: '4#4' }, pared19: { seccion: '19x20', refuerzo: '4#4' } },
  { niveles: 2, numVigas: 2, pared14: { seccion: '14x30', refuerzo: '6#4' }, pared19: { seccion: '19x20', refuerzo: '4#4' } },
  { niveles: 2, numVigas: 3, pared14: { seccion: '25x25', refuerzo: '8#4' }, pared19: { seccion: '25x25', refuerzo: '8#4' } },
  { niveles: 3, numVigas: 1, pared14: { seccion: '14x20', refuerzo: '6#4' }, pared19: { seccion: '19x20', refuerzo: '6#4' } },
  { niveles: 3, numVigas: 2, pared14: { seccion: '25x25', refuerzo: '8#4' }, pared19: { seccion: '25x25', refuerzo: '8#4' } },
  { niveles: 3, numVigas: 3, pared14: { seccion: '30x30', refuerzo: '8#4' }, pared19: { seccion: '30x30', refuerzo: '8#4' } },
];

export interface FilaColumnaAislada {
  niveles: 1 | 2 | 3;
  numVigas: 2 | 3 | 4;
  seccion: string;
  refuerzo: string;
}

/** Columnas aisladas: NUNCA cuentan para resistir sismo, solo peso. */
export const CUADRO_6C_COLUMNAS_AISLADAS: FilaColumnaAislada[] = [
  { niveles: 1, numVigas: 2, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 2, numVigas: 2, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 3, numVigas: 2, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 1, numVigas: 3, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 2, numVigas: 3, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 3, numVigas: 3, seccion: '30x30', refuerzo: '8#5' },
  { niveles: 1, numVigas: 4, seccion: '25x25', refuerzo: '4#5' },
  { niveles: 2, numVigas: 4, seccion: '30x30', refuerzo: '8#5' },
  { niveles: 3, numVigas: 4, seccion: '35x35', refuerzo: '8#5' },
];
