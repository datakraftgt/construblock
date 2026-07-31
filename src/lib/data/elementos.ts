import type { Validacion } from './validacion';
import type { EspecificacionBlock } from './block';
import type { Punto, Orientacion } from './geometria';

export type RolMuro = 'sismo_resistente' | 'carga_gravitacional' | 'ambos' | 'no_estructural';

export interface Muro {
  id: string;
  eje: string; // ej. "Muro A", "Muro 3"
  nivelId: string;
  inicio: Punto;
  fin: Punto;
  longitud: number; // metros
  orientacion: Orientacion;
  block: EspecificacionBlock;
  rol: RolMuro;
  esMunneco: boolean; // longitud < 1.20 m (Base_Conocimiento §8.2)
  grouteado: boolean; // si se rellenó con graut o se fundió en concreto
  validacionCargaVertical: Validacion;
  validacionSismoResistente: Validacion;
}

export type TipoMocheta = 'principal' | 'secundaria';

export interface Mocheta {
  id: string;
  tipo: TipoMocheta;
  codigo: string; // M1, M2... / MS1, MS2...
  nivelId: string;
  ubicacion: Punto; // nodo/esquina donde confluyen muros
  murosIds: string[];
  seccion: { ancho: number; alto: number }; // cm
  refuerzo: string;
  validacion: Validacion;
}

export type TipoSolera = 'humedad' | 'entrepiso' | 'azotea' | 'intermedia';

export interface Solera {
  id: string;
  tipo: TipoSolera;
  nivelId: string;
  murosIds: string[];
  seccion: { ancho: number; alto: number }; // cm
  refuerzo: string;
  validacion: Validacion;
}

export interface Viga {
  id: string;
  nivelId: string;
  nodoInicioId: string;
  nodoFinId: string;
  luz: number; // metros
  areaTributaria: number; // m², solo de su propio nivel
  seccion: { ancho: number; alto: number }; // cm
  refuerzo: string;
  validacion: Validacion;
}

export interface CimientoCorrido {
  id: string;
  tipo: 'corrido';
  murosIds: string[];
  tipoSeccion: string; // código del cuadro, ej. "CC45"
  ancho: number; // m
  espesor: number; // m
  refuerzoTransversal: string;
  refuerzoLongitudinal: string;
  validacion: Validacion;
}

export interface Zapata {
  id: string;
  tipo: 'zapata';
  elementoId: string; // mocheta de carga o columna aislada que soporta
  tipoSeccion: string; // ej. "Z3", "Z4-L"
  lado: number; // m (zapata cuadrada L×L)
  espesor: number; // m
  refuerzo: string;
  validacion: Validacion;
}

export type Cimentacion = CimientoCorrido | Zapata;
