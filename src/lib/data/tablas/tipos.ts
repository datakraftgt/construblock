import type { TipoBlock, ClaseBlock, ColocacionMortero } from '../block';

export interface RangoNumerico {
  min: number;
  max: number;
}

/** Forma común de los Cuadros 6-A y 6-D (mismo layout: filas de sistema × columnas A/B/C/D). */
export interface FilaCapacidadPorClase {
  descripcion: string;
  sistema: 'block' | 'concreto' | 'columna';
  tipoBlock?: TipoBlock;
  espesorCm?: number;
  ladoColumnaCm?: number;
  colocacionMortero?: ColocacionMortero;
  grouteado?: boolean;
  coeficientes: Record<ClaseBlock, number | null>;
}
