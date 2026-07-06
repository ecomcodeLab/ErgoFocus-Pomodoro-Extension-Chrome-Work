'use strict';

const CIRCUMFERENCE = 2 * Math.PI * 54;
const LABELS = {
  de: {
    breakTitle: 'Zeit für eine Pause! 🌿',
    longBreakTitle: 'Lange Pause – gut gemacht! 🎉',
    breakSubtitle: 'Gönn deinem Körper etwas Gutes.',
    timerLabel: 'Pause',
    exercisesHeading: 'Empfohlene Übungen',
    skipBtn: 'Pause überspringen',
    noCategories: 'Keine Kategorien ausgewählt'
  },
  en: {
    breakTitle: 'Time for a break! 🌿',
    longBreakTitle: 'Long break – well done! 🎉',
    breakSubtitle: 'Give your body some love.',
    timerLabel: 'Break',
    exercisesHeading: 'Recommended exercises',
    skipBtn: 'Skip break',
    noCategories: 'No categories selected'
  }
};

let exercisesRendered = false;
let pollInterval = null;
let lastMode = null;

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function renderExercises(enabledCategories, lang) {
  const grid = document.getElementById('exercisesGrid');
  if (!grid || exercisesRendered) return;
  
  const pool = (typeof EXERCISES !== 'undefined' ? EXERCISES : []).filter(ex => enabledCategories.includes(ex.category));
  if (pool.length === 0) {
    grid.innerHTML = `<p>${(LABELS[lang] || LABELS.de).noCategories}</p>`;
    return;
  }

  // Pick one from each enabled category
  const picked = [];
  enabledCategories.forEach(cat => {
    const catPool = pool.filter(e => e.category === cat);
    if (catPool.length > 0) picked.push(catPool[Math.floor(Math.random() * catPool.length)]);
  });

  grid.innerHTML = '';
  picked.forEach(ex => {
    const loc = ex[lang] || ex.de;
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `<span class="ex-emoji">${ex.emoji}</span><span class="ex-title">${loc.title}</span><span class="ex-text">${loc.text}</span>`;
    grid.appendChild(card);
  });
  exercisesRendered = true;
}

function poll() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (s) => {
    if (chrome.runtime.lastError || !s) return;

    const lang = s.settings?.language || 'de';
    const mode = s.mode || 'shortBreak';
    const status = s.status || 'stopped';
    const remaining = status === 'running' ? Math.max(0, Math.round((s.endTime - Date.now()) / 1000)) : (s.remainingAtPause || 0);
    
    let total = (mode === 'longBreak' ? s.settings.longBreakDuration : s.settings.shortBreakDuration) * 60;
    const L = LABELS[lang] || LABELS.de;

    if (lastMode !== mode) {
      document.getElementById('breakTitle').textContent = mode === 'longBreak' ? L.longBreakTitle : L.breakTitle;
      document.getElementById('timerLabel').textContent = L.timerLabel;
      document.getElementById('skipBtn').textContent = L.skipBtn;
      document.getElementById('exercisesHeading').textContent = L.exercisesHeading;
      lastMode = mode;
    }

    if (!exercisesRendered) renderExercises(s.settings.enabledCategories, lang);

    document.getElementById('timerText').textContent = fmt(remaining);
    const progress = document.getElementById('timerProgress');
    if (progress) {
      const ratio = total > 0 ? remaining / total : 1;
      progress.style.strokeDashoffset = CIRCUMFERENCE * (1 - ratio);
      progress.style.stroke = mode === 'longBreak' ? '#3b82f6' : '#22c55e';
    }

    if (mode === 'focus') window.close();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  pollInterval = setInterval(poll, 1000);
  poll();
  document.getElementById('skipBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'BREAK_PAGE_SKIP' }, () => window.close());
  });
});