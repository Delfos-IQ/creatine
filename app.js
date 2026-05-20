let currentLang = 'es';
let tInterval = null;
let tSeconds = 1200;
let tRunning = false;
let wGlasses = Storage.getWater();
let history = Storage.getHistory();

const state = {
  turno: '',
  familia: '',
  activeTab: 'diario'
};

function $(id) {
  return document.getElementById(id);
}

function setBodyLang(lang) {
  document.body.className = `lang-${lang}`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.innerText = value;
}

function clearActiveTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
}

function showSection(sectionId) {
  document.querySelectorAll('.app-section').forEach(sec => (sec.style.display = 'none'));
  const sec = $(sectionId);
  if (sec) sec.style.display = 'block';
}

function cambiarIdioma(lang) {
  currentLang = lang;
  setBodyLang(lang);

  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');

  setText('app-title', APP_DATA[lang].title);
  setText('app-subtitle', APP_DATA[lang].subtitle);

  renderPlanIfExists();
  renderChecklist();
  cargarHistorial();
  renderWater();
  renderStatsTitle();
}

function cambiarPestana(tab) {
  state.activeTab = tab;
  clearActiveTabs();

  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) btn.classList.add('active');
  });

  const map = {
    diario: 'sec-diario',
    kb: 'sec-kb',
    water: 'sec-water',
    macros: 'sec-macros',
    stats: 'sec-stats'
  };

  Object.values(map).forEach(showId => {
    const sec = $(showId);
    if (sec) sec.style.display = 'none';
  });

  if (tab === 'diario') {
    showSection('sec-diario');
  } else if (tab === 'kb') {
    showSection('sec-kb');
  } else if (tab === 'water') {
    showSection('sec-water');
  } else if (tab === 'macros') {
    showSection('sec-macros');
  } else if (tab === 'stats') {
    showSection('sec-stats');
    cargarHistorial();
  }
}

function volverHome() {
  document.getElementById('planOutput').style.display = 'none';
  document.getElementById('turnoSelect').value = '';
  document.getElementById('familiaSelect').value = '';
  state.turno = '';
  state.familia = '';
  cambiarPestana('diario');
}

function buildPhaseHtml(lang, key) {
  const phase = APP_DATA[lang].phases[key];
  let html = `<div class="phase-title">${phase.title}</div><ul>`;

  phase.items.forEach(item => {
    html += `<li>${item}</li>`;
  });

  html += `</ul>`;
  return html;
}

function buildPlan(turno, familia) {
  const lang = currentLang;
  const turnoData = APP_DATA[lang].turnos[turno];
  const familiaText = APP_DATA[lang].familia[familia];
  let html = `<div class="phase-title" style="background:#edf2f7; border-left:4px solid var(--primary);">${turnoData.title}</div>`;

  if (turnoData.extra && turnoData.extra.length) {
    html += '<ul>';
    turnoData.extra.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul>';
  }

  turnoData.phases.forEach(phaseKey => {
    html += buildPhaseHtml(lang, phaseKey);
  });

  html += `<div class="phase-title" style="background:#edf2f7; border-left:4px solid var(--success); margin-top:14px;">`;
  html += lang === 'es' ? 'Situación familiar / enfoque del día' : 'Situação familiar / foco do dia';
  html += `</div><ul><li>${familiaText}</li></ul>`;

  html += `<div class="renal-warning"><strong>${lang === 'es' ? 'Aviso Médico Nefropatía IgA' : 'Aviso Médico Nefropatia IgA'}</strong><br>`;
  html += lang === 'es'
    ? 'Asegura 3L de agua totales. Prohibido usar analgésicos AINEs / Ibuprofeno para las agujetas de la kettlebell.'
    : 'Garante 3L de água diários. Proibido tomar anti-inflamatórios / Ibuprofeno devido ao treino com kettlebell.';
  html += `</div>`;

  return html;
}

function renderPlanIfExists() {
  if (!state.turno || !state.familia) return;
  const html = buildPlan(state.turno, state.familia);
  $('fasesContenido').innerHTML = html;
  $('planOutput').style.display = 'block';
}

function renderChecklist() {
  const lang = currentLang;
  const container = document.createElement('div');
  container.innerHTML = '';
  const items = APP_DATA[lang].checklist;

  const checklistHolder = document.querySelector('#planOutput');
  if (!checklistHolder) return;

  const existing = document.getElementById('checklist-dynamic');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.id = 'checklist-dynamic';

  items.forEach((item, idx) => {
    const id = `hab-${idx}`;
    wrap.innerHTML += `
      <div class="check-item">
        <input type="checkbox" class="chk-hab" id="${id}">
        <span>${item}</span>
      </div>
    `;
  });

  checklistHolder.appendChild(wrap);
}

function calcularPlanV10() {
  const turno = $('turnoSelect').value;
  const familia = $('familiaSelect').value;

  state.turno = turno;
  state.familia = familia;

  if (!turno || !familia) {
    alert(APP_DATA[currentLang].noSelection);
    return;
  }

  const html = buildPlan(turno, familia);
  $('fasesContenido').innerHTML = html;
  $('planOutput').style.display = 'block';
  renderChecklist();
}

function guardarProgresoV10() {
  const checks = document.querySelectorAll('.chk-hab');
  let completed = 0;
  checks.forEach(chk => {
    if (chk.checked) completed++;
  });

  const pct = checks.length ? Math.round((completed / checks.length) * 100) : 0;
  history.push({ p: pct, d: new Date().toISOString(), turno: state.turno, familia: state.familia });
  Storage.setHistory(history);

  alert(APP_DATA[currentLang].saveOk);
  cargarHistorial();
  volverHome();
}

function cargarHistorial() {
  history = Storage.getHistory();
  if (!history.length) {
    $('stats-display').innerText = '0%';
    return;
  }

  const sum = history.reduce((acc, curr) => acc + (curr.p || 0), 0);
  $('stats-display').innerText = `${Math.round(sum / history.length)}%`;
}

function clearStats() {
  Storage.clearHistory();
  history = [];
  $('stats-display').innerText = '0%';
}

function renderStatsTitle() {
  const title = APP_DATA[currentLang].statsLabel;
  const h3es = document.querySelector('#sec-stats h3.es');
  const h3pt = document.querySelector('#sec-stats h3.pt');
  if (h3es && h3pt) {
    h3es.innerText = currentLang === 'es' ? title : h3es.innerText;
    h3pt.innerText = currentLang === 'pt' ? title : h3pt.innerText;
  }
}

function renderWater() {
  $('water-count').innerText = `${wGlasses} / ${WATER_TARGET}`;
}

function addVaso(delta) {
  wGlasses = Math.max(0, Math.min(WATER_TARGET, wGlasses + delta));
  Storage.setWater(wGlasses);
  renderWater();
}

function clearVaso() {
  wGlasses = 0;
  Storage.clearWater();
  renderWater();
}

function toggleTimer() {
  const btn = $('btn-timer-start');

  if (tRunning) {
    clearInterval(tInterval);
    tRunning = false;
    btn.innerText = 'Play';
    btn.style.background = 'var(--success)';
    return;
  }

  tRunning = true;
  btn.innerText = 'Pause';
  btn.style.background = 'var(--accent)';

  tInterval = setInterval(() => {
    if (tSeconds <= 0) {
      clearInterval(tInterval);
      tRunning = false;
      alert(currentLang === 'es' ? 'Entrenamiento Completado!' : 'Treino Concluído!');
      resetTimer();
      return;
    }

    tSeconds--;
    const mins = Math.floor(tSeconds / 60);
    const secs = tSeconds % 60;
    $('display').innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (secs === 0) {
      document.body.style.background = '#ecc94b';
      setTimeout(() => {
        document.body.style.background = 'var(--bg-color)';
      }, 500);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(tInterval);
  tSeconds = 1200;
  tRunning = false;
  $('display').innerText = '20:00';
  $('btn-timer-start').innerText = 'Play';
  $('btn-timer-start').style.background = 'var(--success)';
}

function initEvents() {
  $('btn-es').addEventListener('click', () => cambiarIdioma('es'));
  $('btn-pt').addEventListener('click', () => cambiarIdioma('pt'));
  $('btn-home').addEventListener('click', volverHome);

  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => cambiarPestana(btn.dataset.tab));
  });

  $('calcBtn').addEventListener('click', calcularPlanV10);
  $('saveBtn').addEventListener('click', guardarProgresoV10);
  $('btn-clear-stats').addEventListener('click', clearStats);

  $('btn-water-plus').addEventListener('click', () => addVaso(1));
  $('btn-water-minus').addEventListener('click', () => addVaso(-1));
  $('btn-water-reset').addEventListener('click', clearVaso);

  $('btn-timer-start').addEventListener('click', toggleTimer);
  $('btn-timer-reset').addEventListener('click', resetTimer);

  $('turnoSelect').addEventListener('change', e => (state.turno = e.target.value));
  $('familiaSelect').addEventListener('change', e => (state.familia = e.target.value));
}

function bootstrap() {
  setBodyLang(currentLang);
  renderChecklist();
  renderWater();
  cargarHistorial();
  initEvents();
  showSection('sec-diario');
}

window.addEventListener('load', bootstrap);