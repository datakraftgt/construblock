# Inicio del proyecto Construblock
**Documento de arranque para la nueva sesión (Cowork local / Claude Code) en la carpeta `Construblock`, Mac mini.**

Pega este documento completo como primer mensaje de la nueva sesión, o dile "lee y sigue `Inicio_Proyecto_Construblock.md`".

---

## 1. Qué es este proyecto

**Construblock** es una web app para Guatemala que permite a un usuario:
1. Dibujar su planta arquitectónica (paredes, niveles).
2. Seleccionar tipo/clase de block de concreto por muro.
3. Validar automáticamente el diseño contra la metodología simplificada AGIES DSE 4.1 (mampostería confinada de block de concreto): límites de aplicabilidad, tableros, áreas tributarias, capacidad de carga, muros sismo-resistentes, mochetas, soleras, vigas y cimentación — mostrando "SI CHEQUEA / NO CHEQUEA" por elemento, tal como se hace a mano en el ejercicio de referencia del usuario.

Repositorio: `https://github.com/datakraftgt/construblock`
Carpeta local de trabajo: `Construblock` en la Mac mini (esta computadora es la máquina de desarrollo del proyecto de ahora en adelante).

## 2. Estado actual — qué ya está hecho (Fase 0, completada)

Toda la investigación técnica base ya se hizo en sesiones anteriores, en la carpeta `Greblock` de la otra Mac del usuario. **Antes de programar nada, copia estos archivos a una carpeta `/docs` dentro de este repo** (el usuario los tiene que traer de su otra máquina si aún no están aquí):

| Archivo | Contenido |
|---|---|
| `Base_Conocimiento_Mamposteria_Guatemala.md` | Todas las reglas, fórmulas y tablas extraídas y verificadas del manual AGIES DSE 4.1-2014 (los 3 PDFs originales). **Fuente de verdad numérica** del motor de reglas. |
| `Caso_Estudio_Resuelto_y_Diseno_App.md` | Ejercicio resuelto a mano (vivienda 2 niveles, 86.24 m²) analizado paso a paso, con la traducción a modelo de datos (Proyecto/Nivel/Tablero/Muro/Mocheta/Solera/Viga/Cimiento) y patrones de UX (wizard de 7 pasos, semáforo OK/NO CHEQUEA). Sus valores numéricos de tablas NO se usan — solo el flujo. |
| `municipios_zona_sismica_viento.json` / `.csv` | Los 333 municipios de Guatemala con su zona sísmica (2/3/4) y zona de viento (A/B). |
| `Anexo1_Municipios_Zona_Sismica_Viento.md` | Metodología de extracción de esa tabla y 3 anomalías del documento original ya documentadas (una sin resolver: Santa Cruz La Laguna tiene "100 kph" en vez de A/B). |
| `Plan_Fases_Proyecto_Greblock.md` | El plan de fases completo (resumido en la sección 4 de este documento). |
| `Bitacora_Proyecto_Greblock.md` | Bitácora de decisiones tomadas hasta ahora. |

Si esos archivos ya están en `/docs`, léelos completos antes de continuar — ahí está el detalle que este documento solo resume.

## 3. Decisiones ya tomadas (no volver a preguntar)

- **Fuente de verdad de las tablas de cálculo: el manual PDF AGIES DSE 4.1-2014**, no el PPTX del ejercicio (el PPTX usa una numeración y valores de "cuadros" distintos — se documentó el hallazgo). El PPTX solo se usa como referencia de flujo/UX.
- **Stack técnico confirmado:**
  - **Next.js** (App Router) + **TypeScript** — frontend y API routes para el backend mínimo.
  - **Zustand** — estado centralizado del plano/editor.
  - **Konva.js + react-konva** — motor de dibujo 2D interactivo.
  - **clipper-lib** — geometría de polígonos (offset de ejes de muro + espesor, uniones de esquina).
  - Módulo propio en TypeScript puro (grafo half-edge) para detección de tableros y áreas tributarias — se construye en la Fase 3.
  - Motor de reglas AGIES como funciones puras por paso del manual (sin librería de rule-engine genérica) — Fase 4.
  - **jsPDF** para exportar PDF/imagen, **js-dxf** para exportar DXF — Fase 7.
  - Backend: API routes de Next.js + **Postgres/Prisma** — Fase 6.
  - Despliegue: **Vercel** (confirmado).
  - Se descartaron para el MVP: CAD kernel 3D completo (OpenCascade.js), motor BIM/IFC completo (posible fase futura), resolvedor de restricciones geométricas genérico (los muros son ortogonales por convención del manual, no hace falta un solver simbólico).
- El manual limita la metodología a edificaciones de **1 a 3 niveles**, altura máxima 3.0 m por nivel (8.0 m total), área generalmente menor a 300 m².

## 4. Plan de fases (resumen — ver `Plan_Fases_Proyecto_Greblock.md` en `/docs` para el detalle completo)

| Fase | Objetivo | Estado |
|---|---|---|
| 0 | Investigación y base de conocimiento | ✅ Completada |
| 1 | Confirmar arquitectura y preparar el repo (scaffolding Next.js + TS, estructura de carpetas, CI) | 👉 **Empezar aquí** |
| 2 | Modelo de datos en TypeScript + transcripción de tablas 6-A a 6-K a JSON tipado | Pendiente |
| 3 | Spike geométrico: prueba de concepto del editor (muros con espesor, detección automática de tablero cerrado). **No saltarse** — valida el mayor riesgo técnico. | Pendiente |
| 4 | Motor de reglas AGIES (funciones puras, validado contra el ejercicio PPTX) | Pendiente |
| 5 | Wizard de 7 pasos (UI completa: editor + motor de reglas + semáforo de resultados) | Pendiente |
| 6 | Persistencia y cuentas (backend mínimo, auth, guardar/cargar proyectos) | Pendiente |
| 7 | Exportación (PDF/imagen y DXF) | Pendiente |
| 8 | QA y validación con casos reales | Pendiente |
| 9 | Lanzamiento del MVP y roadmap post-MVP (losas, BIM/IFC, 3D) | Pendiente |

## 5. Cómo debo trabajar contigo (preferencia del usuario, ya confirmada)

Cada vez que te dé instrucciones de desarrollo, deben venir **paso a paso, con comandos exactos en bloques de código, listas para copiar y pegar** — no como resumen narrativo. La sección 6 de este mismo documento ya sigue ese formato para que arranques de inmediato con la Fase 1.

## 6. Fase 1 — Pasos para ejecutar ahora

### 6.1 Antes de tocar nada: verificar el estado del repo

1. Confirma que estás dentro de la carpeta correcta (`Construblock`) y que el remoto de git apunta a `https://github.com/datakraftgt/construblock`.
2. Revisa si el repo ya tiene contenido (README, `.gitignore`, algún commit previo) o está vacío/solo con lo que crea GitHub por defecto.
3. **Si el repo ya tiene una app Next.js parcialmente creada**, detente y reporta el estado en vez de sobreescribir.
4. Si está vacío o solo tiene archivos triviales (README, LICENSE, `.gitignore`), continúa.

### 6.2 Scaffolding

1. Crear la app Next.js con TypeScript, ESLint y App Router en la carpeta actual:
   ```
   npx create-next-app@latest . --typescript --eslint --app --src-dir --import-alias "@/*"
   ```
   Si pregunta por Tailwind CSS, acéptalo.

2. Instalar las dependencias del dominio:
   ```
   npm install zustand konva react-konva clipper-lib
   npm install -D prettier eslint-config-prettier
   ```
   (Si existe `@types/clipper-lib` en npm, instálalo también; si no, omítelo y anótalo como pendiente.)

3. Configurar Prettier: crear `.prettierrc` con una configuración estándar de un proyecto Next.js moderno, agregar `"format": "prettier --write ."` en `package.json`, y usar `eslint-config-prettier` para que ESLint y Prettier no choquen.

4. Crear la estructura de carpetas del dominio dentro de `src/`:
   ```
   src/
     app/                  (ya la crea Next.js)
     components/           (UI, incluido el editor de planta)
     lib/
       geometry/            (grafo half-edge, offset de muros — se llena en Fase 3)
       rules/               (motor de reglas AGIES — se llena en Fase 4)
       data/                (tipos: Proyecto, Nivel, Tablero, Muro, Mocheta, Solera, Viga, Cimiento — Fase 2)
       municipios/          (datos de zona sísmica/viento, usando /docs/municipios_zona_sismica_viento.json — Fase 2)
     store/                (Zustand store del plano)
   ```
   Agrega un `index.ts` mínimo en cada carpeta vacía para que no se pierdan al hacer commit.

5. Crear/actualizar `README.md` en la raíz con: nombre del proyecto, descripción de una línea, el stack confirmado (copia la lista de la sección 3), y mención de `/docs` como carpeta de referencia técnica.

6. Configurar CI en `.github/workflows/ci.yml`: en cada push/PR, correr `npm ci`, `npm run lint` y `npm run build`.

7. Verificar que compila:
   ```
   npm run build
   ```
   Debe terminar sin errores.

### 6.3 Commit y push

1. Revisa el `.gitignore` generado (debe excluir `node_modules`, `.next`, `.env*.local`, etc.).
2. Commit:
   ```
   git add -A
   git commit -m "Fase 1: scaffolding inicial (Next.js + TS, dependencias del dominio, estructura de carpetas, CI)"
   ```
3. Push a `main` en `https://github.com/datakraftgt/construblock`.

### 6.4 Al terminar

Resume en un mensaje corto: qué se creó, qué decisiones improvisaste si algo no salió como se esperaba (por ejemplo, si `@types/clipper-lib` no existía), y confirma que `npm run build` pasó. Con eso, la Fase 1 queda lista para pasar a la Fase 2 (modelo de datos).
