/* ============================================================
   ICONS ARCHIVE — Selector de héroes (index.html)
   Cada héroe tiene su color (tone): toda la página se tiñe con él.
   page: la página del expediente, o null si todavía no existe.
   ============================================================ */
const heroes = [
  { name: 'SPIDER-MAN', universe: 'FRIENDLY NEIGHBORHOOD', publisher: 'MARVEL', logo: 'img/5ec273a36c295800046c81e4.webp', tone: '#e62429', alt: 'Símbolo de Spider-Man', page: 'spider-man.html' },
  { name: 'GREEN LANTERN', universe: 'IN BRIGHTEST DAY', publisher: 'DC', logo: 'img/Green-Lantern-Logo-PNG-HD.webp', tone: '#2ee678', alt: 'Símbolo de Green Lantern', page: 'green-lantern.html' },
  { name: 'BATMAN', universe: 'THE DARK KNIGHT', publisher: 'DC', logo: 'img/Batman-movie-Logo-2005.webp', tone: '#c3cedb', alt: 'Símbolo de Batman', page: null },
  { name: 'SUPERMAN', universe: 'MAN OF TOMORROW', publisher: 'DC', logo: 'img/simple-red-superman-logo-png-13.webp', tone: '#3d7bff', alt: 'Símbolo de Superman', page: null },
  { name: 'HULK', universe: 'STRONGEST THERE IS', publisher: 'MARVEL', logo: 'img/Hulk-Logo-PNG-Picture.png', tone: '#8fd14f', alt: 'Símbolo de Hulk', page: null },
  { name: 'IRON MAN', universe: 'GENIUS. BILLIONAIRE. HERO.', publisher: 'MARVEL', logo: 'img/iron-man-head-logo-graphic-5365rvzihxgtignv.webp', tone: '#f0a63a', alt: 'Símbolo de Iron Man', page: null },
  { name: 'WONDER WOMAN', universe: 'WARRIOR OF THE AMAZONS', publisher: 'DC', logo: 'img/Wonder-Woman-Logo-PNG-Picture.webp', tone: '#e5b958', alt: 'Símbolo de Wonder Woman', page: null },
  { name: 'CAPTAIN AMERICA', universe: 'THE FIRST AVENGER', publisher: 'MARVEL', logo: 'img/captain-america-logo-27.webp', tone: '#5d9dd3', alt: 'Símbolo de Captain America', page: null }
];

let current = 0;
const $ = selector => document.querySelector(selector);
const stage = $('#heroStage');
const logo = $('#heroLogo');
const name = $('#heroName');
const universe = $('#heroUniverse');
const publisher = $('#heroPublisher');
const file = $('#heroFile');
const watermark = $('#heroWatermark');
const count = $('#stageCount');
const explore = $('#exploreButton');
const exploreLabel = $('#exploreLabel');
const roster = $('#roster');

// Fichas del roster: una por héroe
heroes.forEach((hero, index) => {
  const button = document.createElement('button');
  button.className = 'roster-item';
  button.type = 'button';
  button.dataset.name = hero.name;
  button.style.setProperty('--chip-tone', hero.tone);
  button.setAttribute('aria-label', 'Seleccionar ' + hero.name);
  button.innerHTML = '<img src="' + hero.logo + '" alt="" aria-hidden="true">';
  button.addEventListener('click', () => selectHero(index));
  roster.append(button);
});

// Vuelca los datos del héroe actual en la página
function render() {
  const hero = heroes[current];
  const number = String(current + 1).padStart(2, '0');
  document.documentElement.style.setProperty('--tone', hero.tone);
  logo.src = hero.logo;
  logo.alt = hero.alt;
  name.textContent = hero.name;
  watermark.textContent = hero.name;
  universe.textContent = hero.universe;
  publisher.textContent = hero.publisher;
  file.textContent = 'EXPEDIENTE 0' + number;
  count.innerHTML = number + ' <i>/ 08</i>';

  // Si el expediente todavía no existe, el botón se bloquea
  if (hero.page) {
    explore.href = hero.page;
    explore.classList.remove('is-locked');
    explore.removeAttribute('aria-disabled');
    explore.setAttribute('aria-label', 'Abrir el expediente de ' + hero.name);
    exploreLabel.textContent = 'ABRIR EXPEDIENTE';
  } else {
    explore.removeAttribute('href');
    explore.classList.add('is-locked');
    explore.setAttribute('aria-disabled', 'true');
    explore.setAttribute('aria-label', 'El expediente de ' + hero.name + ' está en preparación');
    exploreLabel.textContent = 'EN PREPARACIÓN';
  }

  document.querySelectorAll('.roster-item').forEach((item, i) => {
    item.classList.toggle('active', i === current);
    item.setAttribute('aria-pressed', String(i === current));
  });
}

function selectHero(index) {
  const next = (index + heroes.length) % heroes.length;
  if (next === current) return;
  current = next;
  stage.classList.remove('arrive');
  stage.classList.add('switching');
  watermark.classList.add('switching');
  window.setTimeout(() => {
    render();
    stage.classList.remove('switching');
    watermark.classList.remove('switching');
    stage.classList.add('arrive');
    window.setTimeout(() => stage.classList.remove('arrive'), 600);
  }, 180);
}

$('#previous').addEventListener('click', () => selectHero(current - 1));
$('#next').addEventListener('click', () => selectHero(current + 1));
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') selectHero(current - 1);
  if (event.key === 'ArrowRight') selectHero(current + 1);
});

// Deslizar en celulares
let touchStartX = null;
stage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) selectHero(current + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

// Primer render y animación de entrada
render();
window.setTimeout(() => {
  stage.classList.add('arrive');
  window.setTimeout(() => stage.classList.remove('arrive'), 700);
}, 80);
