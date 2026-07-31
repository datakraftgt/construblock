/**
 * Representación (estructuralmente completa, pero con geometría ilustrativa)
 * del caso de estudio en docs/Caso_Estudio_Resuelto_y_Diseno_App.md —
 * vivienda de 2 niveles, 86.24 m² totales. Prueba de que el modelo de datos
 * sirve para un proyecto real.
 *
 * OJO: el PPTX fuente no da coordenadas exactas de cada tablero/muro, solo
 * áreas agregadas y algunas longitudes puntuales citadas en el texto. Los
 * vértices aquí son ILUSTRATIVOS — se reemplazan cuando se digitalice el
 * plano real en el editor (Fase 3). Los valores que sí vienen citados
 * textualmente en el caso de estudio (ej. Muro 2 "no chequea") se marcaron.
 */

import type { Proyecto, Nivel, Tablero } from '../proyecto';
import type { Muro, Mocheta, Solera, CimientoCorrido } from '../elementos';
import { SCHEMA_VERSION } from '../proyecto';
import { municipios } from '@/lib/municipios';

// El municipio no se especifica en el caso de estudio original; se usa
// "Guatemala" (zona sísmica 4, Anaranjada) como valor ilustrativo razonable.
const municipioEjemplo = municipios.find(
  (m) => m.municipio === 'Guatemala' && m.departamento === 'Guatemala',
)!;

function crearNivel(numero: 1 | 2): Nivel {
  const nivelId = `nivel-${numero}`;

  const tableros: Tablero[] = ['A', 'B', 'C', 'D', 'E'].map((codigo) => ({
    id: `tablero-${numero}-${codigo}`,
    codigo,
    nivelId,
    vertices: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ],
    area: 16,
    ladoMax: 4,
    validacionArea: { resultado: 'ok', formula: 'área ≤ 18.0 m²' },
    validacionLado: { resultado: 'ok', formula: 'lado ≤ 4.50 m' },
  }));

  const muros: Muro[] = [
    {
      id: `muro-${numero}-2`,
      eje: 'Muro 2',
      nivelId,
      inicio: { x: 0, y: 0 },
      fin: { x: 3.9, y: 0 },
      longitud: 3.9,
      orientacion: 'horizontal',
      block: { tipo: 'UT', clase: 'B', espesor: 14, colocacionMortero: 'lecho_parcial' },
      rol: 'carga_gravitacional',
      esMunneco: false,
      grouteado: false,
      // Del caso de estudio: NO CHEQUEA en la primera pasada
      // (10.92 m² de área tributaria vs 8.46 m² de capacidad teórica).
      validacionCargaVertical: {
        resultado: 'no_chequea',
        formula: 'Ct = longitud × coeficiente (Cuadro 6-A) ≥ At',
        valores: { At: 10.92, Ct: 8.46 },
        mensaje: 'No chequea en la primera pasada — requiere engrosar block, subir de clase, o redistribuir.',
      },
      validacionSismoResistente: { resultado: 'pendiente' },
    },
    {
      id: `muro-${numero}-munneco-1`,
      eje: 'Muro muñeco 1',
      nivelId,
      inicio: { x: 4, y: 0 },
      fin: { x: 4.33, y: 0 },
      longitud: 0.33,
      orientacion: 'horizontal',
      block: { tipo: 'UT', clase: 'B', espesor: 14, colocacionMortero: 'lecho_parcial' },
      rol: 'no_estructural',
      esMunneco: true, // < 1.20 m: no cuenta para sismo
      grouteado: false,
      validacionCargaVertical: { resultado: 'pendiente' },
      validacionSismoResistente: {
        resultado: 'no_chequea',
        mensaje: 'Muñeco (< 1.20 m): no cuenta para sismo salvo que se rellene con graut (entonces cuenta la mitad).',
      },
    },
  ];

  const mochetas: Mocheta[] = ['M1', 'M2', 'M3', 'M4'].map((codigo) => ({
    id: `mocheta-${numero}-${codigo}`,
    tipo: 'principal',
    codigo,
    nivelId,
    ubicacion: { x: 0, y: 0 },
    murosIds: [],
    seccion: { ancho: 14, alto: 20 },
    refuerzo: '',
    validacion: {
      resultado: 'pendiente',
      mensaje: 'Pendiente Cuadro 6-F (fuerza en Tm) × Cuadro 6-G (capacidad de barras) — próxima entrega.',
    },
  }));

  const soleras: Solera[] = [
    {
      id: `solera-${numero}-humedad`,
      tipo: 'humedad',
      nivelId,
      murosIds: muros.map((m) => m.id),
      seccion: { ancho: 14, alto: 20 },
      refuerzo: '4#3, estribos #2@20cm', // Cuadro 5-D (Cap.5) — coincide PDF y PPTX
      validacion: { resultado: 'ok' },
    },
  ];

  return {
    id: nivelId,
    numero,
    areaConstruida: 43.12,
    alturaLibre: 2.6,
    tableros,
    muros,
    mochetas,
    soleras,
    vigas: [],
  };
}

const cimentacion: CimientoCorrido[] = [
  {
    id: 'cimiento-cc45',
    tipo: 'corrido',
    murosIds: ['muro-1-2'],
    tipoSeccion: 'CC45', // clase B, 14cm, UT lecho parcial → Cuadro 6-E1
    ancho: 0.6,
    espesor: 0.18,
    refuerzoTransversal: '#3@0.25',
    refuerzoLongitudinal: '4#3',
    validacion: { resultado: 'pendiente', mensaje: 'Confirmar contra Cuadro 6-E1/6-F1 al transcribirlo.' },
  },
];

export const proyectoEjemploCasoPptx: Proyecto = {
  schemaVersion: SCHEMA_VERSION,
  id: 'proyecto-caso-pptx',
  nombre: 'Caso de estudio PPTX — Vivienda 2 niveles (86.24 m²)',
  municipio: municipioEjemplo,
  niveles: [crearNivel(1), crearNivel(2)],
  cimentacion,
  limitesAplicabilidad: {
    alargamiento: { resultado: 'ok', formula: 'L1/L2 ≤ 3.0', valores: { L1: 8.0, L2: 6.0, razon: 1.33 } },
    esbeltez: { resultado: 'ok', formula: 'H/L ≤ 2.0', valores: { H: 5.5, L: 6.0, razon: 0.92 } },
    regularidadPlanta: { resultado: 'ok', formula: 'Av/Ae ≤ 0.25', valores: { Av: 5.31, Ae: 48.4, razon: 0.11 } },
  },
  creadoEn: '2026-07-31T00:00:00.000Z',
  actualizadoEn: '2026-07-31T00:00:00.000Z',
};
