# Anexo 1 — Municipios de Guatemala: Zona Sísmica y Zona de Viento

**Fuente:** Anexo 1 del Manual AGIES DSE 4.1-2014 (páginas impresas 128-137 del documento), copiado a su vez de la Norma NSE 4-2013 (simplificación del Anexo A de la Norma NSE 2).

**Archivos entregados:**
- `municipios_zona_sismica_viento.json` — 333 registros, listo para cargar en la base de datos de la app.
- `municipios_zona_sismica_viento.csv` — mismo contenido en formato tabular.

**Columnas:** `no` (número original del manual), `municipio`, `departamento`, `zona_sismo` (2=Blanca, 3=Amarilla, 4=Anaranjada — ver `Base_Conocimiento_Mamposteria_Guatemala.md` sección 8.1 para el coeficiente Cf de cada una), `zona_viento` (A=amenaza superior, B=amenaza estándar), `notas` (solo se llena cuando hay algo que verificar).

**Totales:** 333 municipios · zona sísmica 4 (Anaranjada): 270 · zona 3 (Amarilla): 51 · zona 2 (Blanca): 12 · zona de viento A: 47 · B: 285 · 1 caso especial (ver abajo).

## Metodología de extracción y verificación

Se extrajo el texto completo del PDF (pdftotext), se parseó con un patrón que separa número, municipio, departamento, zona de sismo y zona de viento, y se verificó **visualmente contra las imágenes originales de cada página del PDF** (no solo contra el texto) en los casos dudosos. Encontré 3 anomalías, todas confirmadas como **defectos del documento fuente original** (no errores míos de extracción):

### 1. Fila 119 no existe
El documento salta de la fila 118 (Nahualá, Sololá) directamente a la 120 (Nentón, Huehuetenango). Verificado contra la imagen de la página 131 del PDF: la fila 119 simplemente no está — es un hueco en la numeración original del manual, probablemente un municipio omitido por error al momento de editar el documento. Por eso el archivo final tiene 333 filas con números del 1 al 334 (sin el 119).

### 2. Filas 199-238 (municipios "San José..." a "San Miguel Petapa"): a la página le falta la columna Departamento
Confirmé contra la imagen de la página 134 del PDF que esa página completa **no tiene columna de Departamento** — ni siquiera en el encabezado. Es un defecto de diagramación del documento original. Completé el departamento de esos 40 municipios cruzando con una fuente externa confiable (Wikipedia, "Municipalities of Guatemala", verificada además contra mi conocimiento general de la división política de Guatemala). Cada una de estas filas queda marcada en la columna `notas`.

Dentro de este rango hay dos municipios llamados igual, **"San Lorenzo"** (filas 219 y 220) — existen efectivamente dos municipios con ese nombre en Guatemala (uno en San Marcos y otro en Suchitepéquez). Como la columna Departamento no estaba disponible en el PDF para diferenciarlos, asigné el orden alfabéticamente (San Marcos primero); ambos tienen los mismos valores de zona sísmica (4) y zona de viento (B), así que el orden no afecta ningún cálculo de la app, solo importa si se necesita mostrar el departamento correcto en un selector.

### 3. Fila 279 — Santa Cruz La Laguna, Sololá: "100 kph" en vez de A/B
Confirmé contra la imagen de la página 136 del PDF que el documento original literalmente dice **"100 kph"** en la columna de zona de viento para este municipio, en vez de "A" o "B" como todos los demás. Esto es una anomalía real del documento (posiblemente quisieron anotar una velocidad de viento medida en vez de la zona simplificada, y no se corrigió). Lo dejé tal cual está en el original y lo marqué en `notas` — **hay que decidir cómo tratarlo en la app** (una opción razonable es tratarlo como zona "A", ya que 100 kph es una velocidad alta, pero no lo asumí automáticamente).

## Cómo usarlo en la app
Este archivo alimenta directamente el selector de municipio del "Paso 4" (verificación sismo-resistente): al elegir su municipio, la app determina automáticamente `zona_sismo` → qué Cuadro 6-D usar (D1 Anaranjada / D2 Amarilla / D3 Blanca) y su coeficiente Cf, según quedó documentado en `Base_Conocimiento_Mamposteria_Guatemala.md`. La zona de viento no se usa en los cálculos de esta primera versión del manual (el viento queda fuera de alcance, ver esa misma base de conocimiento, sección 13), pero se incluye por si se necesita a futuro.
