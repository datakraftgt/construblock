# Bitácora del Proyecto Greblock
**Última actualización:** 30 de julio de 2026

Este documento resume en qué quedó el trabajo, qué archivos existen, qué decisiones ya se tomaron y qué falta por hacer. Al retomar el proyecto, empezar por leer esto.

---

## 1. Objetivo del proyecto

Construir una **web app** que permita a una persona:
1. Dibujar/construir su planta arquitectónica (agregar paredes, definir niveles).
2. Seleccionar tipo y clase de block de cada muro.
3. Que el sistema **valide automáticamente** el diseño contra la metodología simplificada AGIES DSE 4.1 (mampostería confinada de block de concreto para Guatemala): límites de aplicabilidad, tableros, áreas tributarias, capacidad de carga, sismo-resistencia, refuerzo de mochetas/soleras, vigas y cimentación — mostrando resultados tipo "SI CHEQUEA / NO CHEQUEA" por cada elemento, igual que en el ejercicio de referencia.

## 2. Archivos generados hasta ahora (todos en tu carpeta Greblock)

| Archivo | Contenido | Para qué sirve |
|---|---|---|
| `Base_Conocimiento_Mamposteria_Guatemala.md` | Todas las reglas, fórmulas y tablas extraídas y verificadas del manual PDF AGIES DSE 4.1-2014 (los 3 PDFs originales) | **Fuente de verdad numérica** del motor de reglas de la app |
| `Caso_Estudio_Resuelto_y_Diseno_App.md` | Análisis paso a paso del ejercicio PPTX resuelto a mano, más la traducción a modelo de datos (Proyecto/Nivel/Tablero/Muro/Mocheta/Solera/Viga/Cimiento) y patrones de UX (wizard de 7 pasos, semáforo OK/NO CHEQUEA) | **Referencia de flujo y UX** — no usar sus valores numéricos de tablas (ver decisión abajo) |
| `municipios_zona_sismica_viento.json` / `.csv` | Los 333 municipios de Guatemala con su zona sísmica (2/3/4) y zona de viento (A/B) | Datos para el selector de municipio de la app |
| `Anexo1_Municipios_Zona_Sismica_Viento.md` | Metodología de extracción de la tabla de municipios y 3 anomalías del documento original ya verificadas | Referencia/documentación de esa tabla |
| `Bitacora_Proyecto_Greblock.md` | Este documento | Punto de partida para retomar el trabajo |

Archivos originales del usuario (sin modificar): 3 PDFs del manual (páginas 1-26, 27-66, 67-158) y el PPTX del ejercicio.

## 3. Decisiones ya tomadas (no volver a preguntar)

- **Fuente de verdad de las tablas de cálculo: el PDF del manual 2014**, no el PPTX. El PPTX usa una revisión distinta de los "cuadros" (numeración y varios valores diferentes — ver el hallazgo documentado en `Caso_Estudio_Resuelto_y_Diseno_App.md`), así que solo se usa como referencia de flujo/UX.

## 4. Pendientes / próximos pasos (en orden sugerido)

1. **Definir la arquitectura técnica de la web app**: stack de frontend (editor de planos interactivo — probablemente canvas/SVG), backend o lógica cliente para el motor de reglas, formato de datos del plano (cómo se guarda un proyecto: niveles, tableros, muros, etc.).
2. **Diseñar el modelo de datos** en detalle, a partir de las entidades ya identificadas en `Caso_Estudio_Resuelto_y_Diseno_App.md` (sección 2).
3. **Construir el motor de reglas** (funciones puras que reciban los datos del plano y devuelvan validaciones), basado en las tablas de `Base_Conocimiento_Mamposteria_Guatemala.md`.
4. **Decidir cómo tratar la anomalía "100 kph"** de Santa Cruz La Laguna (zona de viento) si se llega a necesitar esa columna — pendiente, no crítico todavía porque el viento está fuera del alcance de los cálculos actuales del manual.
5. Diseñar las pantallas del wizard de 7 pasos (ver `Caso_Estudio_Resuelto_y_Diseno_App.md` secciones 1 y 3 para el flujo y los patrones de UI).
6. Más adelante: revisar si se necesita cubrir el diseño de losas (fuera del alcance del manual actual, requeriría un fascículo AGIES aparte — ver `Base_Conocimiento_Mamposteria_Guatemala.md` sección 13).

## 5. Notas sueltas útiles

- El manual limita la metodología a edificaciones de **1 a 3 niveles**, altura máxima 3.0 m por nivel (8.0 m en total), área generalmente menor a 300 m².
- El patrón de validación que debe replicar la app es: mostrar fórmula → valores → resultado → semáforo (✓/✗) por cada muro/tablero/mocheta individual, permitiendo iterar y recalcular al instante (así se vio en el ejercicio, donde un muro no chequeaba en la primera pasada).
- Zona sísmica del municipio determina qué tabla de capacidad usar (Cuadro 6-D1 Anaranjada / 6-D2 Amarilla / 6-D3 Blanca) — el dato ya está listo en `municipios_zona_sismica_viento.json`.

---

*Toda esta información también está guardada en la memoria del proyecto de esta sesión, así que puedo recuperarla automáticamente la próxima vez que retomemos el trabajo — pero este documento queda como referencia legible directamente por ti.*
