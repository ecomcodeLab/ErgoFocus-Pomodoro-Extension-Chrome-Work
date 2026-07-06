'use strict';

const LABELS = {
  de: { focus: 'Fokus', shortBreak: 'Kurze Pause', longBreak: 'Lange Pause', sessionLabel: 'bis lange Pause', autoLoop: 'Auto-Loop' },
  en: { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break', sessionLabel: 'until long break', autoLoop: 'Auto-Loop' }
};

let pollTimer = null;
let lastSoundTs = 0;

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
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
  const circ = 2 * Math.PI * 54;
  const progress = total > 0 ? Math.min(1, remaining / total) : 0;
  circle.style.strokeDashoffset = circ * (1 - progress);
}

function renderState(s) {
  if (!s) return;

  const lang = s.settings?.language || 'de';
  const labels = LABELS[lang] || LABELS['de'];
  const mode = s.mode || 'focus';
  const status = s.status || 'stopped';
  const remaining = s.remaining || 0;

  let total = 20 * 60;
  if (s.settings) {
    if (mode === 'focus') total = (s.settings.focusDuration || 20) * 60;
    else if (mode === 'shortBreak') total = (s.settings.shortBreakDuration || 5) * 60;
    else if (mode === 'longBreak') total = (s.settings.longBreakDuration || 15) * 60;
  }

  document.getElementById('timer').textContent = fmt(remaining);
  document.getElementById('modeLabel').textContent = labels[mode];
  
  const circle = document.getElementById('progressCircle');
  if (circle) {
    const colors = { focus: '#f97316', shortBreak: '#22c55e', longBreak: '#3b82f6' };
    circle.style.stroke = colors[mode] || '#f97316';
  }
  updateCircle(remaining, total);

  document.getElementById('playBtn').textContent = status === 'running' ? '⏸' : '▶';

  const sessEl = document.getElementById('sessionCount');
  if (sessEl) {
    const needed = s.settings?.sessionsUntilLongBreak || 4;
    const inCycle = (s.sessionCount || 0) % needed;
    sessEl.textContent = '🍅 ' + inCycle + ' / ' + needed + ' ' + labels.sessionLabel;
  }

  // Disable Mode-Buttons when Timer is running
  const isRunning = (status === 'running');
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
    if (labels[btn.dataset.mode]) btn.textContent = labels[btn.dataset.mode];
    btn.disabled = isRunning;
  });

  document.getElementById('autoLoopToggle').checked = !!s.autoLoop;
  document.getElementById('autoLoopLabel').textContent = labels.autoLoop;

  // Sound check
  chrome.storage.local.get(['playSoundFlag'], (data) => {
    if (data.playSoundFlag && data.playSoundFlag > lastSoundTs) {
      lastSoundTs = data.playSoundFlag;
      if (s.settings?.soundEnabled) playSound();
      chrome.storage.local.remove('playSoundFlag');
    }
  });
}

function poll() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (s) => {
    if (chrome.runtime.lastError) {
      console.warn("Poll error:", chrome.runtime.lastError.message);
      return;
    }
    renderState(s);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  poll();
  pollTimer = setInterval(poll, 1000);

  document.getElementById('playBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (s) => {
      const type = (s && s.status === 'running') ? 'PAUSE' : 'START';
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

  document.getElementById('autoLoopToggle').addEventListener('change', (e) => {
    chrome.runtime.sendMessage({ type: 'SET_AUTOLOOP', value: e.target.checked }, poll);
  });

  document.getElementById('settingsBtn').addEventListener('click', () => chrome.runtime.openOptionsPage());

  window.addEventListener('unload', () => clearInterval(pollTimer));
});