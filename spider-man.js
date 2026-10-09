/* Galería · Actores: lente que sigue al cursor y revela la máscara de cada actor. */
(() => {
  const frames = document.querySelectorAll('.actor-frame');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = reduceMotion ? 1 : 0.35; // suavizado del seguimiento

  frames.forEach((frame) => {
    const reveal = frame.querySelector('.actor-reveal');
    const lens = frame.querySelector('.actor-lens');
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let active = false;
    let rafId = 0;

    const render = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;

      // Radio de la lente proporcional al tamaño de la tarjeta.
      const radius = Math.round(frame.offsetWidth * 0.24);

      // Coordenadas locales de la capa de máscara (compensa el scale del hover).
      const r = reveal.getBoundingClientRect();
      const scale = r.width / reveal.offsetWidth || 1;
      frame.style.setProperty('--mx', `${(current.x - r.left) / scale}px`);
      frame.style.setProperty('--my', `${(current.y - r.top) / scale}px`);
      frame.style.setProperty('--lens', `${radius}px`);

      // Anillo en coordenadas de la tarjeta, con el mismo tamaño visible.
      const f = frame.getBoundingClientRect();
      lens.style.setProperty('--lx', `${current.x - f.left}px`);
      lens.style.setProperty('--ly', `${current.y - f.top}px`);
      lens.style.setProperty('--lens-px', `${radius * 2 * scale}px`);

      const moving = Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3;
      rafId = active || moving ? requestAnimationFrame(render) : 0;
    };

    const start = () => { if (!rafId) rafId = requestAnimationFrame(render); };

    frame.addEventListener('pointerenter', (e) => {
      active = true;
      target = { x: e.clientX, y: e.clientY };
      current = { ...target };
      frame.classList.add('is-revealing');
      start();
    });

    frame.addEventListener('pointermove', (e) => {
      target = { x: e.clientX, y: e.clientY };
      start();
    });

    const stop = () => {
      active = false;
      frame.classList.remove('is-revealing');
    };
    frame.addEventListener('pointerleave', stop);
    frame.addEventListener('pointercancel', stop);
  });
})();
