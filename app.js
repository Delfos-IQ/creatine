let currentLang = 'es';
let tInterval = null;
let tSeconds = 1200;
let tRunning = false;
let wGlasses = Storage.getWater();
let history = Storage.getHistory();

const state = {
  turno: '',
  familia: ''
};

function $(id) {
  return document.getElementById(id);
}

function setBodyLang(lang) {
  document.body.className = `lang-${lang}`;
}

function updateStaticLabels() {
  $('app-title').innerText = APP_DATA[currentLang].title;
  $('app-subtitle').innerText = APP_DATA[currentLang].subtitle;
  $('btn-home').innerText = 'Home';
  $('btn-timer-start').innerText = tRunning ? 'Pause' : 'Play';
}

function showSection(sectionId) {
  document.querySelectorAll('.app-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const sec = $(sectionId);
  if (sec) sec.style.display = 'block';
}

function cambiarIdioma(lang) {
  currentLang = lang;
  setBodyLang(lang);

  $('btn-es').classList.toggle('active', lang === 'es');
  $('btn-pt').classList.toggle('active', lang === 'pt');

  updateStaticLabels();
  renderChecklist();
  renderPlanIfSelected();
  renderWater();
  cargarHistorial();
}

function cambiarPestana(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    if (btn.dataset.tab === tab) btn.classList.add('active');
  });

  if (tab === 'diario') showSection('sec-diario');
  if (tab === 'kb') showSection('sec-kb');
  if (tab === 'water') showSection('sec-water');
  if (tab === 'macros') showSection('sec-macros');
  if (tab === 'stats') {
    showSection('sec-stats');
    cargarHistorial();
  }
}

function volverHome() {
  $('planOutput').style.display = 'none';
  $('turnoSelect').value = '';
  $('familiaSelect').value = '';
  state.turno = '';
  state.familia = '';
  cambiarPestana('diario');
}

function phaseHtml(phaseKey) {
  const phase = APP_DATA[currentLang].phases[phaseKey];
  let html = `<div class="phase-title">${phase.title}</div><ul>`;
  phase.items.forEach(item => {
    html += `<li>${item}</li>`;
  });
  html += '</ul>';
  return html;
}

function buildPlan(turno, familia) {
  const turnoData = APP_DATA[currentLang].turnos[turno];
  const familiaText = APP_DATA[currentLang].familia[familia];

  let html = `<div class="phase-title" style="background:#edf2f7; border-left:4px solid var(--primary);">${turnoData.title}</div>`;

  if (turnoData.extra.length) {
    html += '<ul>';
    turnoData.extra.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul>';
  }

  turnoData.phases.forEach(key => {
    html += phaseHtml(key);
  });

  html += `<div class="phase-title" style="background:#edf2f7; border-left:4px solid var(--success); margin-top:14px;">`;
  html += currentLang === 'es' ? 'Situación familiar y foco del día' : 'Situação familiar e foco do dia';
  html += `</div><ul><li>${familiaText}</li></ul>`;

  html += `<div class="renal-warning"><strong>${currentLang === 'es' ? 'Aviso Médico Nefropatía IgA' : 'Aviso Médico Nefropatia IgA'}</strong><br>`;
  html += currentLang === 'es'
    ? 'Asegura 3L de agua totales. Prohibido usar AINEs / Ibuprofeno para las agujetas de la kettlebell.'
    : 'Garante 3L de água diários. Proibido usar anti-inflamatórios / Ibuprofeno devido ao treino com kettlebell.';
  html += `</div>`;

  return html;
}

function renderPlanIfSelected() {
  if (!state.turno || !state.familia) return;
  $('fasesContenido').innerHTML = buildPlan(state.turno, state.familia);
  $('planOutput').style.display = 'block';
}

function renderChecklist() {
  const container = $('checklistContainer');
  if (!container) return;

  container.innerHTML = '';
  APP_DATA[currentLang].checklist.forEach((item, idx) => {
    container.innerHTML += `
      <div class="check-item">
        <input type="checkbox" class="chk-hab" id="chk-${idx}">
        <span>${item}</span>
      </div>
    `;
  });
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

  $('fasesContenido').innerHTML = buildPlan(turno, familia);
  $('planOutput').style.display = 'block';
  renderChecklist();
  $('planOutput').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function guardarProgresoV10() {
  const checks = document.querySelectorAll('.chk-hab');
  let done = 0;
  checks.forEach(chk => {
    if (chk.checked) done++;
  });

  const pct = checks.length ? Math.round((done / checks.length) * 100) : 0;
  history.push({
    p: pct,
    d: new Date().toISOString(),
    turno: state.turno,
    familia: state.familia
  });
  Storage.setHistory(history);

  alert(APP_DATA[currentLang].saveOk);
  cargarHistorial();
}

function cargarHistorial() {
  history = Storage.getHistory();
  if (!history.length) {
    $('stats-display').innerText = '0%';
    return;
  }

  const avg = history.reduce((sum, item) => sum + (item.p || 0), 0) / history.length;
  $('stats-display').innerText = `${Math.round(avg)}%`;
}

function clearStats() {
  Storage.clearHistory();
  history = [];
  $('stats-display').innerText = '0%';
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
      alert(currentLang === 'es' ? 'Entrenamiento completado!' : 'Treino concluído!');
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

function bindEvents() {
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

  $('turnoSelect').addEventListener('change', e => {
    state.turno = e.target.value;
  });

  $('familiaSelect').addEventListener('change', e => {
    state.familia = e.target.value;
  });
}

function init() {
  setBodyLang(currentLang);
  updateStaticLabels();
  renderChecklist();
  renderWater();
  cargarHistorial();
  bindEvents();
  showSection('sec-diario');
}

window.addEventListener('load', init);