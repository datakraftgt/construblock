export type TipoSoleraPrincipal = 'humedad' | 'entrepiso' | 'azotea';

export interface FilaSoleraPrincipal {
  tipo: TipoSoleraPrincipal;
  anchoCm: string;
  altoCm: number;
  refuerzo: string;
}

/** Cuadro 5-D (Cap.5, pág.58) — Soleras principales. */
export const CUADRO_5D_SOLERAS_PRINCIPALES: FilaSoleraPrincipal[] = [
  { tipo: 'humedad', anchoCm: '14 o 19', altoCm: 20, refuerzo: '4#3, estribos #2@20cm' },
  { tipo: 'entrepiso', anchoCm: '14 o 19', altoCm: 20, refuerzo: '4#4, estribos #2@20cm' },
  { tipo: 'azotea', anchoCm: '14 o 19', altoCm: 20, refuerzo: '4#3, estribos #2@20cm' },
];

export interface FilaSoleraIntermedia {
  espesorCm: 14 | 19;
  numSoleras: 1 | 2;
  refuerzo: string;
  seccion: string;
}

/** Cuadro 5-E (Cap.5, pág.61) — Soleras intermedias. */
export const CUADRO_5E_SOLERAS_INTERMEDIAS: FilaSoleraIntermedia[] = [
  { espesorCm: 14, numSoleras: 1, refuerzo: '4#3', seccion: '14x20' },
  { espesorCm: 14, numSoleras: 2, refuerzo: '2×[2#3]', seccion: '2×[14x10]' },
  { espesorCm: 19, numSoleras: 1, refuerzo: '4#3', seccion: '19x20' },
  { espesorCm: 19, numSoleras: 2, refuerzo: '2×[2#3]', seccion: '2×[19x10]' },
];

type ClaveEspesorSoleras = '14-1sol' | '14-2sol' | '19-1sol' | '19-2sol';

export interface FilaPinIntermedio {
  calibre: '#3' | '#4' | '#5';
  separacionM: Record<ClaveEspesorSoleras, number | null>; // null = "n/a"
}

/** Cuadro 5-E, Opción A — Pines (refuerzo inter-block), separación según calibre. */
export const CUADRO_5E_OPCION_A_PINES: FilaPinIntermedio[] = [
  { calibre: '#3', separacionM: { '14-1sol': 0.8, '14-2sol': 0.8, '19-1sol': 0.4, '19-2sol': 0.4 } },
  { calibre: '#4', separacionM: { '14-1sol': 1.2, '14-2sol': 1.2, '19-1sol': 0.6, '19-2sol': 0.8 } },
  { calibre: '#5', separacionM: { '14-1sol': null, '14-2sol': null, '19-1sol': 1.0, '19-2sol': 1.0 } },
];

export interface FilaMochetaIntermedia {
  separacionM: number;
  refuerzo: Record<ClaveEspesorSoleras, string | null>; // null = "se omite"
}

/** Cuadro 5-E, Opción B — Mocheta intermedia, según separación S entre mochetas principales. */
export const CUADRO_5E_OPCION_B_MOCHETA_INTERMEDIA: FilaMochetaIntermedia[] = [
  { separacionM: 2.5, refuerzo: { '14-1sol': '2#3 (11x14)', '14-2sol': '2#3 (11x14)', '19-1sol': '2#4 (11x19)', '19-2sol': '2#4 (14x19)' } },
  { separacionM: 3.0, refuerzo: { '14-1sol': '2#3 (11x14)', '14-2sol': '2#3 (11x14)', '19-1sol': '4#3 (14x19)', '19-2sol': '4#3 (14x19)' } },
  { separacionM: 3.5, refuerzo: { '14-1sol': '1#3+1#4 (11x14)', '14-2sol': '1#3+1#4 (11x14)', '19-1sol': '2#3+2#4 (14x19)', '19-2sol': '2#3+2#4 (14x19)' } },
  { separacionM: 4.0, refuerzo: { '14-1sol': '1#3+1#4 (11x14)', '14-2sol': '1#3+1#4 (11x14)', '19-1sol': '2#3+2#4 (14x19)', '19-2sol': '2#3+2#4 (14x19)' } },
  { separacionM: 4.5, refuerzo: { '14-1sol': '2#4 (11x14)', '14-2sol': '2#4 (11x14)', '19-1sol': '4#4 (14x19)', '19-2sol': '4#4 (14x19)' } },
];

export const REGLAS_REFUERZO_INTERMEDIO = {
  separacionMinimaParaOmitirM: 3.0,
  separacionMaximaRecomendadaM: 4.5,
  obligatorioEnZonas: [3, 4] as const, // Amarilla y Anaranjada
  omitibleEnZona: 2 as const, // Blanca
};
