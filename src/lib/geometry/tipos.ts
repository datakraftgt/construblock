// Tipos del módulo de geometría del editor de planta.
// Convención de unidades: TODO el modelo trabaja en METROS.
// La conversión a píxeles ocurre únicamente al renderizar (en los componentes).

/** Punto en coordenadas de plano, en metros. */
export interface Punto {
  x: number;
  y: number;
}

/** Eje de un muro: segmento entre dos puntos, con espesor real del muro. */
export interface MuroEje {
  id: string;
  a: Punto;
  b: Punto;
  /** Espesor del muro en metros (p. ej. 0.14 para block de 14 cm). */
  espesor: number;
}

/** Polígono simple (anillo cerrado, sin repetir el primer punto al final). */
export type Poligono = Punto[];

/** Tablero detectado: un recinto cerrado delimitado por ejes de muro. */
export interface TableroDetectado {
  /** Ids de los muros que forman el perímetro, en orden de recorrido. */
  muroIds: string[];
  /** Vértices del perímetro (los nodos del grafo), en orden de recorrido. */
  perimetro: Poligono;
  /** Área del tablero en m² (medida a ejes de muro). */
  areaM2: number;
}
