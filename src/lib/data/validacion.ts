/**
 * Patrón reutilizable de validación (Base_Conocimiento_Mamposteria_Guatemala.md,
 * "SI CHEQUEA / NO CHEQUEA"): fórmula → valores → resultado → semáforo.
 */

export type ResultadoValidacion = 'ok' | 'no_chequea' | 'pendiente';

export interface Validacion {
  resultado: ResultadoValidacion;
  formula?: string;
  valores?: Record<string, number | string>;
  mensaje?: string;
}

export function validacionPendiente(mensaje?: string): Validacion {
  return { resultado: 'pendiente', mensaje };
}
