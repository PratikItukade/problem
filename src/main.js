const stages = [
  { name: 'Understand', hint: 'Get specific', icon: '⌕' },
  { name: 'Check the cause', hint: 'Only if it helps', icon: '↳' },
  { name: 'Explore options', hint: 'Find a path', icon: '✦' },
  { name: 'Take action', hint: 'Try & observe', icon: '→' },
  { name: 'Reflect', hint: 'Learn from it', icon: '◌' }
];

const questions = [
  { title: 'What’s going on?', prompt: 'Describe the problem in a sentence or two.', placeholder: 'I’m stuck because…', key: 'problem', note: 'Be concrete. What happened, and what is the impact?' },
  { title: 'Is the cause clear?', prompt: 'You don’t always need to investigate. Is knowing the cause likely to change your next move?', type: 'choice', key: 'cause', choices: [['Yes, it would help', 'I should look into it first.'], ['No, I can move forward', 'I have enough information to act.']] },
  { title: 'What could you try?', prompt: 'List a few reasonable options. Aim for workable, not perfect.', type: 'options', key: 'options', note: 'Three possibilities can make a problem feel much less fixed.' },
  { title: 'Choose one small action', prompt: 'Which option feels most useful to try now?', type: 'action', key: 'action', note: 'Pick the smallest action that gives you information or moves things forward.' },
  { title: 'How did it go?', prompt: 'You tried something. What did you learn?', type: 'reflect', key: 'reflection' }
];

let state = { step: -1, answers: {} };
const app = document.querySelector('#app');
const nav = document.querySelector('#steps');
const status = document.querySelector('#saveStatus');

function escapeHtml(value = '') { return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]); }
function save() { localStorage.setItem('pathfinder-state', JSON.stringify(state)); status.textContent = 'Saved to this browser'; }
function renderNav() {
  nav.innerHTML = stages.map((stage, i) => `<button class="step ${i === state.step ? 'active' : ''} ${i < state.step ? 'done' : ''}" ${i > state.step + 1 ? 'disabled' : ''} data-step="${i}"><span class="step-icon">${i < state.step ? '✓' : stage.icon}</span><span><b>${stage.name}</b><small>${stage.hint}</small></span></button>`).join('');
}
function renderWelcome() { app.innerHTML = document.querySelector('#welcome-template').innerHTML; }
function input(value = '') { return `<textarea id="answer" autofocus placeholder="${questions[state.step].placeholder}">${escapeHtml(value)}</textarea>`; }
function renderQuestion() {
  const q = questions[state.step];
  let control = input(state.answers[q.key] || '');
  if (q.type === 'choice') control = `<div class="choice-grid">${q.choices.map(([title, body], i) => `<button class="choice ${state.answers.cause === i ? 'selected' : ''}" data-choice="${i}"><span class="radio"></span><b>${title}</b><small>${body}</small></button>`).join('')}</div>`;
  if (q.type === 'options') control = `<div class="option-list">${[0,1,2].map((i) => `<label><span>${String(i+1).padStart(2,'0')}</span><input data-option="${i}" placeholder="A possible next move" value="${escapeHtml(state.answers.options?.[i] || '')}"></label>`).join('')}</div>`;
  if (q.type === 'action') {
    const options = (state.answers.options || []).filter(Boolean);
    control = options.length ? `<div class="action-list">${options.map((option, i) => `<button class="action-choice ${state.answers.action === option ? 'selected' : ''}" data-action-choice="${i}"><span>${state.answers.action === option ? '✓' : '→'}</span>${escapeHtml(option)}</button>`).join('')}</div>` : `<div class="empty-state">Your options will appear here. Go back and add a few possibilities first.</div>`;
  }
  if (q.type === 'reflect') control = `<div class="reflect-grid"><button class="outcome ${state.answers.outcome === 'worked' ? 'selected' : ''}" data-outcome="worked"><span>✦</span><b>It helped</b><small>I made progress.</small></button><button class="outcome ${state.answers.outcome === 'not-yet' ? 'selected' : ''}" data-outcome="not-yet"><span>↻</span><b>Not yet</b><small>I need another approach.</small></button></div><textarea id="answer" placeholder="What did you learn? What will you do differently next time?">${escapeHtml(state.answers.reflection || '')}</textarea>`;
  app.innerHTML = `<div class="question-wrap"><div class="progress-copy"><span>Step ${String(state.step + 1).padStart(2,'0')} / 05</span><span>${Math.round(((state.step + 1)/5)*100)}%</span></div><div class="progress-line"><i style="width:${((state.step + 1)/5)*100}%"></i></div><div class="question-heading"><span class="question-number">${String(state.step + 1).padStart(2,'0')}</span><div><p class="eyebrow">${stages[state.step].name}</p><h1>${q.title}</h1><p>${q.prompt}</p></div></div><div class="control">${control}</div>${q.note ? `<div class="tip"><span>✦</span>${q.note}</div>` : ''}<div class="buttons"><button class="back-button" ${state.step === 0 ? 'disabled' : ''} data-action="back">← Back</button><button class="primary-button" data-action="next">${state.step === 4 ? 'Finish reflection' : 'Continue'} <span>→</span></button></div></div>`;
}
function renderComplete() { app.innerHTML = `<div class="complete-card"><span class="sun">✳</span><p class="eyebrow">You have a system</p><h1>One more problem<br><em>you can handle.</em></h1><p class="lede">You named the problem, chose a next move, and learned from the result. That’s real progress.</p><div class="recap"><span>THE NEXT TIME YOU FEEL STUCK</span><p>Return to the facts. Find one workable option. Try it. Learn. Repeat.</p></div><button class="primary-button" data-action="restart">Work through another problem <span>→</span></button></div>`; }
function render() { renderNav(); if (state.step === -1) renderWelcome(); else if (state.step === 5) renderComplete(); else renderQuestion(); }
function commitCurrent() { const q = questions[state.step]; const text = document.querySelector('#answer'); if (text) state.answers[q.key] = text.value.trim(); if (q.type === 'options') state.answers.options = [...document.querySelectorAll('[data-option]')].map(x => x.value.trim()); save(); }

document.addEventListener('click', (event) => {
  const target = event.target.closest('button'); if (!target) return;
  if (target.dataset.step !== undefined) { commitCurrent(); state.step = Number(target.dataset.step); render(); return; }
  if (target.dataset.choice !== undefined) { state.answers.cause = Number(target.dataset.choice); renderQuestion(); return; }
  if (target.dataset.actionChoice !== undefined) { state.answers.action = state.answers.options.filter(Boolean)[Number(target.dataset.actionChoice)]; renderQuestion(); return; }
  if (target.dataset.outcome) { state.answers.outcome = target.dataset.outcome; renderQuestion(); return; }
  const action = target.dataset.action;
  if (action === 'start') { state.step = 0; render(); }
  if (action === 'back') { commitCurrent(); state.step--; render(); }
  if (action === 'next') { commitCurrent(); state.step++; render(); }
  if (action === 'restart') { state = { step: 0, answers: {} }; save(); render(); }
});
document.querySelector('#newProblem').addEventListener('click', () => { state = { step: 0, answers: {} }; save(); render(); });
try { const saved = JSON.parse(localStorage.getItem('pathfinder-state')); if (saved) { state = saved; status.textContent = 'Restored your last session'; } } catch { /* start fresh */ }
render();
