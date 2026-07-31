# Construblock

Web app para Guatemala que permite dibujar una planta arquitectónica, asignar tipo/clase de block de concreto por muro, y validar automáticamente el diseño contra la metodología simplificada **AGIES DSE 4.1** (mampostería confinada de block de concreto), mostrando "SI CHEQUEA / NO CHEQUEA" por elemento (tableros, muros sismo-resistentes, mochetas, soleras, vigas y cimentación).

## Stack técnico

- **Next.js** (App Router) + **TypeScript** — frontend y API routes para el backend mínimo.
- **Zustand** — estado centralizado del plano/editor.
- **Konva.js + react-konva** — motor de dibujo 2D interactivo.
- **clipper-lib** — geometría de polígonos (offset de ejes de muro + espesor, uniones de esquina).
- Módulo propio en TypeScript puro (grafo half-edge) para detección de tableros y áreas tributarias (Fase 3).
- Motor de reglas AGIES como funciones puras por paso del manual, sin librería de rule-engine genérica (Fase 4).
- **jsPDF** para exportar PDF/imagen, **js-dxf** para exportar DXF (Fase 7).
- Backend: API routes de Next.js + **Postgres/Prisma** (Fase 6).
- Despliegue: **Vercel**.

> ⚠️ Este proyecto se scaffoldeó con `create-next-app@latest`, que instaló **Next.js 16**. Es una versión posterior al conocimiento de entrenamiento del asistente que la generó — antes de escribir código de App Router / API routes conviene revisar `node_modules/next/dist/docs/` o la documentación oficial vigente, ya que puede haber cambios de convención respecto a Next.js 14/15.

Se descartaron para el MVP: CAD kernel 3D completo (OpenCascade.js), motor BIM/IFC completo, resolvedor de restricciones geométricas genérico (los muros son ortogonales por convención del manual).

## Carpeta `/docs`

Contiene la investigación técnica base (Fase 0, completada) que sirve de fuente de verdad para el resto del proyecto:

- `Base_Conocimiento_Mamposteria_Guatemala.md` — reglas, fórmulas y tablas extraídas y verificadas del manual AGIES DSE 4.1-2014. Fuente de verdad numérica del motor de reglas.
- `Caso_Estudio_Resuelto_y_Diseno_App.md` — ejercicio resuelto a mano, traducido a modelo de datos y patrones de UX (wizard de 7 pasos, semáforo OK/NO CHEQUEA).
- `municipios_zona_sismica_viento.json` / `.csv` — los 333 municipios de Guatemala con su zona sísmica y de viento.
- `Anexo1_Municipios_Zona_Sismica_Viento.md` — metodología de extracción de esa tabla.
- `Plan_Fases_Proyecto_Greblock.md` — plan de fases completo del proyecto.
- `Bitacora_Proyecto_Greblock.md` — bitácora de decisiones tomadas.
- `Inicio_Proyecto_Construblock.md` — documento de arranque de la Fase 1.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run lint      # ESLint
npm run format    # Prettier
npm run build     # build de producción
```

## Estructura de dominio (`src/`)

```
src/
  app/                  # rutas de Next.js (App Router)
  components/           # UI, incluido el editor de planta
  lib/
    geometry/           # grafo half-edge, offset de muros (Fase 3)
    rules/               # motor de reglas AGIES (Fase 4)
    data/                # tipos: Proyecto, Nivel, Tablero, Muro, Mocheta, Solera, Viga, Cimiento (Fase 2)
    municipios/          # datos de zona sísmica/viento (Fase 2)
  store/                 # store de Zustand del plano
```

## Estado del proyecto

Ver `docs/Plan_Fases_Proyecto_Greblock.md` para el plan completo. Fase 0 (investigación) completada; Fase 1 (este scaffolding) en curso.
