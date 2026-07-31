export type ZonaSismica = 2 | 3 | 4; // 2=Blanca, 3=Amarilla, 4=Anaranjada

export type ZonaViento = 'A' | 'B';

/**
 * Los nombres de campo (snake_case) coinciden a propósito con
 * municipios_zona_sismica_viento.json (ver docs/Anexo1_...), para poder
 * importar el JSON directamente sin una capa de mapeo.
 */
export interface Municipio {
  no: number;
  municipio: string;
  departamento: string;
  zona_sismo: ZonaSismica;
  /**
   * Normalmente 'A' o 'B'. Un caso (fila 279, Santa Cruz La Laguna) trae
   * "100 kph" en el documento original en vez de A/B — no se resuelve
   * automáticamente, ver docs/Anexo1_Municipios_Zona_Sismica_Viento.md.
   */
  zona_viento: ZonaViento | string;
  notas: string | null;
}

export const CF_POR_ZONA_SISMICA: Record<ZonaSismica, number> = {
  4: 0.28, // Anaranjada
  3: 0.2, // Amarilla
  2: 0.13, // Blanca
};
