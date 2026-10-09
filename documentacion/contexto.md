# Documentación Técnica y de Diseño UX/UI — Hero Archive

**Proyecto:** Selección interactiva de héroes (Hero Archive)  
**Materia/Ámbito:** Programación Web Dinámica  
**Fecha:** Octubre 2026  
**Rol:** Desarrollador Frontend & Diseñador UX/UI  

---

## 1. Resumen Ejecutivo del Proyecto

El proyecto **Hero Archive** consiste en una aplicación web interactiva que permite a los usuarios explorar y seleccionar héroes legendarios de cómics (DC y Marvel). El objetivo principal de esta etapa fue transformar la interfaz inicial en una experiencia visual premium con estética de **cómic clásico / novela gráfica minimalista**, eliminando la sobrecarga visual y optimizando la jerarquía, la respuesta táctil y las microinteracciones.

---

## 2. Decisiones de Diseño y Dirección de Arte (UX/UI)

### 2.1. Evolución del Concepto: Cómic Clásico a Minimalismo Editorial
Inicialmente, la página contaba con una carga visual excesiva: bordes gruesos de 3px, recuadros pesados con cortes angulares, colores amarillos estridentes y textos secundarios que competían por la atención del usuario.

Se refinó el concepto hacia un **estilo de novela gráfica de lujo (Graphic Novel Deluxe / Alex Ross aesthetic)**:
* **Foco Puro en el Protagonista:** En el escenario principal (`#heroStage`) se eliminaron marcos contenedores, barras de separación y botones secundarios. La atención recae en el **símbolo del héroe (logo)** y en su **nombre**.
* **Eliminación del ruido:** Se removieron los recuadros poligonales que encerraban al héroe, las leyendas contextuales repetitivas y las órbitas decorativas que ensuciaban el fondo.

### 2.2. Nueva Paleta Cromática y Atmósfera
* **Fondo Noir & Carbón (`#07080b`):** Base oscura profunda que permite que los colores de cada héroe contrasten con máxima pureza.
* **Erradicación de amarillos no deseados:** Se sustituyeron los acentos dorados/amarillos saturados por una escala refinada de blanco tiza (`#f8fafc`), plata y marfil (`#f2f0ef`).
* **Color Dinámico por Héroe (`--tone`):** Cada personaje inyecta su propia identidad de color mediante variables CSS gestionadas por JavaScript:
  * **Spider-Man:** Rojo carmesí (`#e8474c`)
  * **Green Lantern:** Verde esmeralda (`#48c982`)
  * **Batman:** Plata ceniza (`#b9c4d1`)
  * **Superman:** Rojo escarlata (`#df424b`)
  * **Hulk:** Verde gamma (`#78c951`)
  * **Iron Man:** Ámbar dorado (`#eaa24d`)
  * **Wonder Woman:** Oro amazona (`#e5b86c`)
  * **Captain America:** Azul cobalto (`#5d9dd3`)

### 2.3. Tratamiento de la Imagen de Fondo
Se incorporó la ilustración clásica de la Liga de la Justicia (arte de Alex Ross, `img/background.jpg`) como telón de fondo ambiental:
* **Filtro de Desaturación y Brillo:** Se aplicó `filter: grayscale(100%) brightness(0.42) contrast(1.15)` combinado con un degradado radial oscuro en modo `multiply`.
* **Resultado:** La imagen añade profundidad atmosférica sin saturación ni tonos chillones, garantizando legibilidad total del contenido central.
* **Trama Ben-Day minimalista:** Una microtrama de puntos de cómic con opacidad al `4%` recrea sutilmente la textura de papel de imprenta clásico.

---

## 3. Microinteracciones, Animaciones y UX

### 3.1. Animación de Entrada del Logo
* Al cargar la página o cambiar de personaje, el logo se materializa aumentando su tamaño progresivamente (`@keyframes logo-enter`):
  * **Inicio:** Escala al `65%` con una leve rotación inicial de `-3deg` y opacidad cero.
  * **Pico dinámico:** Crece hasta un `110%` (`overshoot` pop) para dar sensación elástica y viva.
  * **Reposo:** Se asienta con fluidez en el `100%`.

### 3.2. Halo Luminoso y Sistema de Resplandor (Glow)
* **Resplandor continuo:** El logo posee un halo difuso circular (`.emblem-halo`) y capas de `drop-shadow` sincronizadas con `--tone`.
* **Hover interactivo reforzado:** Al posicionar el cursor sobre el logo:
  * El emblema escala a `1.05`.
  * La imagen del logo crece a `1.08`.
  * El resplandor se multiplica en cuatro capas con blanco puro y el tono del personaje, generando un destello de energía superheroica.

### 3.3. Flechas de Navegación Minimalistas y Notorias
* Se prescindió de los botones circulares pesados.
* Se diseñaron **chevrons flotantes de 18px con trazo de 3px**.
* Poseen una opacidad base del `75%` y doble sombra proyectada para máxima visibilidad.
* **En interacción (`:hover`):** Se desplazan lateralmente hacia afuera (`translateX ±6px`), escalan un `12%` y proyectan un resplandor del color del héroe actual.

---

## 4. Estructura de Archivos Modificados

| Archivo | Tipo de Intervención | Detalle de los Cambios |
|---|---|---|
| [`styles.css`](file:///c:/Users/sanma/Desktop/escuela/programacion%20web%20dinamica/proyecto%201/styles.css) | Rediseño Integral | Implementación de tokens de diseño, tipografía Bangers, eliminación de marcos en hero-stage, nuevo fondo noir con filtros, flechas minimalistas y animaciones de resplandor y escala. |
| [`script.js`](file:///c:/Users/sanma/Desktop/escuela/programacion%20web%20dinamica/proyecto%201/script.js) | Lógica de Animación | Incorporación del disparo de animación `arrive` en la carga inicial para que el primer héroe también entre con efecto dinámico. |
| [`index.html`](file:///c:/Users/sanma/Desktop/escuela/programacion%20web%20dinamica/proyecto%201/index.html) | Estructura & Accesibilidad | Mantenimiento de la semántica HTML5, atributos ARIA para lectores de pantalla y soporte de eventos táctiles. |

---

## 5. Accesibilidad (A11y) y Rendimiento

* **Consultas de Movimiento Reducido:** Se implementó `@media (prefers-reduced-motion: reduce)` para deshabilitar las transiciones en usuarios sensibles a animaciones.
* **Contraste:** Todo el texto principal cumple con el ratio de contraste WCAG AA/AAA sobre fondo oscuro.
* **Diseño Responsivo:** Breakpoints adaptados para pantallas menores a `700px` y `390px`, manteniendo la legibilidad y la escala adecuada de los logotipos en dispositivos móviles.
