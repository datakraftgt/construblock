/**
 * Tipos geométricos compartidos por el resto del modelo de datos.
 * Los muros son ortogonales por convención del manual AGIES DSE 4.1
 * (no se necesita un solver simbólico genérico).
 */

export interface Punto {
  x: number; // metros
  y: number; // metros
}

export type Orientacion = 'horizontal' | 'vertical';

export interface Segmento {
  inicio: Punto;
  fin: Punto;
}
