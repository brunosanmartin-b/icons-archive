/* ============================================================
   BATMAN — interacciones de la página
   1. Luz que revela a Batman camuflado en el hero
   2. Murciélagos (bandada inicial + vuelos sueltos)
   3. Entradas al hacer scroll ([data-reveal])
   4. Tarjetas de los Robins: inclinación 3D
   5. Menú de secciones (ScrollSpy de Bootstrap)
   ============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* ── 1. Luz sobre Batman ──
   Sin mouse, un reflector recorre la imagen solo (animación CSS "searchlight").
   Con el mouse encima del hero, la luz sigue al cursor (--sx / --sy). */
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');

if (hero && heroArt && canHover && !reduceMotion) {
  hero.addEventListener('pointermove', (event) => {
    const box = heroArt.getBoundingClientRect();
    heroArt.style.setProperty('--sx', `${event.clientX - box.left}px`);
    heroArt.style.setProperty('--sy', `${event.clientY - box.top}px`);
    hero.classList.add('is-tracking');
  });
  hero.addEventListener('pointerleave', () => {
    hero.classList.remove('is-tracking');
    heroArt.style.removeProperty('--sx');
    heroArt.style.removeProperty('--sy');
  });
}

/* ── 2. Murciélagos ──
   Cada murciélago es un SVG con dos alas (aletean con CSS) y un cuerpo.
   El vuelo usa la Web Animations API: sale de un punto, cruza el cielo
   ondulando y se elimina al terminar. */
const BAT_SVG = `
  <svg viewBox="0 0 100 50" aria-hidden="true" focusable="false">
    <g class="wing wing-l"><path d="M50 22 C42 10 26 6 2 13 C10 17 12 23 10 30 C16 26 22 27 24 33 C28 27 34 27 37 33 C40 27 45 27 50 31 Z"/></g>
    <g class="wing wing-r"><path transform="matrix(-1 0 0 1 100 0)" d="M50 22 C42 10 26 6 2 13 C10 17 12 23 10 30 C16 26 22 27 24 33 C28 27 34 27 37 33 C40 27 45 27 50 31 Z"/></g>
    <path d="M45.5 21 L46.5 12 L49 18 L51 18 L53.5 12 L54.5 21 C55 27 53.5 33 50 37 C46.5 33 45 27 45.5 21 Z"/>
  </svg>`;

const random = (min, max) => min + Math.random() * (max - min);

// Crea un murciélago y lo hace volar de (x0, y0) a (x1, y1), en píxeles del contenedor
function launchBat(sky, { x0, y0, x1, y1, size, duration, delay = 0 }) {
  const bat = document.createElement('span');
  bat.className = 'bat';
  bat.innerHTML = BAT_SVG;
  bat.style.setProperty('--size', `${size}px`);
  bat.style.setProperty('--flap', `${random(0.16, 0.3).toFixed(2)}s`);
  sky.append(bat);

  // Escala según la distancia: los chicos están lejos, más tenues
  const depth = size / 48;
  const wobble = random(20, 60) * (Math.random() < 0.5 ? -1 : 1);
  const tilt = Math.atan2(y1 - y0, x1 - x0) * 0.25; // leve inclinación hacia donde vuela
  const keyframes = [0, 0.25, 0.5, 0.75, 1].map((t, i) => ({
    transform: `translate(${x0 + (x1 - x0) * t}px, ${y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 2) * wobble}px)
                rotate(${tilt + Math.sin(t * Math.PI * 3) * 0.12}rad)
                scale(${(i === 0 ? 0.3 : 1).toFixed(2)})`,
    opacity: i === 0 ? 0 : i === 4 ? 0 : Math.min(1, 0.45 + depth * 0.6)
  }));

  const flight = bat.animate(keyframes, { duration, delay, easing: 'ease-in-out', fill: 'both' });
  flight.onfinish = () => bat.remove();
  flight.oncancel = () => bat.remove();
}

// Bandada: muchos murciélagos que salen juntos desde un punto y se dispersan
function swarm(sky, originX, originY, count) {
  const { width, height } = sky.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const angle = random(-Math.PI * 0.95, -Math.PI * 0.05) + (Math.random() < 0.3 ? Math.PI : 0);
    const distance = Math.max(width, height) * random(0.55, 0.95);
    launchBat(sky, {
      x0: originX + random(-40, 40),
      y0: originY + random(-40, 40),
      x1: originX + Math.cos(angle) * distance,
      y1: originY + Math.sin(angle) * distance,
      size: random(22, 64),
      duration: random(4500, 7500),
      delay: random(0, 1400)
    });
  }
}

// Un murciélago suelto que cruza el cielo de un costado al otro
function crossing(sky) {
  const { width, height } = sky.getBoundingClientRect();
  const leftToRight = Math.random() < 0.5;
  const margin = 80;
  launchBat(sky, {
    x0: leftToRight ? -margin : width + margin,
    y0: random(height * 0.08, height * 0.6),
    x1: leftToRight ? width + margin : -margin,
    y1: random(height * 0.05, height * 0.7),
    size: random(20, 48),
    duration: random(6000, 10000)
  });
}

// Activa un cielo: bandada al aparecer en pantalla y vuelos sueltos mientras se ve
function setupSky(sky, { origin, swarmSize, every }) {
  let timer = 0;
  let firstTime = true;

  const start = () => {
    if (timer) return;
    if (firstTime) {
      const { width, height } = sky.getBoundingClientRect();
      swarm(sky, width * origin[0], height * origin[1], swarmSize);
      firstTime = false;
    }
    timer = window.setInterval(() => {
      if (!document.hidden) crossing(sky);
    }, every);
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  // Solo vuelan mientras el cielo está en pantalla
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
  }, { threshold: 0.15 }).observe(sky);
}

if (!reduceMotion && 'IntersectionObserver' in window && Element.prototype.animate) {
  const heroSky = document.querySelector('[data-bats="hero"]');
  const signalSky = document.querySelector('[data-bats="signal"]');
  // En el hero, la bandada sale de Batman; en la nota final, de la Batiseñal
  // El origen de la bandada es el centro de la imagen de Batman (cambia según la pantalla)
  let heroOrigin = [0.78, 0.45];
  if (heroSky && heroArt) {
    const sky = heroSky.getBoundingClientRect();
    const art = heroArt.getBoundingClientRect();
    heroOrigin = [(art.left + art.width / 2 - sky.left) / sky.width, (art.top + art.height / 2 - sky.top) / sky.height];
  }
  if (heroSky) setupSky(heroSky, { origin: heroOrigin, swarmSize: 26, every: 1800 });
  if (signalSky) setupSky(signalSky, { origin: [0.5, 0.2], swarmSize: 14, every: 2600 });
}

/* ── 3. Entradas al hacer scroll ──
   Cada [data-reveal] recibe su orden dentro del grupo (--i) para escalonar la entrada.
   Las fotos de los Robins arrancan en sombras y se encienden con .is-visible. */
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
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((item) => {
    item.classList.add('will-reveal');
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ── 4. Tarjetas de los Robins: inclinación 3D ──
   Mientras el mouse está encima, la tarjeta se inclina hacia él (--rx / --ry). */
if (canHover && !reduceMotion) {
  document.querySelectorAll('.robin-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ── 5. Menú de secciones ──
   El ScrollSpy de Bootstrap marca el enlace de la sección visible; acá se
   agrega aria-current para que los lectores de pantalla también lo anuncien. */
document.body.addEventListener('activate.bs.scrollspy', (event) => {
  document.querySelectorAll('.section-nav a').forEach((link) => {
    if (link === event.relatedTarget) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
});
