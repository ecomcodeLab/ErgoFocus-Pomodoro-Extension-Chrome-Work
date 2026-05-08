'use strict';

const LABELS = {
  de: {
    focus:        'Fokus',
    shortBreak:   'Kurze Pause',
    longBreak:    'Lange Pause',
    sessionLabel: 'bis lange Pause',
    autoLoop:     'Auto-Loop',
  },
  en: {
    focus:        'Focus',
    shortBreak:   'Short Break',
    longBreak:    'Long Break',
    sessionLabel: 'until long break',
    autoLoop:     'Auto-Loop',
  },
};

let pollTimer   = null;
let lastSoundTs = 0;

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function playSound() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

function updateCircle(remaining, total) {
  const circle = document.getElementById('progressCircle');
  if (!circle) return;
  const circ     = 2 * Math.PI * 54;
  const progress = total > 0 ? remaining / total : 1;
  circle.style.strokeDashoffset = circ * (1 - progress);
}

function getModeColor(mode) {
  if (mode === 'focus')      return '#f97316';
  if (mode === 'shortBreak') return '#22c55e';
  if (mode === 'longBreak')  return '#3b82f6';
  return '#f97316';
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderState(s) {
  if (!s) return;

  const lang      = (s.settings && s.settings.language) || 'de';
  const labels    = LABELS[lang] || LABELS['de'];
  const mode      = s.mode      || 'focus';
  const status    = s.status    || 'stopped';
  const remaining = typeof s.remaining === 'number' ? s.remaining : 0;

  let total = 20 * 60;
  if (s.settings) {
    if (mode === 'focus')      total = (s.settings.focusDuration      || 20) * 60;
    if (mode === 'shortBreak') total = (s.settings.shortBreakDuration  ||  5) * 60;
    if (mode === 'longBreak')  total = (s.settings.longBreakDuration   || 15) * 60;
  }

  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = fmt(remaining);

  const modeLabelEl = document.getElementById('modeLabel');
  if (modeLabelEl) modeLabelEl.textContent = labels[mode] || mode;

  const color  = getModeColor(mode);
  const circle = document.getElementById('progressCircle');
  if (circle) circle.style.stroke = color;
  updateCircle(remaining, total);

  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = status === 'running' ? '⏸' : '▶';

  const sessEl = document.getElementById('sessionCount');
  if (sessEl) {
    const needed  = (s.settings && s.settings.sessionsUntilLongBreak) || 4;
    const count   = s.sessionCount || 0;
    const inCycle = count % needed;
    sessEl.textContent = '🍅 ' + inCycle + ' / ' + needed + ' ' + labels.sessionLabel;
  }

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const autoLoopToggle = document.getElementById('autoLoopToggle');
  if (autoLoopToggle) autoLoopToggle.checked = !!s.autoLoop;

  const autoLoopLabel = document.getElementById('autoLoopLabel');
  if (autoLoopLabel) autoLoopLabel.textContent = labels.autoLoop;

  // Sound check
  if (s.settings && s.settings.soundEnabled) {
    chrome.storage.local.get(['playSoundFlag'], (data) => {
      if (data.playSoundFlag && data.playSoundFlag > lastSoundTs) {
        lastSoundTs = data.playSoundFlag;
        playSound();
        // Clear flag so it doesn't replay
        chrome.storage.local.remove('playSoundFlag');
      }
    });
  }
}

// ── Poll ───────────────────────────────────────────────────────────────────
function poll() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (s) => {
    if (chrome.runtime.lastError) return;
    renderState(s);
  });
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  poll();
  pollTimer = setInterval(poll, 1000);

  document.getElementById('playBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (s) => {
      if (!s) return;
      const type = s.status === 'running' ? 'PAUSE' : 'START';
      chrome.runtime.sendMessage({ type }, poll);
    });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'RESET' }, poll);
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'SET_MODE', mode: btn.dataset.mode }, poll);
    });
  });

  const autoLoopToggle = document.getElementById('autoLoopToggle');
  if (autoLoopToggle) {
    autoLoopToggle.addEventListener('change', () => {
      chrome.runtime.sendMessage({ type: 'SET_AUTOLOOP', value: autoLoopToggle.checked });
    });
  }

  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
  }

  window.addEventListener('unload', () => {
    if (pollTimer) clearInterval(pollTimer);
  });
});