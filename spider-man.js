/* ============================================================
   SPIDER-MAN — interacciones de la página
   1. Inclinación 3D (logo, título, galería y tarjetas)
   2. Entradas al hacer scroll ([data-reveal])
   3. Galería · Actores: lente que revela la máscara
   4. Portadores: fotos faltantes y selección de tarjetas
   ============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* ── 1. Inclinación 3D ──
   Mientras el puntero se mueve sobre "area", el elemento "el" recibe
   --tx / --ty (grados) y --gx / --gy (posición del reflejo de luz). */
function addTilt(area, el = area, max = 8) {
  if (reduceMotion || !canHover || !area || !el) return;
  area.addEventListener('pointermove', (event) => {
    const box = area.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    el.style.setProperty('--tx', ((x - 0.5) * max * 2).toFixed(2) + 'deg');
    el.style.setProperty('--ty', ((0.5 - y) * max * 2).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  });
  area.addEventListener('pointerleave', () => {
    el.style.setProperty('--tx', '0deg');
    el.style.setProperty('--ty', '0deg');
  });
}

addTilt(document.querySelector('.hero-mark'), document.querySelector('.mark-core'), 14);
addTilt(document.querySelector('.hero h1'), document.querySelector('.hero h1'), 7);
document.querySelectorAll('.photo-grid .photo-frame').forEach((frame) => addTilt(frame, frame, 6));
document.querySelectorAll('.bearer-card').forEach((card) => addTilt(card, card, 7));

/* ── 2. Entradas al hacer scroll ──
   Cada [data-reveal] recibe su orden dentro del grupo (--i) para escalonar la entrada. */
const revealItems = document.querySelectorAll('[data-reveal]');
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
  group.querySelectorAll('[data-reveal]').forEach((item, i) => item.style.setProperty('--i', i));
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('will-reveal');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((item) => {
    item.classList.add('will-reveal');
    observer.observe(item);
  });
}

/* ── 3. Galería · Actores ──
   Una lente sigue al cursor y revela la máscara. Con clic (o toque) la lente
   se agranda hasta cubrir toda la foto; otro clic la vuelve a su tamaño. */
document.querySelectorAll('.actor-frame').forEach((frame) => {
  const reveal = frame.querySelector('.actor-reveal');
  const lens = frame.querySelector('.actor-lens');
  const EASE = reduceMotion ? 1 : 0.25; // suavizado del seguimiento
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let radius = 0;
  let active = false;
  let full = false;
  let rafId = 0;

  const render = () => {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;

    // Radio objetivo: 24% del ancho, o toda la foto si está en modo máscara completa.
    const base = frame.offsetWidth * 0.24;
    const cover = Math.hypot(frame.offsetWidth, frame.offsetHeight) * 1.5;
    const goal = full ? cover : base;
    radius += (goal - radius) * (reduceMotion ? 1 : 0.12);

    // Coordenadas locales de la capa de máscara (compensa el scale del hover).
    const r = reveal.getBoundingClientRect();
    const scale = r.width / reveal.offsetWidth || 1;
    frame.style.setProperty('--mx', `${(current.x - r.left) / scale}px`);
    frame.style.setProperty('--my', `${(current.y - r.top) / scale}px`);
    frame.style.setProperty('--lens', `${Math.round(radius)}px`);

    // Anillo en coordenadas de la tarjeta, con el mismo tamaño visible.
    const f = frame.getBoundingClientRect();
    lens.style.setProperty('--lx', `${current.x - f.left}px`);
    lens.style.setProperty('--ly', `${current.y - f.top}px`);
    lens.style.setProperty('--lens-px', `${Math.min(radius, base) * 2 * scale}px`);

    const moving = Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3
      || Math.abs(goal - radius) > 0.5;
    rafId = active || moving ? requestAnimationFrame(render) : 0;
  };

  const start = () => { if (!rafId) rafId = requestAnimationFrame(render); };

  frame.addEventListener('pointerenter', (event) => {
    active = true;
    target = { x: event.clientX, y: event.clientY };
    if (!full) {
      current = { ...target };
      radius = frame.offsetWidth * 0.24;
    }
    frame.classList.add('is-revealing');
    start();
  });

  frame.addEventListener('pointermove', (event) => {
    if (full) return; // con la máscara completa, la foto queda quieta
    target = { x: event.clientX, y: event.clientY };
    start();
  });

  frame.addEventListener('click', (event) => {
    full = !full;
    if (!full) target = { x: event.clientX, y: event.clientY };
    frame.classList.toggle('is-full', full);
    frame.classList.add('is-revealing');
    start();
  });

  const stop = () => {
    active = false;
    if (!full) frame.classList.remove('is-revealing');
  };
  frame.addEventListener('pointerleave', stop);
  frame.addEventListener('pointercancel', stop);
});

/* ── 4. Portadores del emblema ── */
// Si la foto de un portador todavía no está en la carpeta, se quita la imagen rota
// y queda el diseño de reemplazo (telaraña + inicial).
document.querySelectorAll('.bearer-photo img').forEach((img) => {
  const drop = () => {
    img.closest('.bearer-card').classList.add('no-photo');
    img.remove();
  };
  if (img.complete && img.naturalWidth === 0) drop();
  else img.addEventListener('error', drop);
});

// Selección: una tarjeta por vez, como en una pantalla de elegir personaje.
const bearerGrid = document.querySelector('.bearer-grid');
document.querySelectorAll('.bearer-photo').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.bearer-card');
    const selecting = !card.classList.contains('is-selected');
    document.querySelectorAll('.bearer-card').forEach((other) => {
      other.classList.remove('is-selected');
      other.querySelector('.bearer-photo').setAttribute('aria-pressed', 'false');
    });
    if (selecting) {
      card.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
    }
    bearerGrid.classList.toggle('has-selection', selecting);
  });
});
