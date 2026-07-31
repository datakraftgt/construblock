export interface FilaDimensionViga {
  largo: string; // '2.0'..'4.5', con sufijo -h30/-h35 para L=3.0
  largoM: number;
  bCm: number[];
  hCm: number;
}

/** Cuadro 6-B — Vigas para entrepisos/azoteas (concreto 210, grado 40). */
export const CUADRO_6B_DIMENSIONES: FilaDimensionViga[] = [
  { largo: '2.0', largoM: 2.0, bCm: [14, 19], hCm: 30 },
  { largo: '2.5', largoM: 2.5, bCm: [14, 19], hCm: 30 },
  { largo: '3.0-h30', largoM: 3.0, bCm: [19], hCm: 30 },
  { largo: '3.0-h35', largoM: 3.0, bCm: [19], hCm: 35 },
  { largo: '3.5', largoM: 3.5, bCm: [19], hCm: 35 },
  { largo: '4.0', largoM: 4.0, bCm: [19], hCm: 35 },
  { largo: '4.5', largoM: 4.5, bCm: [19], hCm: 35 },
];

export interface FilaRefuerzoViga {
  areaTributariaMaxM2: number;
  refuerzoPorLargo: Record<string, string>; // key = 'largo' de arriba
}

export const CUADRO_6B_REFUERZO: FilaRefuerzoViga[] = [
  { areaTributariaMaxM2: 13, refuerzoPorLargo: { '2.0': '3#4', '2.5': '3#4', '3.0-h30': '2#5+1#4', '3.0-h35': '3#4', '3.5': '2#5+1#4', '4.0': '2#5+1#4', '4.5': '3#5' } },
  { areaTributariaMaxM2: 12, refuerzoPorLargo: { '2.0': '3#4', '2.5': '3#4', '3.0-h30': '2#5+1#4', '3.0-h35': '3#4', '3.5': '2#5+1#4', '4.0': '2#5+1#4', '4.5': '2#5+1#4' } },
  { areaTributariaMaxM2: 10, refuerzoPorLargo: { '2.0': '2#4', '2.5': '3#4', '3.0-h30': '3#4', '3.0-h35': '3#4', '3.5': '3#4', '4.0': '2#5', '4.5': '2#5+1#4' } },
  { areaTributariaMaxM2: 8, refuerzoPorLargo: { '2.0': '2#4', '2.5': '2#4', '3.0-h30': '3#4', '3.0-h35': '3#4', '3.5': '3#4', '4.0': '3#4', '4.5': '3#4' } },
  { areaTributariaMaxM2: 6, refuerzoPorLargo: { '2.0': '2#4', '2.5': '2#4', '3.0-h30': '2#4', '3.0-h35': '3#4', '3.5': '3#4', '4.0': '3#4', '4.5': '3#4' } },
];

export const CUADRO_6B_ESTRIBOS = '#2@15cm (L=2.0 a 3.0) / #2@12cm (L=3.0 a 4.5)';
