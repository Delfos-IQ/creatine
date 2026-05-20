const state = {
  lang: localStorage.getItem('mtn-lang') || 'es',
  water: Number(localStorage.getItem('mtn-water') || 0),
  history: JSON.parse(localStorage.getItem('mtn-history') || '[]'),
  tab: 'diario'
};

const t = {
  es: {
    title: 'CronoFuerza MTN',
    subtitle: 'Control de Glucemia, Estrés e Hipertrofia',
    dailyTitle: 'Plan del día',
    calc: 'Calcular',
    save: 'Guardar progreso',
    water: 'Agua',
    history: 'Historial'
  },
  pt: {
    title: 'CronoFora MTN',
    subtitle: 'Controlo de Glicemia, Stress e Hipertrofia',
    dailyTitle: 'Plano do dia',
    calc: 'Calcular',
    save: 'Guardar progresso',
    water: 'Água',
    history: 'Histórico'
  }
};

const $ = s => document.querySelector(s);
const tabs = ['diario', 'kb', 'water', 'macros', 'stats'];

function renderShell() {
  $('#app-title').textContent = t[state.lang].title;
  $('#app-subtitle').textContent = t[state.lang].subtitle;
  document.documentElement.lang = state.lang;
  document.documentElement.dataset.lang = state.lang;

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === state.lang);
  });

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === state.tab);
  });

  tabs.forEach(tab => {
    $(`#sec-${tab}`).classList.toggle('hidden', tab !== state.tab);
  });
}

function renderDaily() {
  $('#sec-diario').innerHTML = `
    <div class="row">
      <div class="card">
        <p class="title">${t[state.lang].dailyTitle}</p>
        <select id="turno" class="select">
          <option value="">--</option>
          <option value="M">M</option>
          <option value="T">T</option>
          <option value="ENTRAN">ENTRAN</option>
          <option value="SALIENTE">SALIENTE</option>
        </select>
        <div style="height:8px"></div>
        <select id="familia" class="select">
          <option value="">--</option>
          <option value="APOYO">APOYO</option>
          <option value="SOLOCOLE">SOLOCOLE</option>
        </select>
        <div style="height:8px"></div>
        <button class="btn btn-primary" id="calcBtn">${t[state.lang].calc}</button>
      </div>

      <div class="card" id="planBox">
        <div class="muted">Sin plan generado.</div>
      </div>

      <div class="card">
        <button class="btn btn-success" id="saveBtn">${t[state.lang].save}</button>
      </div>
    </div>`;

  $('#calcBtn').addEventListener('click', () => {
    const turno = $('#turno').value;
    const familia = $('#familia').value;

    $('#planBox').innerHTML = `
      <div class="title">FASE 1</div>
      <ul class="list">
        <li>Losartán 50mg</li>
        <li>Creatina 3g</li>
      </ul>
      <div class="title">FASE 2</div>
      <ul class="list">
        <li>Powernap 20 min</li>
        <li>Bloque Kettlebell 10-15 min</li>
      </ul>
      <div class="title">FASE 3</div>
      <ul class="list">
        <li>Hidratación 3L</li>
        <li>Priorizar proteína</li>
      </ul>
      <p class="muted">Turno: ${turno || '-'} · Familia: ${familia || '-'}</p>
    `;
  });

  $('#saveBtn').onclick = () => {
    state.history.push({ p: 100, d: Date.now() });
    localStorage.setItem('mtn-history', JSON.stringify(state.history));
    alert(state.lang === 'es' ? 'Progreso guardado' : 'Progresso guardado');
  };
}

function renderWater() {
  $('#sec-water').innerHTML = `
    <div class="card">
      <p class="title">${t[state.lang].water}</p>
      <div class="kpi" id="waterKpi">${state.water}/12</div>
      <div class="grid-2">
        <button class="btn btn-water" id="wPlus">+1</button>
        <button class="btn" id="wMinus">-1</button>
      </div>
    </div>`;

  $('#wPlus').onclick = () => {
    state.water = Math.min(12, state.water + 1);
    localStorage.setItem('mtn-water', state.water);
    renderWater();
  };

  $('#wMinus').onclick = () => {
    state.water = Math.max(0, state.water - 1);
    localStorage.setItem('mtn-water', state.water);
    renderWater();
  };
}

function renderStats() {
  const avg = state.history.length
    ? Math.round(state.history.reduce((a, b) => a + b.p, 0) / state.history.length)
    : 0;

  $('#sec-stats').innerHTML = `
    <div class="card">
      <p class="title">${t[state.lang].history}</p>
      <div class="kpi">${avg}%</div>
      <p class="muted">${state.history.length} registros</p>
    </div>`;
}

function renderKB() {
  $('#sec-kb').innerHTML = `
    <div class="card">
      <p class="title">Kettlebell</p>
      <p class="muted">EMOM 20 minutos: alterna swings y goblet squats.</p>
    </div>`;
}

function renderMacros() {
  $('#sec-macros').innerHTML = `
    <div class="card">
      <p class="title">Nutrición</p>
      <p class="muted">Prioriza proteína, controla almidones y limita frutos secos.</p>
    </div>`;
}

function renderAll() {
  renderShell();
  renderDaily();
  renderKB();
  renderWater();
  renderMacros();
  renderStats();
}

document.addEventListener('click', e => {
  const langBtn = e.target.closest('.lang-btn');
  const tabBtn = e.target.closest('.tab-btn');

  if (langBtn) {
    state.lang = langBtn.dataset.lang;
    localStorage.setItem('mtn-lang', state.lang);
    renderAll();
  }

  if (tabBtn) {
    state.tab = tabBtn.dataset.tab;
    renderShell();
  }
});

renderAll();