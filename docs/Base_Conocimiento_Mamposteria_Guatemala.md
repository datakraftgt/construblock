# Base de Conocimiento Técnica
## Manual de Diseño Sismo-Resistente Simplificado de Mampostería de Block de Concreto para Guatemala

**Fuente:** Documento AGIES DSE 4.1 (2014), Héctor Monzón Despang, marzo 2014. Compatible con la Norma AGIES NSE 4.1-2014. Asociación Guatemalteca de Ingeniería Estructural y Sísmica (AGIES).

**Propósito de este documento:** consolidar en un solo lugar todas las reglas, fórmulas, tablas y criterios numéricos del manual, organizados como especificación técnica para servir de base de reglas a una web app que **construya y valide planos estructurales** de mampostería confinada de block de concreto (1 a 3 niveles) en Guatemala.

**Nota importante sobre naturaleza del documento:** el manual NO es una norma; es una guía simplificada de diseño avalada por AGIES pero de responsabilidad del autor, pensada para construcción menor (vivienda y comercios pequeños de hasta 3 niveles). Cualquier motor de validación construido sobre esta base debe presentarse como "verificación según metodología simplificada AGIES DSE 4.1", no como certificación normativa oficial.

**Nota sobre duplicación de numeración de cuadros en el documento fuente:** el manual reutiliza las etiquetas "Cuadro 5-A" y "Cuadro 5-B" para dos pares de tablas completamente distintas (una vez en el Capítulo 4 para clasificación de blocks, y otra vez en el Capítulo 5 para refuerzo de acero). En este documento se distinguen agregando el capítulo entre paréntesis para evitar ambigüedad al programar el motor de reglas.

---

## 1. ALCANCE Y LÍMITES DE APLICABILIDAD (Paso 1 del procedimiento)

Estas son las condiciones que un proyecto debe cumplir para que el método simplificado sea válido. Deben verificarse **antes** de diseñar (equivale a una función `validarAlcance()` en la app):

| Criterio | Límite | Regla |
|---|---|---|
| Sistema estructural | Cajón (mampostería confinada con acero: mochetas + soleras) | Obligatorio |
| Número de niveles | Máximo 3 | `niveles ≤ 3` |
| Altura por nivel | Máximo 3.0 m | `alturaNivel ≤ 3.0` |
| Altura total (3 niveles) | Máximo 8.0 m | `alturaTotal ≤ 8.0` |
| Área total construida | Generalmente < 300 m² (no es límite estricto) | Advertencia, no bloqueo |
| Esbeltez en planta | `L1 / L2 ≤ 3.0` (evitar edificaciones alargadas) | Si no cumple: partir la construcción |
| Esbeltez en elevación | `H / L ≤ 2.0` (altura ≤ 2× el ancho) | Si no cumple: rediseñar |
| Regularidad en planta | `Av / Ae ≤ 0.25` (área vacía del rectángulo envolvente / área del rectángulo envolvente) | Si `> 0.25`: planta irregular → reorganizar o partir en 2 cuerpos regulares separados por buena distancia |

Ejemplos de verificación de regularidad citados en el manual:
- Caso "a": `Av/Ae = (5.0×6.0)/(8.0×9.0) = 0.41` → **no cumple**.
- Caso "b": `Av/Ae = (4.0×2.0 + 4.0×2.0)/(8.0×9.0) = 0.22` → **cumple**.

---

## 2. MARCO NORMATIVO

- **CONRED** (Coordinadora Nacional para la Reducción de Desastres) emite las Normas de Reducción de Desastres: **NRD-1** (Construcción, remite a AGIES NSE para diseño estructural), **NRD-2** (Rutas de Evacuación y Salida), **NRD-3** (Calidad de materiales, remite a normas NTG/COGUANOR).
- **AGIES NSE-4.1** (en preparación en 2014): norma simplificada para construcción menor de vivienda y comercios hasta 3 niveles con mampostería confinada. Este manual (DSE-4.1) es compatible con ella.
- **COGUANOR NTG 41054**: norma de fabricación de blocks de concreto (clases A/B/C).
- **COGUANOR NTG 41050**: norma de morteros de pega (clases M/S/N).
- **COGUANOR NTG 41096**: norma de cemento para mampostería.
- **NTG 36011**: norma de barras de acero de refuerzo (equivalente comercial ASTM A-615 Grado 40).
- **ASTM A1094**: norma de "hierro de alta resistencia" / alambre de acero al carbono (~Grado 70).
- Otras normas AGIES relacionadas: NSE-2 y NSE-3 (edificios de varios pisos), NSE-5 (puentes/carreteras).

---

## 3. MATERIALES

### 3.1 Blocks de concreto

**Dimensión modular:** 39 × 19 cm (con sisa → módulo de 40 × 20 cm) → **12.5 unidades/m²** de levantado.
**Espesores cubiertos por el manual:** 14 cm y 19 cm (15 cm se trata igual que 14 cm; 12 cm y 9 cm quedan fuera/limitados a tabiques sin carga).

**Tipos según distribución de celdas:**
| Tipo | Descripción | Área neta típica | Mortero compatible | Origen típico |
|---|---|---|---|---|
| **DT** (Dos Tabiques) | Doble tabique central, celdas alineadas entre hiladas | ~52-57% | Lecho Completo o Parcial | Artesanal (bloqueras pequeñas) |
| **UT** (Un Tabique) | Tabique central simple, celdas desalineadas entre hiladas | ~50-53% | Solo Lecho Parcial | Industrial |

*Nota: la distinción DT/UT es propia de este manual/AGIES; la norma NTG 41054 no la contempla.*

**Requisitos de calidad del block:**
- Área neta > 50% del área bruta (obligatorio).
- Espesor mínimo de pared lateral de la unidad: **22 mm**.
- Certificación de laboratorio requerida para % área neta y espesor de tabique.

**Paredes de doble soga** (cuando se requiere mayor espesor): espacio de 1 cm entre levantados relleno de mortero.
| Combinación | Espesor resultante |
|---|---|
| 14+9 cm | 24 cm |
| 14+14 cm | 29 cm |
| 14+19 cm | 34 cm |
| 19+19 cm | 39 cm |

**Aparejo:** escalonado (desfase de media unidad) **obligatorio en zona sísmica**; aparejo apilado no recomendado.

**Clasificación por clase de resistencia — identificación por color (NTG 41054):**
| Clase | Color | Capacidad de carga | Resistencia mínima (kg/cm² área neta) | Estado normativo |
|---|---|---|---|---|
| A | Azul | Superior | 140 | Normada |
| B | Rojo | Alta | 100 | Normada |
| C | Verde | Media | 66 | Normada |
| D | Negro | Baja | 50 | **NO normada** (acuerdo de facto entre fabricantes; usar con precaución en el motor de validación — marcar como "fuera de norma NTG 41054, solo referencial") |

Block sin marca de color = resistencia indeterminada → **solo apto para tapiales/bardas, nunca construcción habitada**.

**Cuadro 5-A (Cap. 4, pág. 37) — Block DT, características por clase:**
| Clase | Peso aprox. 14 cm (lb) | Peso aprox. 19 cm (lb) |
|---|---|---|
| A | 32-35 | 37-41 |
| B | 27-31 | 33-36 |
| C | 24-27 | 29-33 |
| D | 21-23 | 24-27 |
Área neta DT: 53-57% (14cm), 52-56% (19cm).

**Cuadro 5-B (Cap. 4, pág. 38) — Block UT, características por clase:**
| Clase | Peso aprox. 14 cm (lb) | Peso aprox. 19 cm (lb) |
|---|---|---|
| A | 28-30 | 34-37 |
| B | 25-27 | 30-33 |
| C | 21-23 | 25-29 |
| D | 18-20 | 21-24 |
Área neta UT: 51-53% (14cm), 50-52% (19cm).

Regla de campo: block DT de 14 cm debe pesar ~25 lb para clasificar C; <~20 lb probablemente no clasifica para vivienda/comercio.

### 3.2 Mortero de pega (NTG 41050)

**Clases:** M (mayor resistencia) > S (intermedio) > N (menor). Clase O excluida del manual.

**Cuadro 5-C (Cap. 4, pág. 40) — Proporciones en volumen:**
| Mortero | Cemento | Cal hidratada | Arena de río |
|---|---|---|---|
| Tipo M | 1 | 1/10 a 1/4 | 2¼ a 3 × (cemento+cal) |
| Tipo S | 1 | 1/4 a 1/2 | ídem |
| Tipo N | 1 | 1/2 a 1 | ídem |

**Cuadro 5-D (Cap. 4, pág. 42) — Compatibilidad Block × Mortero:**
| Block | Mortero M | Mortero S | Mortero N |
|---|---|---|---|
| Clase A | Sí | Sí | No |
| Clase B | No | Sí | No |
| Clase C | No | Sí | No |
*(Clase D no normada: tratar como Clase C por defecto, o marcar "no definido por el manual".)*

**Forma de colocación:**
- **Lecho Parcial**: dos tiras en caras laterales. Único método viable con block UT. Predominante en Guatemala.
- **Lecho Completo**: mortero en toda la superficie de contacto (solo con block DT). **10-15% más eficaz** que Lecho Parcial. Muy recomendable en el nivel inferior de edificios de varios niveles.

**Espesor de sisa:** óptimo **1 cm**. 0.5 cm no pega bien (evitar). Sisa remetida/decorativa no recomendada en paredes de 2-3 pisos combinada con Lecho Parcial.

### 3.3 Acero de refuerzo

- Barras de diseño base: **Grado 40 (NTG 36011 / equiv. A-615 Grado 40)**, calibres **#3, #4, #5**.
- Áreas: **#3 = 0.71 cm²**, **#4 = 1.27 cm²**, **#5 = 2.0 cm²**.
- Barras **#2 lisas**: solo auxiliares (estribos/eslabones), no como refuerzo principal.

**Reglas de ajuste por calidad/grado de acero (críticas para el motor de validación):**
| Condición | Ajuste al área de acero requerida |
|---|---|
| Acero sin certificar | × 1.20 (incrementar 20%) |
| Acero Grado 60 certificado | × 0.70 (reducir a 70%) |
| "Hierro de alta resistencia" (Grado 70, ASTM A1094) | **PROHIBIDO en mochetas principales** (queda endurecido por estirado en fábrica, pierde reserva de capacidad ante sismo extraordinario). Permitido solo en estribos, mallas de losa, y mochetas secundarias según calibre. |

**Cuadro 5-A (Cap. 5, pág. 52) — Comparación de capacidades de barras:**
| Calibre | Sección (cm²) | Grado | Capacidad nominal (lb) | Uso permitido |
|---|---|---|---|---|
| #2 (lisa) | 0.32 | 30 | 1500 | Solo estribos/eslabones |
| 4.5 mm | 0.159 | 70 | 1700 | Solo estribos/eslabones y malla de losa |
| 5.5 mm | 0.24 | 70 | 2600 | Malla soldada en losas; **NO en mocheta** |
| 6.2-6.4 mm | 0.30-0.32 | 70 | 3200-3450 | Mínimo aceptable en mochetas secundarias; usable en losas |
| #3 | 0.71 | 40 | 4400 | Uso general (+25% capacidad de emergencia) |
| #4 | 1.27 | 40 | 7800 | Uso general (+25% capacidad de emergencia) |
| #5 | 2.0 | 40 | 12300 | Uso general (+25% capacidad de emergencia) |

### 3.4 Concreto y graut

- **Concreto Clase 210 ("3000")**: losas, entrepisos, columnas aisladas, **obligatorio en cimientos**.
- **Concreto Clase 175 ("2500")**: permitido en mochetas y soleras.
- **Graut**: mezcla más líquida que el concreto, para rellenar celdas de block (no es concreto ni lechada). Dosificación: 1 cemento : 2½-3 arena de río (+1 parte de gravilla fina ¼" si se usa; +1/10 cal opcional). Llenar cada 3-4 hiladas para asegurar llenado completo.

---

## 4. REFUERZO DE LA MAMPOSTERÍA (mochetas y soleras)

### 4.1 Conceptos

- **Mocheta**: elemento vertical de concreto reforzado, embebido, fundido DESPUÉS del levantado. No es columna independiente ni carga peso — su función es **confinar**.
- **Solera**: elemento horizontal reforzado. No es viga, no carga losas de forma aislada.
- **Mochetas principales**: en esquinas, bordes y uniones de pared. Evitan volteo del paño; anclan el muro a la base.
- **Solera de corona**: evita que el paño se agriete en diagonal.
- Marco perimetral (solera de corona + mochetas principales + cimentación) = "mampostería confinada".
- **Mochetas/soleras intermedias**: reducen tamaño de grietas en "X" bajo sismo intenso.
- **Refuerzo inter-block ("pines")**: refuerzo secundario que puede sustituir la **mocheta intermedia**, pero **nunca las mochetas principales**.

### 4.2 Refuerzo de mochetas principales

Reglas generales:
- Depende de: espesor de pared, clase de block (A/B/C/D), tipo de block (DT/UT/con graut), y **grupo de piso** (ver abajo). En doble soga se duplica el refuerzo.
- **Refuerzo mínimo absoluto: 4#3 = 2.8 cm²** aunque la tabla indicara menos.
- 4 a 8 varillas por mocheta (usualmente 4), ninguna menor a #3.
- Estribos: #2 liso @ 20 cm en general.
- **Refuerzo especial en extremos (arriba y abajo) de cada mocheta principal: 5 estribos #2 @ 10 cm.**
- Mochetas secundarias: 2 varillas, eslabones #2 @ 20 cm (sin el refuerzo tupido de extremos).
- Regla de "mayor, nunca sumar": si dos criterios (p.ej. refuerzo sísmico y mocheta de carga) exigen refuerzo distinto en el mismo elemento, se usa el **mayor**, nunca se suman.

**Grupos de piso (aplican a las tablas de refuerzo):**
- **Grupo 1**: edificio de 1 piso, o último piso de edificios de 2 o 3 pisos.
- **Grupo 2**: primer piso de edificio de 2 pisos, o segundo piso de edificio de 3 pisos.
- **Grupo 3**: primer piso de edificio de 3 pisos.

**Cuadro 5-B (Cap. 5, pág. 54-55) — Refuerzo de mochetas principales (arreglos de barras Grado 40):**

*Grupo 1:*
| Block | Espesor | Sección | Clase A | Clase B | Sección alt. | Clase C | Clase D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×20 | 4#4+2#3 | 4#4 | 19×15 | 6#3 | 6#3 |
| DT | 14 cm | 14×20 | 4#4 | 6#3 | 14×15 | 2#4+2#3 | 4#3 |
| UT | 19 cm | 19×20 | 4#4 | 4#4 | 19×15 | 2#4+2#3 | 2#4+2#3 |
| UT | 14 cm | 14×20 | 6#3 | 6#3 | 14×15 | 4#3 | 4#3 |
| DT/UT+graut | 19 cm | 19×20 | 4#5+2#3 | 4#5 | 19×20 | 4#4+2#3 | 4#4 |
| DT/UT+graut | 14 cm | 14×25 | 4#4+2#3 | 4#4+2#3 | 14×20 | 6#3 | 2#4+2#3 |

*Grupo 2:*
| Block | Espesor | Sección | Clase A | Clase B | Sección alt. | Clase C | Clase D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×20 | 4#5+2#3 | 4#5 | 19×20 | 4#4+2#3 | 4#4+2#3 |
| DT | 14 cm | 14×20 | 4#4+2#3 | 4#4+2#3 | 14×20 | 4#4 | 2#4+2#3 |
| UT | 19 cm | 19×20 | 6#4 | 6#4 | 19×20 | 4#4+2#3 | 4#4+2#3 |
| UT | 14 cm | 14×20 | 4#4+2#3 | 4#4 | 14×20 | 4#4 | 6#3 |
| DT/UT+graut | 19 cm | 19×30 | 4#5+4#4 | 4#5+2#4 | 19×25 | 4#5+2#3 | 4#5 |
| DT/UT+graut | 14 cm | 14×30 | 4#5+2#3 | 4#5 | 14×25 | 4#4+2#3 | 4#4+2#3 |

*Grupo 3:*
| Block | Espesor | Sección | Clase A | Clase B | Sección alt. | Clase C | Clase D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×25 | 4#5+2#4 | 4#5+2#3 | 19×20 | 4#5 | 4#4+2#3 |
| DT | 14 cm | 14×25 | 4#5 | 4#4+2#3 | 14×20 | 4#4 | 4#4 |
| UT | 19 cm | 19×30 | 4#5+2#3 | 4#5 | 19×20 | 4#4+2#3 | 4#4+2#3 |
| UT | 14 cm | 14×30 | 6#4 | 4#4+2#3 | 14×20 | 4#4 | 4#4 |
| DT/UT+graut | 19 cm | 19×40 | 4#5+4#4 | 6#5 | 19×30 | 4#5+2#3 | 4#5+2#3 |
| DT/UT+graut | 14 cm | 14×40 | 4#5+2#4 | 4#5+2#3 | 14×35 | 6#4 | 4#4+2#3 |

**Cuadro 5-C (Cap. 5, pág. 55-56) — mismo contenido en área de acero requerida (cm²):**

*Grupo 1:*
| Block | Espesor | Sección | A | B | Sección alt. | C | D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×20 | 5.7 | 4.9 | 19×15 | 4.0 | 3.5 |
| DT | 14 cm | 14×20 | 4.3 | 3.8 | 14×15 | 3.1 | 2.7 |
| UT | 19 cm | 19×20 | 5.1 | 4.4 | 19×15 | 3.6 | 3.1 |
| UT | 14 cm | 14×20 | 3.9 | 3.3 | 14×15 | 2.8 | 2.4 |
| DT/UT+graut | 19 cm | 19×20 | 8.2 | 7.1 | 19×20 | 5.7 | 5.0 |
| DT/UT+graut | 14 cm | 14×25 | 6.0 | 5.2 | 14×20 | 4.2 | 3.7 |

*Grupo 2:*
| Block | Espesor | Sección | A | B | Sección alt. | C | D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×20 | 8.5 | 7.4 | 19×20 | 6.0 | 5.2 |
| DT | 14 cm | 14×20 | 6.5 | 5.6 | 14×20 | 4.6 | 4.0 |
| UT | 19 cm | 19×20 | 7.6 | 6.6 | 19×20 | 5.4 | 4.7 |
| UT | 14 cm | 14×20 | 5.8 | 5.0 | 14×20 | 4.1 | 3.5 |
| DT/UT+graut | 19 cm | 19×30 | 12.2 | 10.6 | 19×25 | 8.6 | 7.5 |
| DT/UT+graut | 14 cm | 14×30 | 9.0 | 7.8 | 14×25 | 6.3 | 5.5 |

*Grupo 3:*
| Block | Espesor | Sección | A | B | Sección alt. | C | D |
|---|---|---|---|---|---|---|---|
| DT | 19 cm | 19×25 | 9.5 | 8.2 | 19×20 | 6.7 | 5.8 |
| DT | 14 cm | 14×25 | 7.2 | 6.3 | 14×20 | 5.1 | 4.4 |
| UT | 19 cm | 19×30 | 8.5 | 7.4 | 19×20 | 6.0 | 5.2 |
| UT | 14 cm | 14×30 | 6.4 | 5.6 | 14×20 | 4.5 | 3.9 |
| DT/UT+graut | 19 cm | 19×40 | 13.5 | 11.7 | 19×30 | 9.5 | 8.3 |
| DT/UT+graut | 14 cm | 14×40 | 10.0 | 8.6 | 14×30 | 7.0 | 6.1 |

*Ejemplo de aplicación (pág. 55-56): edificio 3 pisos, primer piso, block DT 19cm Clase B → 8.2 cm² requeridos → 4#5+2#3 = 4(1.9)+2(0.70) = 9.0 cm² ✓ (alternativa: 8#4 = 9.6 cm² también cumple).*

### 4.3 Refuerzo de soleras principales

**Cuadro 5-D (Cap. 5, pág. 58) — Soleras principales:**
| Solera | Ancho | Alto | Refuerzo |
|---|---|---|---|
| Solera de humedad | 14 o 19 cm | 20 cm | 4#3, estribos #2 @ 20 cm |
| Solera de entrepiso | 14 o 19 cm | 20 cm | 4#4, estribos #2 @ 20 cm |
| Solera de azotea | 14 o 19 cm | 20 cm | 4#3, estribos #2 @ 20 cm |

- Solera de humedad corre bajo TODAS las paredes, incluidos vanos de puertas (sobre el cimiento corrido).
- Solera de entrepiso/azotea corre sobre TODOS los bordes de tablero apoyados en pared, incluidos vanos.
- Solera con 4 varillas: estribo cerrado #2@20cm. Solera con 2 varillas: eslabones #2@30-40cm, altura 10 cm.
- No se recomienda refuerzo horizontal en sisa de mortero (varillas 4.5mm) en lugar de solera — mayor riesgo de corrosión.

### 4.4 Soleras intermedias y refuerzo vertical intermedio

**Cuadro 5-E (Cap. 5, pág. 61) — Soleras intermedias:**
| | 14cm, 1 solera | 14cm, 2 soleras | 19cm, 1 solera | 19cm, 2 soleras |
|---|---|---|---|---|
| Refuerzo | 4#3 | 2×[2#3] | 4#3 | 2×[2#3] |
| Sección | 14×20 | 2×[14×10] | 19×20 | 2×[19×10] |

**Opción A — Pines (refuerzo inter-block), separación según calibre:**
| Calibre | 14cm-1sol | 14cm-2sol | 19cm-1sol | 19cm-2sol |
|---|---|---|---|---|
| #3 @ | 0.80 m | 0.80 m | 0.40 m | 0.40 m |
| #4 @ | 1.20 m | 1.20 m | 0.60 m | 0.80 m |
| #5 @ | n/a | n/a | 1.00 m | 1.00 m |

**Opción B — Mocheta intermedia, según separación S entre mochetas principales:**
| S (m) | 14cm-1sol | 14cm-2sol | 19cm-1sol | 19cm-2sol |
|---|---|---|---|---|
| S < 2.0 | n/a (se omite) | n/a | n/a | n/a |
| S = 2.5 | 2#3 (11×14) | 2#3 (11×14) | 2#4 (11×19) | 2#4 (14×19) |
| S = 3.0 | 2#3 (11×14) | 2#3 (11×14) | 4#3 (14×19) | 4#3 (14×19) |
| S = 3.5 | 1#3+1#4 (11×14) | 1#3+1#4 (11×14) | 2#3+2#4 (14×19) | 2#3+2#4 (14×19) |
| S = 4.0 | 1#3+1#4 (11×14) | 1#3+1#4 (11×14) | 2#3+2#4 (14×19) | 2#3+2#4 (14×19) |
| S = 4.5 | 2#4 (11×14) | 2#4 (11×14) | 4#4 (14×19) | 4#4 (14×19) |

Reglas: si mochetas principales quedan a **< 3.0 m** puede omitirse la mocheta intermedia. El método simplificado evita separaciones **> 4.50 m** entre mochetas principales cuando la planta está bien modulada en tableros. Refuerzo vertical intermedio (mocheta o pin) es **obligatorio en zona sísmica Anaranjada y Amarilla**, **omitible en zona Blanca**.

---

## 5. SISTEMA ESTRUCTURAL DE CAJÓN

### 5.1 Concepto
Las paredes de mampostería son la propia estructura soportante (sin marco de columnas/vigas independiente). Mochetas/soleras no cargan — su función es confinar. Losas transmiten carga a paredes internas y externas; las cargas bajan directo por las paredes hasta cimiento corrido continuo (nunca zapatas aisladas bajo mochetas de esquina).

### 5.2 Tableros
Reglas de modulación de la planta:
- Área máxima por tablero: **18.0 m²** (preferible no pasar de 14-15 m²).
- Lado máximo de tablero: **4.50 m**.
- Tableros de niveles superiores deben coincidir con los inferiores.
- Todo borde de tablero "en el aire" (sin pared debajo) requiere **viga**.
- Voladizos permitidos hasta **1.20 m**, sin viga en el borde, sin pared sobre el extremo; tributan toda su área a un solo borde.

### 5.3 Áreas tributarias
- Losa fundida in situ: tablero se divide en **4 cuarterones** triangulares (o **2** si el tablero es "alargado": lado largo > 1.5× lado corto).
- Losa prefabricada/viguetas: tablero se divide en **2** áreas según dirección de apoyo.
- **Paredes** (cargan todos los niveles): área tributaria = suma de cuarterones del propio nivel **+ niveles superiores**.
- **Vigas**: área tributaria = solo cuarterones de su propio nivel (no se suman niveles).

---

## 6. CAPACIDAD DE CARGA VERTICAL

**Fórmula:** `Ct = longitud de pared (m) × coeficiente del Cuadro 6-A` → debe cumplirse **`Ct ≥ At`** (área tributaria real).

**Cuadro 6-A — Área tributaria soportable por 1 m lineal de pared (m²/m), con Wu = 1800 lb/m²:**
| Block | Espesor | Mortero | Clase A | Clase B | Clase C | Clase D |
|---|---|---|---|---|---|---|
| DT | 19 cm | Lecho completo | 9.1 | 6.9 | 4.5 | 3.4 |
| DT | 14 cm | Lecho completo | 7.0 | 5.3 | 3.5 | 2.6 |
| DT | 19 cm | Lecho parcial | 8.2 | 6.2 | 4.1 | 3.1 |
| DT | 14 cm | Lecho parcial | 6.3 | 4.7 | 3.1 | 2.4 |
| UT | 19 cm | Lecho parcial | 7.8 | 5.9 | 3.9 | 2.9 |
| UT | 14 cm | Lecho parcial | 5.9 | 4.4 | 2.9 | 2.2 |
| UT o DT + graut (todas celdas) | 19 cm | — | 12.5 | 9.4 | 6.2 | 4.7 |
| UT o DT + graut (todas celdas) | 14 cm | — | 9.2 | 6.9 | 4.6 | 3.5 |
| Pared de concreto Clase 210 | 19 cm | — | 18.2 | | | |
| Pared de concreto Clase 210 | 14 cm | — | 13.4 | | | |
| Columna 30×30 | — | — | 8.6 | | | |
| Columna 40×40 | — | — | 15.3 | | | |

*Ejemplo del manual: pared 3.40 m, block DT 14cm Clase C, lecho parcial → coef. 3.1 → Ct = 3.40×3.1 = 10.54 m². Si At real = 6.0 m² (2 niveles), la pared es adecuada.*

---

## 7. VIGAS Y MOCHETAS DE CARGA

**Regla crítica de "transferencia de cargas":** una viga de entrepiso **NO debe** cargar una pared que a su vez soporte más losa arriba. Si se necesita pared arriba sin pared abajo, usar **tablayeso**, nunca mampostería.

**Cuadro 6-B — Vigas para entrepisos/azoteas** (concreto 210, grado 40, acero mínimo = 0.005·b·d, w = 1155 lb/m² servicio):
| Largo (m) | 2.0 | 2.5 | 3.0 (h30) | 3.0 (h35) | 3.5 | 4.0 | 4.5 |
|---|---|---|---|---|---|---|---|
| b (cm) | 14 o 19 | 14 o 19 | 19 | 19 | 19 | 19 | 19 |
| h (cm) | 30 | 30 | 30 | 35 | 35 | 35 | 35 |

Refuerzo según Área Tributaria (m²):
| At (m²) | L=2.0 | L=2.5 | L=3.0(h30) | L=3.0(h35) | L=3.5 | L=4.0 | L=4.5 |
|---|---|---|---|---|---|---|---|
| 13 | 3#4 | 3#4 | 2#5+1#4 | 3#4 | 2#5+1#4 | 2#5+1#4 | 3#5 |
| 12 | 3#4 | 3#4 | 2#5+1#4 | 3#4 | 2#5+1#4 | 2#5+1#4 | 2#5+1#4 |
| 10 | 2#4 | 3#4 | 3#4 | 3#4 | 3#4 | 2#5 | 2#5+1#4 |
| 8 | 2#4 | 2#4 | 3#4 | 3#4 | 3#4 | 3#4 | 3#4 |
| ≤6 | 2#4 | 2#4 | 2#4 | 3#4 | 3#4 | 3#4 | 3#4 |
Estribos: #2@15cm (L=2.0-3.0) / #2@12cm (L=3.0-4.5).

**Cuadro 6-C — Mochetas de carga** (usar la mayor entre esta tabla y el refuerzo sísmico del Cuadro 5-B/5-C):

*1 nivel:*
| # vigas | pared 14 cm | pared 19 cm |
|---|---|---|
| 1 | 14×14, 4#4 | 19×15, 4#4 |
| 2 | 14×14, 4#4 | 19×15, 4#4 |
| 3 | 14×20, 4#4 | 19×20, 4#4 |

*2 niveles:*
| # vigas | pared 14 cm | pared 19 cm |
|---|---|---|
| 1 | 14×14, 4#4 | 19×20, 4#4 |
| 2 | 14×30, 6#4 | 19×20, 4#4 |
| 3 | 25×25, 8#4 | 25×25, 8#4 |

*3 niveles:*
| # vigas | pared 14 cm | pared 19 cm |
|---|---|---|
| 1 | 14×20, 6#4 | 19×20, 6#4 |
| 2 | 25×25, 8#4 | 25×25, 8#4 |
| 3 | 30×30, 8#4 | 30×30, 8#4 |

*Columnas aisladas (NUNCA cuentan para resistir sismo, solo peso):*
| # vigas | 1 nivel | 2 niveles | 3 niveles |
|---|---|---|---|
| 2 | 25×25, 4#5 | 25×25, 4#5 | 25×25, 4#5 |
| 3 | 25×25, 4#5 | 25×25, 4#5 | 30×30, 8#5 |
| 4 | 25×25, 4#5 | 30×30, 8#5 | 35×35, 8#5 |

---

## 8. VERIFICACIÓN SISMO-RESISTENTE (el núcleo del método — Paso 4)

### 8.1 Zonas sísmicas y coeficiente Cf
| Zona (Anexo 1) | Índice numérico | Cf | Cuadro a usar |
|---|---|---|---|
| Anaranjada (máxima demanda) | 4 | 0.28 | Cuadro 6-D1 |
| Amarilla (intermedia) | 3 | 0.20 | Cuadro 6-D2 |
| Blanca (mínima demanda, ej. Petén) | 2 | 0.13 | Cuadro 6-D3 |

Wu = 1800 lb/m² (peso estructural asumido, fijo en todo el método, no ajustable por el usuario).

### 8.2 Reglas de "conteo de paredes" (motor de validación)
1. Solo cuentan paredes de **piso a cielo** (los sillares de ventana NO cuentan).
2. Pared con longitud **< 1.20 m ("muñeco") NO cuenta** para sismo (sí cuenta para carga vertical).
3. Si los muñecos se rellenan con graut o se funden en concreto: se permite sumar **la mitad de su longitud** a la cuenta sismo-resistente.
4. Columnas aisladas **NUNCA cuentan** para sismo.
5. Medir y sumar longitudes **por separado en cada dirección ortogonal**.

### 8.3 Fórmula de verificación
```
Capacidad_dirección = Σ (longitud efectiva de pared × coeficiente del Cuadro 6-D correspondiente)
Capacidad_dirección ≥ Área de construcción retenida (Ac = suma de áreas de todos los niveles soportados)
```

### 8.4 Cuadro 6-D — Capacidad sismo-resistente (m² de construcción retenidos por 1 m lineal de pared)

**6-D1 — Zona Anaranjada (Cf=0.28):**
| Block | Espesor | Mortero | A | B | C | D |
|---|---|---|---|---|---|---|
| DT | 19 | Lecho completo | 14.8 | 12.9 | 10.5 | 9.1 |
| DT | 14 | Lecho completo | 11.4 | 9.9 | 8.0 | 7.0 |
| DT | 19 | Lecho parcial | 14.1 | 12.2 | 9.9 | 8.6 |
| DT | 14 | Lecho parcial | 10.8 | 9.4 | 7.6 | 6.6 |
| UT | 19 | Lecho parcial | 13.3 | 11.6 | 9.4 | 8.2 |
| UT | 14 | Lecho parcial | 10.1 | 8.8 | 7.1 | 6.2 |
| UT/DT + graut | 19 | Todas celdas | 21.3 | 18.5 | 15.0 | 13.1 |
| UT/DT + graut | 14 | Todas celdas | 15.7 | 13.6 | 11.1 | 9.6 |

**6-D2 — Zona Amarilla (Cf=0.20):**
| Block | Espesor | Mortero | A | B | C | D |
|---|---|---|---|---|---|---|
| DT | 19 | Lecho completo | 20.8 | 18.0 | 14.6 | 12.7 |
| DT | 14 | Lecho completo | 15.9 | 13.8 | 11.2 | 9.8 |
| DT | 19 | Lecho parcial | 19.7 | 17.1 | 13.9 | 12.1 |
| DT | 14 | Lecho parcial | 15.1 | 13.1 | 10.6 | 9.3 |
| UT | 19 | Lecho parcial | 18.7 | 16.2 | 13.2 | 11.5 |
| UT | 14 | Lecho parcial | 14.1 | 12.3 | 10.0 | 8.7 |
| UT/DT + graut | 19 | Todas celdas | 29.9 | 25.9 | 21.0 | 18.3 |
| UT/DT + graut | 14 | Todas celdas | 22.0 | 19.1 | 15.5 | 13.5 |

**6-D3 — Zona Blanca (Cf=0.13)** — *no incluye fila de "graut" en el manual original*:
| Block | Espesor | Mortero | A | B | C | D |
|---|---|---|---|---|---|---|
| DT | 19 | Lecho completo | 32.0 | 27.7 | 22.5 | 19.6 |
| DT | 14 | Lecho completo | 24.5 | 21.2 | 17.3 | 15.0 |
| DT | 19 | Lecho parcial | 30.3 | 26.3 | 21.4 | 18.6 |
| DT | 14 | Lecho parcial | 23.2 | 20.2 | 16.4 | 14.3 |
| UT | 19 | Lecho parcial | 28.7 | 24.9 | 20.2 | 17.6 |
| UT | 14 | Lecho parcial | 21.8 | 18.9 | 15.3 | 13.3 |

### 8.5 Distribución de paredes (control de excentricidad)
**Regla oficial (criterio de aceptación/rechazo):**
1. Dividir la planta en **3 franjas imaginarias de igual ancho**, en cada dirección examinada.
2. En **cada franja** debe quedar como mínimo el **25%** de la longitud de pared **necesaria** en esa dirección (el 25% se calcula sobre la longitud necesaria según Cuadro 6-D, no sobre la existente).
3. Puede haber más del 25% en una franja, nunca menos.

*Ejemplo: si se necesitan 10.94 m lineales totales en una dirección, cada franja debe tener ≥ 2.735 m.*

**Configuración en planta:** las configuraciones básicas son "cuadro" (paredes en los 4 lados exteriores — la preferida), "C", "túnel", "esquinero", "cruz". El **cuadro** ofrece la mejor protección sísmica.

**Continuidad vertical:** las paredes sismo-resistentes deben ser continuas de techo a cimiento en todos los niveles (misma distribución en cada piso). Paredes internas sin continuidad hacia abajo: usar **tablayeso**, no mampostería.

---

## 9. CIMENTACIÓN

- **Tipo único:** cimiento corrido continuo bajo toda pared (incluye vanos de puertas). Zapatas aisladas SOLO bajo columnas o mochetas de carga que reciben varias vigas — nunca bajo mochetas de esquina normales.
- **Profundidad de zanja:** 60-80 cm (no usar menos de 50 cm).
- **Configuración:** cimiento corrido de concreto Clase 210 + 2 (a veces 3) hiladas de block (mismo tipo/clase que la pared) + solera de humedad (4 barras) formando anillo cerrado.
- **Aplicabilidad de las tablas:** válidas para suelo de calidad aceptable, **capacidad soporte ≥ 10 Tm/m²**, zanja ~70 cm, Wu=1800 lb/m². Suelos de baja calidad requieren asesoría externa (fuera del alcance del método simplificado).
- **Método de tanteo de suelo (no riguroso):** varilla #5 de 75 cm, apoyar con el peso del cuerpo; si no se hunde >1-2 cm, el fondo se considera aceptable.

**Cuadro 6-E1 — Ancho de cimiento corrido CENTRADO en pared** (código de sección, ver Cuadro 6-F1):
| Block | Espesor | Mortero | A | B | C | D |
|---|---|---|---|---|---|---|
| DT | 19 | Lecho completo | CC6 | CC4 | CC2 | CC1 |
| DT | 14 | Lecho completo | CC4 | CC3 | CC1 | CC1 |
| DT | 19 | Lecho parcial | CC5 | CC3 | CC2 | CC1 |
| DT | 14 | Lecho parcial | CC3 | CC2 | CC1 | CC1 |
| UT | 19 | Lecho parcial | CC5 | CC3 | CC1 | CC1 |
| UT | 14 | Lecho parcial | CC3 | CC2 | CC1 | CC1 |
| UT/DT + graut | 19 | Todas celdas | CC7 | CC6 | CC3 | CC2 |
| UT/DT + graut | 14 | Todas celdas | CC6 | CC4 | CC2 | CC1 |

**Cuadro 6-E2 — Ancho de cimiento EXCÉNTRICO de lindero** (sobre-esfuerzo permitido 50%):
| Block | Espesor | Mortero | A | B | C | D |
|---|---|---|---|---|---|---|
| DT | 19 | Lecho completo | CC8-L | CC6-L | CC3-L | CC2-L |
| DT | 14 | Lecho completo | CC6-L | CC4-L | CC2-L | CC1-L |
| DT | 19 | Lecho parcial | CC7-L | CC5-L | CC3-L | CC2-L |
| DT | 14 | Lecho parcial | CC5-L | CC3-L | CC2-L | CC1-L |
| UT | 19 | Lecho parcial | CC7-L | CC5-L | CC2-L | CC1-L |
| UT | 14 | Lecho parcial | CC5-L | CC3-L | CC1-L | CC1-L |
| UT/DT + graut | 19 | Todas celdas | CC9-L | CC8-L | CC5-L | CC3-L |
| UT/DT + graut | 14 | Todas celdas | CC8-L | CC6-L | CC3-L | CC2-L |

**Cuadro 6-F1 — Dimensiones/refuerzo cimiento corrido concéntrico** (concreto 210, grado 40):
| Tipo | B ancho (m) | T espesor (m) | Refuerzo transversal | Refuerzo longitudinal |
|---|---|---|---|---|
| CC7 | 1.00 | 0.20 | #3@0.18 | 5#3 |
| CC6 | 0.80 | 0.18 | #3@0.20 | 4#3 |
| CC5 | 0.70 | 0.18 | #3@0.22 | 4#3 |
| CC4 | 0.60 | 0.18 | #3@0.25 | 4#3 |
| CC3 | 0.50 | 0.18 | #3@0.25 | 3#3 |
| CC2 | 0.40 | 0.18 | #3@0.25 | 3#3 |
| CC1 | 0.30 | 0.18 | #3@0.25 | 3#3 |

**Cuadro 6-F2 — Dimensiones/refuerzo cimiento corrido de lindero:**
| Tipo | B (m) | T (m) | Transversal | Longitudinal |
|---|---|---|---|---|
| CC9-L | 1.35 | 0.22 | #4@0.28 | 6#3 |
| CC8-L | 1.00 | 0.20 | #3@0.18 | 4#3 |
| CC7-L | 0.90 | 0.18 | #3@0.20 | 4#3 |
| CC6-L | 0.80 | 0.18 | #3@0.25 | 4#3 |
| CC5-L | 0.70 | 0.18 | #3@0.25 | 3#3 |
| CC4-L | 0.60 | 0.18 | #3@0.25 | 3#3 |
| CC3-L | 0.50 | 0.18 | #3@0.25 | 3#3 |
| CC2-L | 0.40 | 0.18 | #3@0.25 | 3#3 |
| CC1-L | 0.30 | 0.18 | #3@0.25 | 3#3 |

**Cuadro 6-G — Zapata según mocheta de carga / columna aislada:**
| # vigas → mocheta de carga | interior 1/2/3 niveles | lindero 1/2/3 niveles |
|---|---|---|
| 1 | Z1/Z2/Z3 | Z1-L/Z2-L/Z3-L |
| 2 | Z2/Z4/Z5 | Z2-L/Z4-L/Z5-L |
| 3 | Z3/Z5/Z7 | — |

| # vigas → columna aislada | interior 1/2/3 | lindero 1/2/3 |
|---|---|---|
| 1 | Z1/Z2/Z3 | Z1-L/Z2-L/Z3-L |
| 2 | Z2/Z4/Z5 | Z2-L/Z4-L/Z5-L |
| 3 | Z3/Z5/Z7 | Z3-L/Z5-L/Z6-L |
| 4 | Z4/Z6/Z8 | — |

**Cuadro 6-H — Planilla de zapatas-tipo:**
| Interior | L×L (m) | T (m) | Refuerzo | | Lindero | L×L (m) | T (m) | Refuerzo |
|---|---|---|---|---|---|---|---|---|
| Z1 | 0.50 | 0.18 | #3@20 | | Z1-L | 0.60 | 0.18 | #3@20 |
| Z2 | 0.70 | 0.18 | #3@20 | | Z2-L | 0.80 | 0.20 | #3@20 |
| Z3 | 0.85 | 0.20 | #4@30 | | Z3-L | 1.00 | 0.20 | #4@30 |
| Z4 | 1.00 | 0.20 | #4@30 | | Z4-L | 1.20 | 0.25 | #4@25 |
| Z5 | 1.20 | 0.25 | #4@25 | | Z5-L | 1.40 | 0.30 | #4@20 |
| Z6 | 1.40 | 0.30 | #4@20 | | Z6-L | 1.70 | 0.40 | #5@25 |
| Z7 | 1.50 | 0.35 | #5@28 | | — | | | |
| Z8 | 1.70 | 0.40 | #5@25 | | — | | | |

---

## 10. PROCEDIMIENTO DE DISEÑO — LOS 7 PASOS (flujo recomendado para la web app)

1. **Reglas de juego**: verificar límites de aplicabilidad (Sección 1 de este documento).
2. **Modular la estructura**: dividir en tableros (≤18 m², lado ≤4.5m, iguales por nivel) y verificar capacidad de carga vertical (Cuadro 6-A) — este chequeo puede posponerse hasta después del Paso 4.
3. **Vigas y mochetas de carga**: donde no hay pared bajo el borde de losa (Cuadros 6-B y 6-C).
4. **Sistema sismo-resistente** (el más crítico):
   a. Contar longitudes de pared por dirección (reglas de conteo, Sección 8.2).
   b. Verificar capacidad: `Σ(longitud × coef. Cuadro 6-D) ≥ Área de construcción retenida`.
   c. Verificar distribución: 3 franjas, ≥25% de longitud necesaria en cada una.
5. **Ubicar y reforzar mochetas y soleras** (Cuadros 5-A a 5-E).
6. **Configurar cimentación** (Cuadros 6-E1/E2, 6-F1/F2, 6-G, 6-H).
7. **Refuerzo de losas** (fuera del alcance de este manual — remite a fascículo AGIES DSE 4-04 separado).

---

## 11. ANEXO 1 — ZONAS SÍSMICAS Y DE VIENTO POR MUNICIPIO

**Formato:** `No. | Municipio | Departamento | Zona sísmica (índice 2/3/4) | Zona de viento (A/B)`
Fuente: Norma NSE 4-2013, simplificación del Anexo A de la Norma NSE 2.

Ejemplos:
| Municipio | Departamento | Zona sísmica | Zona viento |
|---|---|---|---|
| Amatitlán | Guatemala | 4 (Anaranjada) | B |
| Champerico | Retalhuleu | 4 | A |
| Cobán | Alta Verapaz | 3 (Amarilla) | B |
| Dolores | Petén | 2 (Blanca) | B |
| Escuintla | Escuintla | 4 | A |
| Guatemala | Guatemala | 4 | B |
| San Mateo Ixtatán | Huehuetenango | 3 | B |
| San Francisco El Alto | Totonicapán | 4 | B |

Patrones generales: zona 2 (Blanca) concentrada en Petén; zona 3 (Amarilla) en Alta Verapaz, norte de Huehuetenango, Chiquimula, norte de Quiché; zona 4 (Anaranjada, mayoría del país) cubre centro, occidente, oriente y sur. Zona de viento A concentrada en Costa Sur e Izabal.

**Nota para el desarrollo de la app:** el manual contiene la lista completa de ~334 municipios de Guatemala con su zona sísmica y de viento (Anexo 1, págs. 128-137 del documento). Para cargar esta tabla completa en la base de datos de la aplicación se recomienda una extracción dedicada línea por línea del PDF original (no crítica para las reglas de cálculo en sí, pero sí para que el usuario seleccione su municipio y el sistema determine automáticamente la zona/Cf aplicable).

---

## 12. REGLAS TRANSVERSALES CLAVE PARA EL MOTOR DE VALIDACIÓN

Resumen de las reglas "duras" (pass/fail) más importantes a codificar:

1. `niveles ≤ 3`, `alturaNivel ≤ 3.0 m`, `alturaTotal ≤ 8.0 m`.
2. `L1/L2 ≤ 3.0` (esbeltez en planta).
3. `H/L ≤ 2.0` (esbeltez en elevación).
4. `Av/Ae ≤ 0.25` (regularidad en planta).
5. `Área tablero ≤ 18.0 m²`, `lado tablero ≤ 4.50 m`, `voladizo ≤ 1.20 m`.
6. `Ct (capacidad tributaria) ≥ At (área tributaria)` por cada tramo de pared — carga vertical.
7. Pared cuenta para sismo solo si `longitud ≥ 1.20 m` (mitad de longitud si el muñeco está grouteado).
8. `Capacidad sísmica direccional (Σ longitud×coef. 6-D) ≥ Área de construcción retenida`, evaluado **por separado en cada dirección ortogonal**.
9. Cada una de las 3 franjas por dirección debe tener `≥ 25%` de la longitud de pared necesaria.
10. Separación entre mochetas principales: recomendado `≤ 4.50 m` (con tabla de refuerzo intermedio hasta ese límite; por debajo de 3.0 m se puede omitir refuerzo intermedio).
11. Refuerzo de mocheta principal `≥ 4#3 (2.8 cm²)` en cualquier caso.
12. Ajustes de acero: sin certificar `×1.20`; Grado 60 certificado `×0.70`; Grado 70 ("alta resistencia") prohibido en mochetas principales.
13. Ante dos exigencias distintas de refuerzo sobre el mismo elemento (p. ej. mocheta de carga vs. mocheta sísmica): usar el **mayor**, nunca sumar.
14. Prohibida la "transferencia de cargas" (viga que soporta pared que a su vez soporta losa superior) — usar tablayeso en su lugar.
15. Cimiento corrido obligatorio bajo toda pared; zapatas solo bajo columnas/mochetas de carga con varias vigas.
16. Refuerzo vertical intermedio obligatorio en zonas Anaranjada/Amarilla, omitible en zona Blanca.
17. Continuidad vertical de paredes sismo-resistentes entre niveles (misma distribución en todos los pisos).

---

## 13. LO QUE ESTE MANUAL NO CUBRE (fuera de alcance — otros fascículos AGIES)

- Diseño detallado de refuerzo de losas (fundidas in situ o de viguetas prefabricadas) → fascículo separado.
- Techos de lámina/artesonados y su resistencia al viento → fascículo separado "Edificación Menor con Techos de Lámina".
- Amenazas de terreno (derrumbes, deslaves, licuefacción) → fascículo "En Busca de Terrenos Seguros para Construir".
- Mampostería de ladrillo de arcilla cocida o piedra → solo mencionadas, no desarrolladas.
- Construcción de adobe → expresamente desaconsejada (Anexo 5), no cubierta.
- Salones/edificaciones públicas con paredes altas y largas → fascículo separado.
- Metodología de cálculo detrás de las tablas precalculadas → Documento técnico AGIES DSE 4.11 (separado, no público en este manual).

---

## Fuentes de este análisis
Extracción y verificación realizada sobre los 3 archivos PDF proporcionados por el usuario (páginas 1-26, 27-66, 67-158 del documento original, 158 páginas totales), mediante extracción de texto (pdftotext/pypdf) y de tablas (pdfplumber), con lectura línea por línea del texto completo y verificación cruzada de los valores numéricos críticos (Wu=1800 lb/m², coeficientes Cf 0.28/0.20/0.13, regla del 25% de distribución por franjas, límite de tablero de 18.0 m², límite de 1.20 m para conteo de paredes, criterios de esbeltez L1/L2 y H/L, criterio de regularidad Av/Ae) contra el texto original del documento.
