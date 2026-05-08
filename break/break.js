'use strict';

const CIRCUMFERENCE = 2 * Math.PI * 54; // 339.29

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

let totalDuration = 0;
let exercisesRendered = false;
let pollInterval = null;
let lastMode = null;

// ── Sound ──────────────────────────────────────────────────────
function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  } catch (_) {}
}

// ── Exercises ─────────────────────────────────────────────────
function pickExercises(enabledCategories, lang) {
  if (!Array.isArray(enabledCategories) || enabledCategories.length === 0) return [];

  const byCategory = {};
  enabledCategories.forEach(cat => { byCategory[cat] = []; });

  (typeof EXERCISES !== 'undefined' ? EXERCISES : []).forEach(ex => {
    if (byCategory.hasOwnProperty(ex.category)) {
      byCategory[ex.category].push(ex);
    }
  });

  const picked = [];
  enabledCategories.forEach(cat => {
    const pool = byCategory[cat];
    if (pool && pool.length > 0) {
      picked.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  });
  return picked;
}

function renderExercises(enabledCategories, lang) {
  const grid = document.getElementById('exercisesGrid');
  const heading = document.getElementById('exercisesHeading');
  const L = LABELS[lang] || LABELS['de'];

  if (heading) heading.textContent = L.exercisesHeading;

  if (!grid) return;
  grid.innerHTML = '';

  const exercises = pickExercises(enabledCategories, lang);

  if (exercises.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);font-size:0.85rem;text-align:center;">${L.noCategories}</p>`;
    return;
  }

  exercises.forEach(ex => {
    const loc = ex[lang] || ex['de'];
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <span class="ex-emoji">${ex.emoji}</span>
      <span class="ex-title">${loc.title}</span>
      <span class="ex-text">${loc.text}</span>
    `;
    grid.appendChild(card);
  });
}

// ── Timer UI ──────────────────────────────────────────────────
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerUI(remaining, total, mode, lang) {
  const L = LABELS[lang] || LABELS['de'];

  // Text
  const timerTextEl = document.getElementById('timerText');
  if (timerTextEl) timerTextEl.textContent = formatTime(remaining);

  // Label
  const timerLabelEl = document.getElementById('timerLabel');
  if (timerLabelEl) timerLabelEl.textContent = L.timerLabel;

  // Circle
  const progress = document.getElementById('timerProgress');
  if (progress) {
    const ratio = total > 0 ? remaining / total : 1;
    progress.style.strokeDashoffset = CIRCUMFERENCE * (1 - ratio);

    // Color: blue for long break, green for short break
    progress.style.stroke = mode === 'longBreak' ? '#3b82f6' : '#22c55e';
  }
}

function applyLabels(mode, lang) {
  const L = LABELS[lang] || LABELS['de'];

  const titleEl = document.getElementById('breakTitle');
  if (titleEl) titleEl.textContent = mode === 'longBreak' ? L.longBreakTitle : L.breakTitle;

  const subEl = document.getElementById('breakSubtitle');
  if (subEl) subEl.textContent = L.breakSubtitle;

  const skipEl = document.getElementById('skipBtn');
  if (skipEl) skipEl.textContent = L.skipBtn;
}

// ── Main polling ──────────────────────────────────────────────
function poll() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
    if (chrome.runtime.lastError || !state) return;

    const lang = (state.settings && state.settings.language) || 'de';
    const mode = state.mode || 'shortBreak';
    const remaining = typeof state.remaining === 'number' ? state.remaining : 0;
    const settings = state.settings || {};

    // Determine total duration from settings
    let total = totalDuration;
    if (!total || lastMode !== mode) {
      if (mode === 'longBreak') {
        total = (settings.longBreakDuration || 15) * 60;
      } else {
        total = (settings.shortBreakDuration || 5) * 60;
      }
      totalDuration = total;
    }

    // Apply labels once or when mode changes
    if (lastMode !== mode) {
      applyLabels(mode, lang);
      lastMode = mode;
    }

    // Render exercises only once per break session
    if (!exercisesRendered) {
      const enabledCategories = Array.isArray(settings.enabledCategories)
        ? settings.enabledCategories
        : ['eyes', 'mental', 'movement'];
      renderExercises(enabledCategories, lang);
      exercisesRendered = true;
    }

    updateTimerUI(remaining, total, mode, lang);

    // If the background finished or mode changed to focus → close tab
    if (state.status === 'stopped' && remaining === 0) {
      closePage();
    }
    if (mode === 'focus') {
      closePage();
    }
  });
}

function closePage() {
  if (pollInterval) clearInterval(pollInterval);
  chrome.runtime.sendMessage({ type: 'BREAK_PAGE_DONE' }, () => {
    window.close();
  });
}

// ── Skip ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  playSound();

  pollInterval = setInterval(poll, 1000);
  poll(); // immediate first call

  document.getElementById('skipBtn').addEventListener('click', () => {
    if (pollInterval) clearInterval(pollInterval);
    chrome.runtime.sendMessage({ type: 'BREAK_PAGE_SKIP' }, () => {
      window.close();
    });
  });
});