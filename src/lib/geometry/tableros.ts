// Detección automática de tableros (recintos cerrados) a partir de los EJES
// de muro, usando un grafo planar con recorrido tipo half-edge:
//
//   1. Los extremos de los ejes se agrupan en nodos (con tolerancia de snap).
//   2. Cada eje genera dos medias-aristas dirigidas (ida y vuelta).
//   3. En cada nodo, las medias-aristas salientes se ordenan por ángulo.
//   4. Recorrer "siempre girando lo más a la derecha posible" traza las caras
//      del grafo planar. Las caras interiores (con área encerrada) son los
//      tableros; la cara exterior se descarta por el signo de su área.
//
// El área se calcula con la fórmula del polígono (shoelace) sobre los nodos
// del perímetro — es decir, área medida A EJES de muro, que es lo que usa
// la metodología AGIES para tableros y áreas tributarias.

import type { MuroEje, Punto, TableroDetectado } from './tipos';

interface MediaArista {
  desde: number; // índice de nodo
  hacia: number; // índice de nodo
  muroId: string;
  gemela: number; // índice de la media-arista opuesta
  siguiente: number; // índice de la siguiente media-arista en la cara (se llena luego)
}

/** Área con signo (shoelace, sin valor absoluto). Positiva si el recorrido es antihorario en un plano con Y hacia arriba. */
function areaConSigno(puntos: Punto[]): number {
  let suma = 0;
  for (let i = 0; i < puntos.length; i++) {
    const p = puntos[i];
    const q = puntos[(i + 1) % puntos.length];
    suma += p.x * q.y - q.x * p.y;
  }
  return suma / 2;
}

/**
 * Detecta los tableros cerrados formados por los ejes de muro.
 * `toleranciaM`: distancia máxima (en metros) para considerar que dos extremos
 * de muro son el mismo nodo (snap). Con la grilla del editor esto casi no
 * importa, pero hace la detección robusta a errores de redondeo.
 */
export function detectarTableros(
  muros: MuroEje[],
  toleranciaM = 0.001,
): TableroDetectado[] {
  if (muros.length < 3) return [];

  // --- 1. Nodos con snap por tolerancia -----------------------------------
  const nodos: Punto[] = [];
  const indicePorClave = new Map<string, number>();
  const nodoDe = (p: Punto): number => {
    const clave = `${Math.round(p.x / toleranciaM)}|${Math.round(p.y / toleranciaM)}`;
    const existente = indicePorClave.get(clave);
    if (existente !== undefined) return existente;
    const indice = nodos.length;
    nodos.push(p);
    indicePorClave.set(clave, indice);
    return indice;
  };

  // --- 2. Medias-aristas (dos por muro) -----------------------------------
  const aristas: MediaArista[] = [];
  for (const muro of muros) {
    const na = nodoDe(muro.a);
    const nb = nodoDe(muro.b);
    if (na === nb) continue; // muro degenerado (largo ~0), se ignora
    const i = aristas.length;
    aristas.push({ desde: na, hacia: nb, muroId: muro.id, gemela: i + 1, siguiente: -1 });
    aristas.push({ desde: nb, hacia: na, muroId: muro.id, gemela: i, siguiente: -1 });
  }

  // --- 3. Ordenar salientes por ángulo en cada nodo ------------------------
  const salientesPorNodo: number[][] = nodos.map(() => []);
  aristas.forEach((arista, i) => salientesPorNodo[arista.desde].push(i));
  const anguloDe = (i: number): number => {
    const a = aristas[i];
    const p = nodos[a.desde];
    const q = nodos[a.hacia];
    return Math.atan2(q.y - p.y, q.x - p.x);
  };
  for (const salientes of salientesPorNodo) {
    salientes.sort((i, j) => anguloDe(i) - anguloDe(j));
  }

  // --- 4. Enlazar cada media-arista con la siguiente de su cara ------------
  // Al llegar al nodo destino, la siguiente arista de la cara es la que está
  // justo ANTES de la gemela en el orden angular (giro máximo a la derecha).
  for (let i = 0; i < aristas.length; i++) {
    const salientes = salientesPorNodo[aristas[i].hacia];
    const posGemela = salientes.indexOf(aristas[i].gemela);
    aristas[i].siguiente = salientes[(posGemela - 1 + salientes.length) % salientes.length];
  }

  // --- 5. Recorrer las caras ------------------------------------------------
  const visitada = new Array<boolean>(aristas.length).fill(false);
  const tableros: TableroDetectado[] = [];
  for (let inicio = 0; inicio < aristas.length; inicio++) {
    if (visitada[inicio]) continue;
    const perimetro: Punto[] = [];
    const muroIds: string[] = [];
    let actual = inicio;
    do {
      visitada[actual] = true;
      perimetro.push(nodos[aristas[actual].desde]);
      muroIds.push(aristas[actual].muroId);
      actual = aristas[actual].siguiente;
    } while (actual !== inicio);

    // Con la regla del paso 4 (giro a la derecha), las caras interiores se
    // recorren en sentido antihorario → área con signo POSITIVA.
    // La cara exterior sale negativa y las aristas colgantes suman ~0.
    const area = areaConSigno(perimetro);
    if (area > 1e-6) {
      tableros.push({
        muroIds,
        perimetro,
        areaM2: area,
      });
    }
  }

  // Tableros más grandes primero, solo por presentación estable.
  tableros.sort((t1, t2) => t2.areaM2 - t1.areaM2);
  return tableros;
}
