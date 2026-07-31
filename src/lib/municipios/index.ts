import type { Municipio } from '@/lib/data';
import data from './data.json';

export const municipios: Municipio[] = data as Municipio[];

export function buscarMunicipioPorNombre(nombre: string): Municipio | undefined {
  return municipios.find((m) => m.municipio.toLowerCase() === nombre.toLowerCase());
}

export function municipiosPorDepartamento(departamento: string): Municipio[] {
  return municipios.filter((m) => m.departamento.toLowerCase() === departamento.toLowerCase());
}
