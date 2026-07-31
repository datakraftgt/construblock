# Caso de Estudio Resuelto (PPTX) — Implicaciones para el Diseño de la Web App

**Fuente:** `Diseño de Mampostería Reforzada - Ejemplo Completo.pptx` (35 diapositivas), ejercicio resuelto a mano de una vivienda de 2 niveles usando la metodología simplificada AGIES.

**Propósito de este documento:** (1) documentar el caso resuelto paso a paso como referencia de UX/flujo, (2) advertir un hallazgo importante: **los "cuadros" usados en este ejercicio no coinciden exactamente con los del PDF del manual 2014 que ya analizamos**, y (3) traducir todo esto en requisitos concretos de modelo de datos y de interfaz para la web app.

---

## ⚠️ HALLAZGO IMPORTANTE: los cuadros del PPTX difieren de los del PDF 2014

Al comparar el ejercicio con `Base_Conocimiento_Mamposteria_Guatemala.md` (generado del PDF AGIES DSE 4.1-2014) encontré que el PPTX usa una numeración de cuadros distinta y, en varios casos, **valores numéricos distintos**:

| Cuadro en el PDF 2014 (ya extraído) | Cuadro equivalente en el PPTX | ¿Mismos valores? |
|---|---|---|
| Cuadro 6-A (área tributaria carga vertical) | **Cuadro 6-B** (mismo nombre de columnas) | Parecidos pero NO idénticos (ej. DT19 lecho completo Clase A: PDF=9.1, PPTX=9.9) |
| Cuadro 6-D1/D2/D3 (capacidad sismo-resistente, 3 tablas por zona) | **Cuadro 6-A1** ("Para sitios con Alta Sismicidad", una sola tabla, en unidades **m/m²** en vez de m²/m — es el inverso) | Metodología ligeramente distinta (multiplicar en vez de dividir) y valores no exactamente recíprocos |
| Cuadro 6-C (mochetas de carga) | **Cuadro 6-D** ("Mochetas de Carga") | Valores de refuerzo distintos (ej. 1 viga/pared 14cm/1 nivel: PDF=4#4, PPTX=6#3) |
| Cuadro 6-B (vigas) | **Cuadro 6-C2** ("Grado 60" en vez de Grado 40) | Refuerzo dado directo en cm² Y en arreglo de barras; grado de acero distinto (60 vs 40) |
| Cuadro 5-B/5-C (mochetas principales, Cap. 5) | **Cuadro 6-F** ("Fuerzas para diseñar las Mochetas Principales") | **Metodología distinta**: el PPTX da la capacidad de la mocheta en **toneladas métricas** (fuerza), no un arreglo de barras directo por clase — es un enfoque de demanda-vs-capacidad, más parecido a un cálculo real que a una tabla de lookup |
| Cuadro 5-A (comparación de barras) | **Cuadro 6-G** ("Capacidad de Barras y Grupos de Barras") | Mismo concepto pero reorganizado como tabla de conversión arreglo→capacidad (en toneladas), agrega Grado 75 |
| Cuadro 5-D (soleras principales) | **Cuadro 6-H** | **Coincide** (4#3, estribos #2 @ 20cm) |
| Cuadro 5-E (soleras/refuerzo intermedio) | **Cuadro 6-J** ("Refuerzo Secundario y Vertical") | Estructura muy similar, coincide en varios valores, pero agrega una nota 4 sobre refuerzo mínimo de 0.25% en muros de concreto que no estaba en el texto que leímos |
| Cuadro 6-E1/E2 + 6-F1/F2 (cimientos) | **Cuadro 6-K1** + **Cuadro 6-K1-DR** | Nomenclatura de tipos distinta (CC30...CC120 = ancho en cm directo, en vez de CC1...CC9) y capacidad de suelo asumida distinta: **PPTX = 15 Tm/m²**, PDF 2014 = **10 Tm/m²** |

**Conclusión:** el ejercicio fue resuelto con una **versión más reciente o revisada** del compendio de cuadros de AGIES (probablemente una actualización posterior a 2014, o el "Documento AGIES DSE 4.11 - Metodología Simplificada" que el manual 2014 menciona como *"en preparación"* en ese momento y que evidentemente ya se publicó). La metodología general (los 7 pasos, los conceptos de tablero/área tributaria/mocheta/solera) es la misma, pero **los números de las tablas de lookup no son intercambiables entre ambas fuentes**.

**Esto es una decisión que te toca a ti antes de que programemos el motor de reglas:** ¿tienes o puedes conseguir el documento fuente de estos cuadros actualizados (6-A1, 6-B, 6-C2, 6-D, 6-F, 6-G, 6-H, 6-J, 6-K1, 6-K1-DR)? Si es así, sería el que deberíamos usar como fuente de verdad (parece ser el que se usa en la práctica/docencia). Si no lo tienes, puedo reconstruir cada cuadro completo a partir de las imágenes del PPTX (ya fotografié la mayoría a buena resolución) como fuente alterna, dejando anotado que proviene del ejercicio y no del PDF 2014.

---

## 1. EL CASO RESUELTO, PASO A PASO

**Proyecto:** vivienda de 2 niveles, área nivel 1 = 43.12 m², área nivel 2 = 43.12 m², área total = 86.24 m². Altura libre por nivel = 2.60 m. Huella aproximada 8.00 m × 6.00 m (con patio/lavandería en un extremo).

**Paso 1 — Límites de aplicabilidad (todos con resultado "ok" visible en el slide):**
- Alargamiento: `L1/L2 = 8.00/6.00 = 1.33 ≤ 3.0` → OK.
- Esbeltez: `H/L = 5.50/6.00 = 0.92 ≤ 2.0` → OK (H=5.50 m es la altura total de fachada incluyendo aleros, no la suma simple de niveles).
- Irregularidad en planta: `Av/Ae = 5.31/48.40 = 0.11 ≤ 0.25` → OK.

**Paso 2 — Modular la estructura:** planta dividida en 5 tableros (A, B, C, D, E), mismos en planta baja y planta alta. Regla usada en este ejercicio: área de tablero ≤ **17 m²** (nota: el PDF 2014 decía ≤18 m² — otra pequeña discrepancia num��rica a confirmar) y lado ≤ 4.50 m.

**Paso 3 — Configurar paredes sismo-resistentes:**
1. Se eligió el block: **Clase B, tipo UT (un tabique), 14×19×39 cm, mortero de lecho parcial** — justificado por el Cuadro 6-A1 (coeficiente 0.074 m/m² para esa combinación, resaltado en la tabla).
2. Cálculo de longitud requerida: `86.24 m² × 0.074 m/m² = 6.38 m` lineales de pared requeridos en cada dirección (se usa el área acumulada de ambos niveles porque es el primer nivel el que carga todo).
3. Distribución en 3 franjas (25% cada una): `6.38 × 0.25 = 1.59 ml` mínimo por franja.
4. Se dibujó la planta baja, se identificaron los muros existentes por eje (Muro A, B, C, D, F, 1, 1A, 2, 3, 4, 5) con su longitud medida, y se sumaron por franja (izquierda/media/derecha y fachada/media/superior) verificando que cada franja superara el mínimo de 1.59 ml. Un muro corto (0.33 ml y 0.38 ml) se resaltó en amarillo — son "muñecos" que normalmente no cuentan, tratados aquí como caso límite.
5. Los muros se clasificaron visualmente por color: **azul = Clase A, rojo = Clase B** — el mismo muro puede necesitar block de mayor clase si es más corto (compensar con mayor resistencia por longitud).

**Paso 3A — Diseño de paredes por cargas gravitacionales:** para cada muro se calculó su área tributaria real (dividiendo cada tablero en 4 triángulos y sumando los que llegan a cada muro, en ambos niveles) y se comparó contra el área teórica que ese muro puede soportar (Cuadro 6-B × longitud del muro), con una columna de **"REVISIÓN"** que dice "SI CHEQUEA" o "NO CHEQUEA". En el ejercicio, **Muro 2 dio "NO CHEQUEA"** en la primera pasada (10.92 m² de área tributaria existente vs 8.46 m² de capacidad teórica) — el ejercicio no muestra explícitamente la corrección pero esto demuestra que el proceso es iterativo: si un muro no chequea, hay que engrosar el block, subir de clase, o redistribuir.

**Paso 4 — Definir vigas y mochetas de carga:** donde el borde de un tablero no tiene pared debajo (ej. sobre la escalera), se calculó el área tributaria de la viga (suma de 2 triángulos adyacentes, sin sumar niveles) y se buscó tamaño/refuerzo en el Cuadro 6-C2 según luz y área tributaria.

**Paso 5 (implícito, sin numerar como paso propio) — Mochetas principales:** se definieron 4 tipos de mocheta (M1, M2, M3, M4) según su ubicación/carga, usando el Cuadro 6-F (fuerza en toneladas) cruzado con el Cuadro 6-G (capacidad de arreglos de barras en toneladas) para encontrar el arreglo que cumple. Regla visible: donde confluyen dos exigencias distintas en la misma esquina, se usa el mayor (ver M-4 repetido en varias esquinas con el mismo refuerzo, el más exigente).

**Soleras principales y secundarias:** solera continua perimetral (Cuadro 6-H: 4#3, estribos #2@20cm) más mochetas/soleras secundarias donde la separación entre mochetas principales lo requiere (Cuadro 6-J), añadiendo dos tipos adicionales de mocheta secundaria (MS-1, MS-2) en el plano "final".

**Paso 5 final — Cimentación:** usando el Cuadro 6-K1 (según clase de block, ej. Block UT Clase B 14cm → tipo **CC45**) y el Cuadro 6-K1-DR (dimensiones/refuerzo por tipo), se dibujó la planta de cimentación con 2 tipos de cimiento corrido (CC-45 y CC-55) distribuidos según qué muros son de Clase A vs B.

---

## 2. LO QUE ESTO IMPLICA PARA EL MODELO DE DATOS DE LA APP

Entidades que el editor de planos necesita, en el orden en que las usa el flujo:

- **Proyecto**: nombre, municipio (→ determina zona sísmica/viento), número de niveles, altura libre por nivel.
- **Nivel** (piso): número, área construida, lista de tableros.
- **Tablero**: vértices/dimensiones, nivel al que pertenece, referencia a los mismos tableros en niveles superiores/inferiores (deben coincidir), validación automática de área ≤ máximo y lado ≤ máximo.
- **Muro**: eje (letra o número, ej. "Muro A", "Muro 3"), nivel, longitud, orientación (horizontal/vertical → dirección de análisis sísmico), tipo de block (DT/UT), clase de block (A/B/C/D), espesor (14/19 cm), colocación de mortero (lecho completo/parcial), rol: ¿sismo-resistente sí/no (según regla de ≥1.20 m)?, ¿es de carga gravitacional?
- **Mocheta**: ubicación (nodo/esquina donde confluyen muros), tipo (principal M1..Mn / secundaria MS1..MSn), sección, arreglo de refuerzo, calculado automáticamente a partir de los muros que confluyen ahí (tomando el máximo).
- **Solera**: tipo (humedad / entrepiso / azotea / intermedia), tramo de muro que recorre.
- **Viga**: tramo (nodo a nodo), luz, área tributaria calculada, sección y refuerzo resultante.
- **Cimiento corrido**: tramo de muro, tipo (según cuadro), ancho/refuerzo.
- **Zapata**: en mochetas de carga o columnas aisladas.

Cada una de estas entidades tiene un **estado de validación** (OK / NO CHEQUEA / pendiente) con el detalle del cálculo (igual que las columnas "REVISIÓN" del ejercicio) — esto debería ser un patrón de UI reutilizable en toda la app: mostrar fórmula, valores, resultado, y semáforo verde/rojo.

## 3. IMPLICACIONES DE FLUJO / UX

El ejercicio confirma que el flujo natural para la app es un **wizard de 7 pasos** (calcado del manual), donde cada paso:
1. Muestra los criterios/fórmulas del paso.
2. Pide al usuario los datos de entrada correspondientes (o los deriva de lo dibujado en el paso anterior).
3. Ejecuta el cálculo y muestra resultado con "SI CHEQUEA / NO CHEQUEA" (o equivalente ✓/✗) por cada elemento evaluado — nunca solo un resultado global, siempre desglosado por muro/tablero/mocheta individual, porque así es como se detecta y corrige el punto débil.
4. Permite iterar: cambiar clase de block, espesor, o redistribuir muros y recalcular al instante — el "engine" de reglas necesita ser puro/reactivo (mismos inputs → mismos outputs) para soportar esto bien.

Elementos gráficos que la app necesitaría poder dibujar/editar sobre un plano 2D (probablemente un canvas o SVG editable):
- Ejes (letras en un sentido, números en el otro) con acotaciones.
- Muros como segmentos con color según clase de block (el ejercicio usa azul=Clase A, rojo=Clase B — conviene definir una paleta estándar por clase A/B/C/D).
- División de tableros en triángulos (áreas tributarias) — esto es una operación geométrica automatizable (diagonales de cada tablero) más que algo que el usuario dibuje a mano.
- Franjas de 25% superpuestas sobre la planta, con la suma de longitud de muro dentro de cada franja actualizándose en vivo.
- Íconos/etiquetas de mocheta (M1, M2...) en los nodos, coloreados/con leyenda.
- Plano de cimentación derivado automáticamente del plano de muros (mismo trazo, con el tipo de cimiento corrido asignado por tramo).

## 4. PENDIENTES / PRÓXIMOS PASOS SUGERIDOS

1. **Decidir la fuente de verdad de los cuadros** (ver sección de hallazgo arriba) — es el desbloqueador más importante antes de escribir cualquier lógica de cálculo.
2. Si se opta por los cuadros del PPTX: transcribir completos los cuadros 6-A1, 6-B, 6-C2, 6-D, 6-F, 6-G, 6-H, 6-J, 6-K1 y 6-K1-DR (ya los tengo fotografiados a buena resolución, falta pasarlos a tablas de datos limpias tipo JSON para el motor de reglas).
3. Definir la arquitectura técnica de la web app (stack de frontend para el editor de planos, backend/motor de reglas, formato de datos del plano).
4. Extraer la tabla completa del Anexo 1 (municipios) del PDF 2014, que sigue siendo válida independientemente de qué cuadros técnicos se use.

---

## Fuente de este análisis
Lectura completa de las 35 diapositivas del PPTX (`markitdown` para texto + render a imagen de cada diapositiva a 150dpi para leer las tablas y planos escaneados), comparación cruzada con `Base_Conocimiento_Mamposteria_Guatemala.md` (extraído del PDF del manual 2014).
