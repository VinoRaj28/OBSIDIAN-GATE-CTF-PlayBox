const STORAGE_KEY = 'obsidian-gate-progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // localStorage unavailable (private mode etc.) - progress just won't persist
  }
}

function connectionInfo(stage) {
  const primaryHost = stage.hostname || window.location.hostname || 'localhost';
  if (stage.protocol === 'ssh') {
    return `ssh &lt;user&gt;@${primaryHost} -p ${stage.port}<br>`
      + `<span class="fallback">or: ssh &lt;user&gt;@localhost -p ${stage.port}</span>`;
  }
  return `<a href="http://${primaryHost}:${stage.port}/" target="_blank" rel="noopener">http://${primaryHost}:${stage.port}/</a><br>`
    + `<span class="fallback">or: <a href="http://localhost:${stage.port}/" target="_blank" rel="noopener">http://localhost:${stage.port}/</a></span>`;
}

function renderStages(stages, progress, filter) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const visible = filter === 'all' ? stages : stages.filter(s => s.difficulty === filter);

  for (const stage of visible) {
    const solved = !!progress[stage.id];
    const card = document.createElement('div');
    card.className = 'card' + (solved ? ' solved' : '');

    card.innerHTML = `
      ${solved ? '<span class="solved-tag">CLOSED</span>' : ''}
      <div class="top-row">
        <div>
          <div class="stage-num">FILE NO. 0${stage.number}</div>
          <h2>${stage.title}</h2>
          <p class="category">${stage.category}</p>
        </div>
        <span class="diff ${stage.difficulty}">${stage.difficultyLabel}</span>
      </div>
      <p class="blurb">${stage.blurb}</p>
      <div class="conn">${connectionInfo(stage)}</div>
      <div class="solve-row">
        <input type="text" placeholder="OBSIDIAN{...}" data-stage="${stage.id}" ${solved ? 'disabled' : ''}>
        <button data-submit="${stage.id}" ${solved ? 'disabled' : ''}>${solved ? 'Closed' : 'Submit'}</button>
      </div>
      <div class="status-msg" data-status="${stage.id}"></div>
    `;
    grid.appendChild(card);
  }

  grid.querySelectorAll('button[data-submit]').forEach(btn => {
    btn.addEventListener('click', () => submitFlag(btn.dataset.submit, stages));
  });
  grid.querySelectorAll('input[data-stage]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitFlag(input.dataset.stage, stages);
    });
  });
}

function updateProgressBar(stages, progress) {
  const total = stages.length;
  const solvedCount = stages.filter(s => progress[s.id]).length;
  const pct = total ? Math.round((solvedCount / total) * 100) : 0;
  document.getElementById('progress-label').textContent = `${solvedCount} / ${total} case files closed`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
}

let ALL_STAGES = [];
let CURRENT_FILTER = 'all';

async function submitFlag(stageId, stages) {
  const input = document.querySelector(`input[data-stage="${stageId}"]`);
  const statusEl = document.querySelector(`div[data-status="${stageId}"]`);
  const flag = input.value.trim();
  if (!flag) return;

  statusEl.textContent = 'Checking...';
  statusEl.className = 'status-msg';

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: stageId, flag })
    });
    const data = await res.json();
    if (data.correct) {
      const progress = loadProgress();
      progress[stageId] = true;
      saveProgress(progress);
      statusEl.textContent = 'Match confirmed. Case closed.';
      statusEl.className = 'status-msg correct';
      renderStages(stages, progress, CURRENT_FILTER);
      updateProgressBar(stages, progress);
    } else {
      statusEl.textContent = 'No match. Keep digging.';
      statusEl.className = 'status-msg wrong';
    }
  } catch (e) {
    statusEl.textContent = 'Could not reach the case system.';
    statusEl.className = 'status-msg wrong';
  }
}

async function init() {
  const res = await fetch('/api/stages');
  ALL_STAGES = await res.json();
  const progress = loadProgress();
  renderStages(ALL_STAGES, progress, CURRENT_FILTER);
  updateProgressBar(ALL_STAGES, progress);

  document.getElementById('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    CURRENT_FILTER = btn.dataset.filter;
    document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('active', b === btn));
    renderStages(ALL_STAGES, loadProgress(), CURRENT_FILTER);
  });
}

init();
