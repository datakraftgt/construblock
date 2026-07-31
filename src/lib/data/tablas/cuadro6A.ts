import type { FilaCapacidadPorClase } from './tipos';

/**
 * Cuadro 6-A — Área tributaria soportable por 1 m lineal de pared (m²/m),
 * con Wu = 1800 lb/m². Fuente: manual AGIES DSE 4.1-2014.
 * Uso: Ct = longitud de pared (m) × coeficiente → debe cumplirse Ct ≥ At.
 */
export const CUADRO_6A: FilaCapacidadPorClase[] = [
  { descripcion: 'DT 19cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', coeficientes: { A: 9.1, B: 6.9, C: 4.5, D: 3.4 } },
  { descripcion: 'DT 14cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', coeficientes: { A: 7.0, B: 5.3, C: 3.5, D: 2.6 } },
  { descripcion: 'DT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 8.2, B: 6.2, C: 4.1, D: 3.1 } },
  { descripcion: 'DT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 6.3, B: 4.7, C: 3.1, D: 2.4 } },
  { descripcion: 'UT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 7.8, B: 5.9, C: 3.9, D: 2.9 } },
  { descripcion: 'UT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 5.9, B: 4.4, C: 2.9, D: 2.2 } },
  { descripcion: 'UT o DT + graut (todas las celdas), 19cm', sistema: 'block', espesorCm: 19, grouteado: true, coeficientes: { A: 12.5, B: 9.4, C: 6.2, D: 4.7 } },
  { descripcion: 'UT o DT + graut (todas las celdas), 14cm', sistema: 'block', espesorCm: 14, grouteado: true, coeficientes: { A: 9.2, B: 6.9, C: 4.6, D: 3.5 } },
  { descripcion: 'Pared de concreto Clase 210, 19cm', sistema: 'concreto', espesorCm: 19, coeficientes: { A: 18.2, B: null, C: null, D: null } },
  { descripcion: 'Pared de concreto Clase 210, 14cm', sistema: 'concreto', espesorCm: 14, coeficientes: { A: 13.4, B: null, C: null, D: null } },
  { descripcion: 'Columna 30×30', sistema: 'columna', ladoColumnaCm: 30, coeficientes: { A: 8.6, B: null, C: null, D: null } },
  { descripcion: 'Columna 40×40', sistema: 'columna', ladoColumnaCm: 40, coeficientes: { A: 15.3, B: null, C: null, D: null } },
];
