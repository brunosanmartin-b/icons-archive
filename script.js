const heroes = [
  { name: 'SPIDER-MAN', universe: 'FRIENDLY NEIGHBORHOOD', logo: 'img/5ec273a36c295800046c81e4.webp', tone: '#e8474c', alt: 'Símbolo de Spider-Man' },
  { name: 'GREEN LANTERN', universe: 'IN BRIGHTEST DAY', logo: 'img/Green-Lantern-Logo-PNG-HD.webp', tone: '#48c982', alt: 'Símbolo de Green Lantern' },
  { name: 'BATMAN', universe: 'THE DARK KNIGHT', logo: 'img/Batman-movie-Logo-2005.webp', tone: '#b9c4d1', alt: 'Símbolo de Batman' },
  { name: 'SUPERMAN', universe: 'MAN OF TOMORROW', logo: 'img/simple-red-superman-logo-png-13.webp', tone: '#df424b', alt: 'Símbolo de Superman' },
  { name: 'HULK', universe: 'STRONGEST THERE IS', logo: 'img/Hulk-Logo-PNG-Picture.png', tone: '#78c951', alt: 'Símbolo de Hulk' },
  { name: 'IRON MAN', universe: 'GENIUS. BILLIONAIRE. HERO.', logo: 'img/iron-man-head-logo-graphic-5365rvzihxgtignv.webp', tone: '#eaa24d', alt: 'Símbolo de Iron Man' },
  { name: 'WONDER WOMAN', universe: 'WARRIOR OF THE AMAZONS', logo: 'img/Wonder-Woman-Logo-PNG-Picture.webp', tone: '#e5b86c', alt: 'Símbolo de Wonder Woman' },
  { name: 'CAPTAIN AMERICA', universe: 'THE FIRST AVENGER', logo: 'img/captain-america-logo-27.webp', tone: '#5d9dd3', alt: 'Símbolo de Captain America' }
];
let current = 0;
const stage = document.querySelector('#heroStage');
const logo = document.querySelector('#heroLogo');
const name = document.querySelector('#heroName');
const universe = document.querySelector('#heroUniverse');
const count = document.querySelector('#stageCount');
const explore = document.querySelector('#exploreButton');
const roster = document.querySelector('#roster');
const ambientLeft = document.querySelector('#ambientLeft');
const ambientRight = document.querySelector('#ambientRight');
heroes.forEach((hero, index) => {
  const button = document.createElement('button');
  button.className = 'roster-item'; button.type = 'button';
  button.dataset.index = String(index + 1).padStart(2, '0');
  button.setAttribute('aria-label', 'Seleccionar ' + hero.name);
  button.innerHTML = '<img src="' + hero.logo + '" alt="" aria-hidden="true">';
  button.addEventListener('click', () => selectHero(index));
  roster.append(button);
});
function selectHero(index) {
  if (index === current) return;
  current = (index + heroes.length) % heroes.length;
  stage.classList.remove('arrive'); stage.classList.add('switching');
  window.setTimeout(() => {
    const hero = heroes[current];
    ambientLeft.src = heroes[(current + heroes.length - 1) % heroes.length].logo;
    ambientRight.src = heroes[(current + 1) % heroes.length].logo;
    document.documentElement.style.setProperty('--tone', hero.tone);
    logo.src = hero.logo; logo.alt = hero.alt;
    name.textContent = hero.name; universe.textContent = hero.universe;
    count.innerHTML = String(current + 1).padStart(2, '0') + ' <i>/ 08</i>';
    explore.setAttribute('aria-label', 'Explorar ' + hero.name);
    explore.href = current === 0 ? 'spider-man.html' : current === 1 ? 'green-lantern.html' : '#explorar';
    document.querySelectorAll('.roster-item').forEach((item, i) => {
      item.classList.toggle('active', i === current);
      item.setAttribute('aria-pressed', String(i === current));
    });
    stage.classList.remove('switching'); stage.classList.add('arrive');
    window.setTimeout(() => stage.classList.remove('arrive'), 500);
  }, 170);
}
document.querySelector('#previous').addEventListener('click', () => selectHero(current - 1));
document.querySelector('#next').addEventListener('click', () => selectHero(current + 1));
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') selectHero(current - 1);
  if (event.key === 'ArrowRight') selectHero(current + 1);
});
document.querySelectorAll('.roster-item').forEach((item, i) => {
  item.classList.toggle('active', i === current);
  item.setAttribute('aria-pressed', String(i === current));
});

// Trigger entry animation for first hero on load
window.setTimeout(() => {
  stage.classList.add('arrive');
  window.setTimeout(() => stage.classList.remove('arrive'), 600);
}, 80);
let touchStartX = null;
stage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) selectHero(current + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });
