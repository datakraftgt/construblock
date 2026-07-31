import type { Municipio } from './municipio';
import type { Muro, Mocheta, Solera, Viga, Cimentacion } from './elementos';
import type { Validacion } from './validacion';

export interface VerticeTablero {
  x: number;
  y: number;
}

export interface Tablero {
  id: string;
  codigo: string; // A, B, C...
  nivelId: string;
  vertices: VerticeTablero[];
  area: number; // m²
  ladoMax: number; // m
  tableroCorrespondienteEnNivelSuperior?: string;
  tableroCorrespondienteEnNivelInferior?: string;
  validacionArea: Validacion; // área ≤ máximo (Cuadro/§5.2)
  validacionLado: Validacion; // lado ≤ 4.50 m
}

export interface Nivel {
  id: string;
  numero: number; // 1, 2, 3
  areaConstruida: number; // m²
  alturaLibre: number; // m, ≤ 3.0
  tableros: Tablero[];
  muros: Muro[];
  mochetas: Mocheta[];
  soleras: Solera[];
  vigas: Viga[];
}

export interface LimitesAplicabilidad {
  alargamiento: Validacion; // L1/L2 ≤ 3.0
  esbeltez: Validacion; // H/L ≤ 2.0
  regularidadPlanta: Validacion; // Av/Ae ≤ 0.25
}

export const SCHEMA_VERSION = 1 as const;

export interface Proyecto {
  schemaVersion: typeof SCHEMA_VERSION;
  id: string;
  nombre: string;
  municipio: Municipio;
  niveles: Nivel[];
  cimentacion: Cimentacion[];
  limitesAplicabilidad: LimitesAplicabilidad;
  creadoEn: string; // ISO date
  actualizadoEn: string; // ISO date
}

export function serializarProyecto(proyecto: Proyecto): string {
  return JSON.stringify(proyecto, null, 2);
}

export function deserializarProyecto(json: string): Proyecto {
  const data = JSON.parse(json) as Proyecto;
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(
      `Versión de esquema no soportada: ${data.schemaVersion}. Se esperaba ${SCHEMA_VERSION}.`,
    );
  }
  return data;
}
