/* ==========================================================
   ACADEMIA ROBO-B · Lógica de la interfaz
   1. Datos (editables)  2. Robo-B (SVG)  3. Utilidades
   4. Renderizado  5. Navegación  6. Eventos
   ========================================================== */

/* 1. DATOS DE EJEMPLO (modifica aquí mundos, misiones y recompensas) */
const DATA = {
  worlds: [
    {
      name: 'Laboratorio de Patrones', emoji: '🧪', color: '#cfe6ff', unlocked: true,
      desc: 'Aprende a ordenar y descubrir patrones.',
      missions: [
        { name: '¡Ordenemos juntos!',      emoji: '🧩', color: '#e3d6ff', stars: 3, unlocked: true },
        { name: 'Encuentra el camino',     emoji: '🧭', color: '#cff5e5', stars: 2, unlocked: true },
        { name: '¿Qué va primero?',        emoji: '🔢', color: '#fff1b8', stars: 0, unlocked: true },
        { name: '¡Dale instrucciones a Robo-B!', emoji: '🎮', color: '#ffe0d1', stars: 0, unlocked: false },
        { name: '¡El gran desafío!',       emoji: '🏆', color: '#cfe6ff', stars: 0, unlocked: false }
      ]
    },
    { name: 'Bosque de Caminos',      emoji: '🌳', color: '#cff5e5', unlocked: false, desc: 'Mapas, rutas y laberintos.', missions: [] },
    { name: 'Ciudad de Instrucciones', emoji: '🏙️', color: '#ffe0d1', unlocked: false, desc: 'Da órdenes paso a paso.',   missions: [] },
    { name: 'Planeta Desafío',         emoji: '🪐', color: '#e3d6ff', unlocked: false, desc: 'Retos para campeones.',     missions: [] }
  ],
  badges: [
    { name: 'Primer paso', emoji: '🚀', need: 1 },
    { name: 'Explorador',  emoji: '🧭', need: 3 },
    { name: 'Ordenador',   emoji: '🧩', need: 5 },
    { name: 'Constructor', emoji: '🧱', need: 8 },
    { name: 'Detective',   emoji: '🔍', need: 12 },
    { name: 'Campeón',     emoji: '🏆', need: 15 }
  ],
  levels: [
    { name: 'Aprendiz', from: 0 },
    { name: 'Explorador', from: 3 },
    { name: 'Experto', from: 8 },
    { name: 'Maestro', from: 15 }
  ],
  phrases: [
    '¡Hola! Soy Robo-B. ¡Vamos a jugar!',
    '¿Listo para una aventura?',
    '¡Los robots aprendemos con instrucciones!',
    '¡Tú puedes, explorador!'
  ]
};

/* 2. ROBO-B (imagen propia; la misma para todas las expresiones) */
const SCRIPT_URL = document.currentScript ? document.currentScript.src : location.href;
const ROBO_IMG = new URL('/assets/imagenes/robo-holaaa.gif', SCRIPT_URL).href;

function robo(mood = 'happy') {
  return `<img src="${ROBO_IMG}" alt="Robo-B">`;
}

/* 3. UTILIDADES */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const state = { view: 'aventuras', world: 0, phrase: 0 };
const worldStars = w => w.missions.reduce((a, m) => a + m.stars, 0);
const totalStars = () => DATA.worlds.reduce((a, w) => a + worldStars(w), 0);
const starsText  = n => '⭐'.repeat(n) + '☆'.repeat(3 - n);
let sayTimer;

function say(text, mood = 'happy') {
  $('#bubble').textContent = text;
  $('#robo').innerHTML = robo(mood);
  clearTimeout(sayTimer);
  if (mood !== 'happy') sayTimer = setTimeout(() => { $('#robo').innerHTML = robo('happy'); }, 2400);
}

/* 4. RENDERIZADO */
function renderWorlds() {
  $('#worlds').innerHTML = DATA.worlds.map((w, i) => `
    <article class="world ${w.unlocked ? '' : 'locked'}" data-i="${i}" style="--c:${w.color}">
      <div class="art"><span>${w.emoji}</span>${w.unlocked ? '' : '<b class="lock">🔒</b>'}</div>
      <div class="w-body">
        <h3>${w.name}</h3><p>${w.desc}</p>
        <div class="w-foot">
          <span>${w.unlocked ? '⭐ ' + worldStars(w) + '/' + w.missions.length * 3 : 'Muy pronto'}</span>
          ${w.unlocked ? `<button class="btn btn-go" data-enter="${i}">Entrar</button>` : ''}
        </div>
      </div>
    </article>`).join('');
}

function renderMissions() {
  const w = DATA.worlds[state.world];
  $('#missionsTitle').textContent = w.name;
  $('#missions').innerHTML = w.missions.map((m, i) => `
    <div class="mission ${m.unlocked ? '' : 'locked'}" style="--c:${m.color}">
      <div class="m-art">${m.emoji}</div>
      <div class="m-info"><b>${m.name}</b><span class="m-stars">${m.unlocked ? starsText(m.stars) : '🔒'}</span></div>
      ${m.unlocked ? `<button class="btn btn-go" data-play="${i}">¡Jugar!</button>` : '<span class="m-lock">Bloqueada</span>'}
    </div>`).join('');
}

function renderProgress() {
  const t = totalStars(), max = DATA.worlds.reduce((a, w) => a + w.missions.length * 3, 0);
  const lv = [...DATA.levels].reverse().find(l => t >= l.from);
  const next = DATA.levels.find(l => l.from > t);
  $('#pStars').textContent = t;
  $('#pLevel').textContent = lv.name;
  $('#pBar').style.width = Math.min(100, t / max * 100) + '%';
  $('#pNext').textContent = next ? `Te faltan ${next.from - t} estrellas para ser ${next.name}.` : '¡Llegaste al nivel máximo!';
  $('#badges').innerHTML = DATA.badges.map((b, i) => `
    <button class="badge ${t >= b.need ? '' : 'off'}" data-badge="${i}"><i>${b.emoji}</i>${b.name}</button>`).join('');
  $('#starTotal').textContent = t;
}

/* 5. NAVEGACIÓN */
const VIEW_MSG = {
  aventuras: '¡Elige un mundo para explorar!',
  misiones:  '¡Cada misión te da hasta 3 estrellas!',
  progreso:  '¡Mira cuántas estrellas has ganado!'
};
function setView(v) {
  state.view = v;
  $$('.view').forEach(el => el.classList.toggle('is-on', el.id === 'view-' + v));
  $$('.menu-btn').forEach(b => {
    const on = b.dataset.view === v;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on);
  });
  say(VIEW_MSG[v], 'think');
}

/* Zonas de la ciudad (menú principal) */
DATA.zones = [
  { name: 'Centro de Patrones',          msg: '¡Aquí descubrimos patrones y ordenamos cosas!' },
  { name: 'Laboratorio de Rompecabezas', msg: '¡Piezas, colores y mucho ingenio!' },
  { name: 'Ciudad Laberinto',            msg: '¡Ayúdame a encontrar el camino!' },
  { name: 'Torre de los Desafíos',       msg: '¡Los retos más grandes de la academia!' }
];

/* 6. EVENTOS (el mismo script sirve para index.html y menu.html) */
const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };

function selectZone(i) {
  state.zone = i;
  $$('.bld').forEach(b => b.classList.toggle('sel', +b.dataset.z === i));
  say(`${DATA.zones[i].name}: ${DATA.zones[i].msg}`, 'cheer');
}

document.addEventListener('DOMContentLoaded', () => {
  $$('.robo-slot[data-robo]').forEach(el => { el.innerHTML = robo(el.dataset.robo); });

  /* Página de bienvenida: el botón lleva al menú */
  on('#startBtn', 'click', () => { window.location.href = 'menu.html'; });

  /* Página del menú */
  if (!$('#hub')) return;
  if ($('#worlds')) { renderWorlds(); renderMissions(); }
  renderProgress();
  say('¡Bienvenido a mi ciudad! Toca un edificio para descubrir su misión.', 'cheer');

  $$('.menu-btn').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  on('#roboBtn', 'click', () => {
    state.phrase = (state.phrase + 1) % DATA.phrases.length;
    say(DATA.phrases[state.phrase], 'cheer');
  });

  /* Edificios de la ciudad */
  $$('.bld').forEach(b => {
    b.addEventListener('click', () => selectZone(+b.dataset.z));
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectZone(+b.dataset.z); } });
  });
  on('#playBtn', 'click', () => {
    if (state.zone == null) { say('¡Elige un edificio de la ciudad para empezar!', 'think'); return; }
    $('#missionName').textContent = DATA.zones[state.zone].name;
    $('#missionScreen').hidden = false;
  });
  /* Volver al menú principal: cierra la pantalla de misión y regresa a la ciudad */
  on('#backBtn', 'click', e => {
    e.preventDefault();
    $('#missionScreen').hidden = true;
    say('¡De vuelta en la ciudad! ¿Qué edificio exploramos ahora?', 'cheer');
  });

  /* Vistas anteriores (mundos, misiones, recompensas) */
  on('#worlds', 'click', e => {
    const enter = e.target.closest('[data-enter]');
    if (enter) { state.world = +enter.dataset.enter; renderMissions(); setView('misiones'); return; }
    if (e.target.closest('.world.locked')) say('¡Ese mundo todavía está dormido! Gana más estrellas para despertarlo.', 'oops');
  });
  on('#missions', 'click', e => {
    if (e.target.closest('[data-play]')) say('¡Esta misión estará lista muy pronto! Prepárate, explorador.', 'cheer');
  });
  on('#badges', 'click', e => {
    const b = e.target.closest('[data-badge]');
    if (!b) return;
    const badge = DATA.badges[+b.dataset.badge];
    const got = totalStars() >= badge.need;
    say(got ? `¡Ganaste la insignia «${badge.name}»!` : `Consigue ${badge.need} estrellas para ganar «${badge.name}».`, got ? 'cheer' : 'think');
  });
});