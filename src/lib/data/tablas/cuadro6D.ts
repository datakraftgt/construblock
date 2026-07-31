import type { FilaCapacidadPorClase } from './tipos';
import type { ZonaSismica } from '../municipio';

/**
 * Cuadro 6-D — Capacidad sismo-resistente (m² de construcción retenidos por
 * 1 m lineal de pared). Fuente: manual AGIES DSE 4.1-2014, §8.4.
 * Uso: Σ(longitud efectiva × coeficiente) ≥ Área de construcción retenida,
 * evaluado por separado en cada dirección ortogonal.
 */

export const CUADRO_6D1_ANARANJADA: FilaCapacidadPorClase[] = [
  { descripcion: 'DT 19cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', coeficientes: { A: 14.8, B: 12.9, C: 10.5, D: 9.1 } },
  { descripcion: 'DT 14cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', coeficientes: { A: 11.4, B: 9.9, C: 8.0, D: 7.0 } },
  { descripcion: 'DT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 14.1, B: 12.2, C: 9.9, D: 8.6 } },
  { descripcion: 'DT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 10.8, B: 9.4, C: 7.6, D: 6.6 } },
  { descripcion: 'UT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 13.3, B: 11.6, C: 9.4, D: 8.2 } },
  { descripcion: 'UT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 10.1, B: 8.8, C: 7.1, D: 6.2 } },
  { descripcion: 'UT/DT + graut (todas las celdas), 19cm', sistema: 'block', espesorCm: 19, grouteado: true, coeficientes: { A: 21.3, B: 18.5, C: 15.0, D: 13.1 } },
  { descripcion: 'UT/DT + graut (todas las celdas), 14cm', sistema: 'block', espesorCm: 14, grouteado: true, coeficientes: { A: 15.7, B: 13.6, C: 11.1, D: 9.6 } },
];

export const CUADRO_6D2_AMARILLA: FilaCapacidadPorClase[] = [
  { descripcion: 'DT 19cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', coeficientes: { A: 20.8, B: 18.0, C: 14.6, D: 12.7 } },
  { descripcion: 'DT 14cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', coeficientes: { A: 15.9, B: 13.8, C: 11.2, D: 9.8 } },
  { descripcion: 'DT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 19.7, B: 17.1, C: 13.9, D: 12.1 } },
  { descripcion: 'DT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 15.1, B: 13.1, C: 10.6, D: 9.3 } },
  { descripcion: 'UT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 18.7, B: 16.2, C: 13.2, D: 11.5 } },
  { descripcion: 'UT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 14.1, B: 12.3, C: 10.0, D: 8.7 } },
  { descripcion: 'UT/DT + graut (todas las celdas), 19cm', sistema: 'block', espesorCm: 19, grouteado: true, coeficientes: { A: 29.9, B: 25.9, C: 21.0, D: 18.3 } },
  { descripcion: 'UT/DT + graut (todas las celdas), 14cm', sistema: 'block', espesorCm: 14, grouteado: true, coeficientes: { A: 22.0, B: 19.1, C: 15.5, D: 13.5 } },
];

export const CUADRO_6D3_BLANCA: FilaCapacidadPorClase[] = [
  { descripcion: 'DT 19cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_completo', coeficientes: { A: 32.0, B: 27.7, C: 22.5, D: 19.6 } },
  { descripcion: 'DT 14cm, lecho completo', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_completo', coeficientes: { A: 24.5, B: 21.2, C: 17.3, D: 15.0 } },
  { descripcion: 'DT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 30.3, B: 26.3, C: 21.4, D: 18.6 } },
  { descripcion: 'DT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'DT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 23.2, B: 20.2, C: 16.4, D: 14.3 } },
  { descripcion: 'UT 19cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 19, colocacionMortero: 'lecho_parcial', coeficientes: { A: 28.7, B: 24.9, C: 20.2, D: 17.6 } },
  { descripcion: 'UT 14cm, lecho parcial', sistema: 'block', tipoBlock: 'UT', espesorCm: 14, colocacionMortero: 'lecho_parcial', coeficientes: { A: 21.8, B: 18.9, C: 15.3, D: 13.3 } },
  // El manual original no incluye fila de graut para la zona Blanca (6-D3).
];

export function cuadro6DPorZona(zona: ZonaSismica): FilaCapacidadPorClase[] {
  switch (zona) {
    case 4:
      return CUADRO_6D1_ANARANJADA;
    case 3:
      return CUADRO_6D2_AMARILLA;
    case 2:
      return CUADRO_6D3_BLANCA;
  }
}
