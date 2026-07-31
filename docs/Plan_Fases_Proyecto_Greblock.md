# Plan de Fases — Proyecto Greblock
**Fecha:** 31 de julio de 2026

Este plan organiza el desarrollo de la web app de mampostería confinada a partir de todo lo ya investigado y decidido (ver `Bitacora_Proyecto_Greblock.md` y `Caso_Estudio_Resuelto_y_Diseno_App.md`). Cada fase tiene un objetivo claro, entregables concretos y un criterio de "listo para pasar a la siguiente fase".

---

## Fase 0 — Investigación y base de conocimiento (COMPLETADA)

Ya está hecho, se incluye aquí solo como referencia de punto de partida:
- Extracción y verificación de las reglas del manual AGIES DSE 4.1-2014 (`Base_Conocimiento_Mamposteria_Guatemala.md`).
- Análisis del ejercicio resuelto a mano y traducción a modelo de datos y flujo de UX (`Caso_Estudio_Resuelto_y_Diseno_App.md`).
- Tabla de los 333 municipios con zona sísmica y de viento (`municipios_zona_sismica_viento.json/csv`).
- Decisión tomada: el PDF 2014 es la fuente de verdad numérica; el PPTX solo es referencia de flujo.
- Propuesta de arquitectura técnica entregada (stack recomendado, ver Fase 1).

---

## Fase 1 — Confirmar arquitectura y preparar el proyecto
**Objetivo:** cerrar las decisiones técnicas pendientes y dejar el repositorio listo para programar.

- Confirmar (o ajustar) el stack propuesto: React + TypeScript (Next.js o Vite), Zustand para el estado del plano, Konva.js/react-konva como motor de dibujo 2D, clipper-lib para geometría de muros con espesor, módulo propio (grafo half-edge) para detección de tableros, funciones puras para el motor de reglas AGIES, jsPDF para exportar imagen/PDF, js-dxf para exportar a AutoCAD (fase posterior), backend mínimo Node/Next API + Postgres/Prisma solo para auth y guardar proyectos.
- Decidir dónde y cómo se despliega (Vercel, servidor propio, etc.) y si el dominio/nombre del producto ya está definido.
- Crear el repositorio, configurar linting/formatting, CI básico, y la estructura de carpetas (app shell, módulo de geometría, módulo de reglas, módulo de datos).
- **Listo para avanzar cuando:** el stack está confirmado por escrito y el repo compila con un "hola mundo" desplegado.

---

## Fase 2 — Modelo de datos
**Objetivo:** tener en TypeScript las entidades del dominio, listas para que tanto el editor gráfico como el motor de reglas las consuman.

- Diseñar en detalle las entidades ya identificadas: Proyecto, Nivel, Tablero, Muro, Mocheta, Solera, Viga, Cimiento (partiendo de la sección 2 de `Caso_Estudio_Resuelto_y_Diseno_App.md`).
- Definir el catálogo de tipos/clases de block y sus propiedades (dimensiones, resistencia, etc.) según el manual.
- Definir cómo se serializa un proyecto completo (formato de guardado: JSON versionado).
- Transcribir a JSON tipado las tablas 6-A a 6-K de `Base_Conocimiento_Mamposteria_Guatemala.md` (insumo directo para el motor de reglas de la Fase 4).
- **Listo para avanzar cuando:** existen los tipos/interfaces del modelo de datos y un proyecto de ejemplo (el del PPTX) se puede representar completamente en ese formato, a mano, como prueba.

---

## Fase 3 — Spike geométrico (prueba de concepto del editor)
**Objetivo:** validar la parte más riesgosa de la arquitectura antes de invertir en construir todo el wizard: dibujar muros con espesor real y detectar tableros automáticamente.

- Canvas mínimo con Konva donde se puedan trazar ejes de muro.
- Conversión de eje + espesor a polígonos reales con esquinas bien unidas (clipper-lib).
- Detección automática de un tablero cerrado simple (4 muros formando un rectángulo) usando el grafo half-edge.
- Cálculo de área de ese tablero como prueba de que la geometría es correcta.
- **Listo para avanzar cuando:** se puede dibujar un cuarto simple, el sistema detecta el tablero cerrado y calcula su área correctamente. Este es el punto de no-retorno: si algo del stack geométrico no funciona bien aquí, es más barato cambiarlo ahora que después.

---

## Fase 4 — Motor de reglas AGIES
**Objetivo:** implementar la validación paso a paso que replica el manual, como funciones puras y testeables.

- Implementar cada paso del manual como función pura: límites de aplicabilidad, cálculo de tableros y áreas tributarias, capacidad de carga (cuadros 6-D1/6-D2/6-D3 según zona sísmica), revisión de muros sismo-resistentes, refuerzo de mochetas, soleras, vigas y cimentación.
- Usar el ejercicio del PPTX (86.24 m², vivienda 2 niveles) como caso de prueba de referencia: los resultados del motor deben coincidir con los del ejercicio resuelto a mano (recordando que los valores numéricos vienen del PDF 2014, no del PPTX, así que puede haber pequeñas diferencias ya documentadas).
- Escribir pruebas unitarias por cada función/paso.
- **Listo para avanzar cuando:** el motor de reglas corre de forma aislada (sin UI) sobre datos de prueba y produce el mismo tipo de resultado SI CHEQUEA/NO CHEQUEA que el ejercicio de referencia.

---

## Fase 5 — Wizard de 7 pasos (UI completa)
**Objetivo:** unir el editor gráfico (Fase 3) y el motor de reglas (Fase 4) en el flujo de usuario real.

- Construir las pantallas del wizard según el flujo ya documentado en `Caso_Estudio_Resuelto_y_Diseno_App.md`.
- Editor de planta interactivo: agregar/editar muros, definir niveles, seleccionar tipo/clase de block por muro (con colores distintos por clase).
- Selector de municipio (usa `municipios_zona_sismica_viento.json` para determinar automáticamente la zona sísmica aplicable).
- Panel de resultados por elemento: fórmula → valores → resultado → semáforo ✓/✗, con recálculo instantáneo al editar el plano (igual que en el ejercicio, donde un muro no chequeaba en la primera pasada y había que iterar).
- **Listo para avanzar cuando:** un usuario puede completar el flujo de principio a fin con un caso simple y ver los resultados de validación en pantalla.

---

## Fase 6 — Persistencia y cuentas
**Objetivo:** que un usuario pueda guardar su trabajo y volver a él.

- Backend mínimo (Node/Next API + Postgres/Prisma).
- Autenticación básica.
- Guardar/cargar proyectos, con posibilidad de mantener versiones de un mismo plano.
- **Listo para avanzar cuando:** un usuario puede cerrar sesión, volver a entrar, y recuperar su proyecto tal como lo dejó.

---

## Fase 7 — Exportación
**Objetivo:** que el resultado del trabajo salga de la app en formatos útiles para obra o para un ingeniero.

- Exportar el plano como imagen/PDF (Konva + jsPDF), incluyendo el resumen de validaciones.
- Exportar a DXF (js-dxf) para que un ingeniero lo abra en AutoCAD real.
- **Listo para avanzar cuando:** un PDF exportado y un DXF exportado se pueden abrir correctamente fuera de la app.

---

## Fase 8 — QA y validación con casos reales
**Objetivo:** confirmar que la app da resultados correctos y es usable antes de mostrarla a terceros.

- Validar contra el ejercicio PPTX y, si es posible, contra otros casos reales o revisados por un ingeniero estructural.
- Revisar edge cases (edificios de 1 y 3 niveles, distintas zonas sísmicas, tableros irregulares).
- Resolver la anomalía pendiente de Santa Cruz La Laguna ("100 kph") si en algún momento se activa el uso de la columna de zona de viento.
- Pruebas de usabilidad con usuarios reales (constructores, maestros de obra, ingenieros).
- **Listo para avanzar cuando:** hay confianza razonable en que los resultados son correctos y al menos un usuario externo pudo usar la app sin ayuda.

---

## Fase 9 — Lanzamiento / MVP público
**Objetivo:** sacar la primera versión pública.

- Deploy en el entorno de producción definido en la Fase 1.
- Documentación de usuario (cómo usar la app, qué significa cada validación).
- Definir el roadmap post-MVP: diseño de losas (fuera del alcance actual del manual, requeriría otro fascículo AGIES), posible módulo BIM/IFC, vista 3D, más tipos de edificación.

---

## Cómo usar este plan

No es necesario completar una fase al 100% antes de tocar la siguiente — pero sí es importante no saltarse la Fase 3 (spike geométrico): es la fase que valida el riesgo técnico más grande (detección automática de tableros), y es mucho más barato descubrir un problema ahí que después de construir todo el wizard. El orden sugerido de las demás fases se puede ajustar según lo que el usuario priorice (por ejemplo, se podría adelantar una versión visual del wizard con datos falsos en paralelo a la Fase 4, si conviene para mostrarle el producto a alguien).
