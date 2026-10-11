/* ============================================================
   GREEN LANTERN — interacciones de la página
   1. Línea de tiempo horizontal de Hal Jordan (flechas + progreso)
   2. Animación de entrada y efecto 3D de "Linternas de la Tierra"
   ============================================================ */

/* ── 1. Línea de tiempo de Hal Jordan ── */
const timeline = document.querySelector('#halTimeline');
const prevBtn = document.querySelector('#halPrev');
const nextBtn = document.querySelector('#halNext');
const progress = document.querySelector('#halProgress');

if (timeline) {
  // Cada año recibe su número para escalonar el pulso de luz del riel
  timeline.querySelectorAll('.timeline-item').forEach((item, i) => item.style.setProperty('--i', i));

  // Distancia de un paso: el ancho de una tarjeta más el espacio entre tarjetas
  const step = () => {
    const item = timeline.querySelector('.timeline-item');
    const gap = parseFloat(getComputedStyle(timeline).columnGap) || 0;
    return item ? item.offsetWidth + gap : 300;
  };

  const update = () => {
    const max = timeline.scrollWidth - timeline.clientWidth;
    const ratio = max > 0 ? timeline.scrollLeft / max : 1;
    progress.style.width = Math.max(ratio * 100, 8) + '%';
    prevBtn.disabled = timeline.scrollLeft <= 2;
    nextBtn.disabled = timeline.scrollLeft >= max - 2;
    timeline.parentElement.classList.toggle('is-start', prevBtn.disabled);
    timeline.parentElement.classList.toggle('is-end', nextBtn.disabled);
  };

  prevBtn.addEventListener('click', () => timeline.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => timeline.scrollBy({ left: step(), behavior: 'smooth' }));
  timeline.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  // Con el foco en la línea, las flechas del teclado la recorren
  timeline.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); nextBtn.click(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); prevBtn.click(); }
  });

  update();
}

/* ── 2. Linternas de la Tierra ── */
const cards = document.querySelectorAll('.lantern-card');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  // Las tarjetas de una misma fila entran escalonadas
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.style.setProperty('--i', order++);
      card.classList.remove('will-reveal');
      card.classList.add('is-visible');
      card.addEventListener('animationend', function done(event) {
        if (event.target !== card) return;
        card.classList.add('is-done');
        card.removeEventListener('animationend', done);
      });
      observer.unobserve(card);
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.add('will-reveal');
    observer.observe(card);
  });
}

// Inclinación 3D: la tarjeta sigue al mouse
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  cards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
