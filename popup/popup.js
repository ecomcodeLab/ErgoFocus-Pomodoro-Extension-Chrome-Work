'use strict';

const CIRCUMFERENCE = 2 * Math.PI * 54; // 339.292

const LABELS = {
  de: {
    focus:        'Fokus',
    shortBreak:   'Kurze Pause',
    longBreak:    'Lange Pause',
    sessionLabel: 'bis lange Pause',
    autoLoop:     'Auto-Loop'
  },
  en: {
    focus:        'Focus',
    shortBreak:   'Short Break',
    longBreak:    'Long Break',
    sessionLabel: 'until long break',
    autoLoop:     'Auto-Loop'
  }
};

let pollTimer = null;

// ─── Utils ────────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function getModeColor(mode) {
  if (mode === 'shortBreak') return '#22c55e';
  if (mode === 'longBreak')  return '#3b82f6';
  return '#f97316';
}

function playChime() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  } catch (_) {}
}

// ─── Render ───────────────────────────────────────────────────────────────────
let _lastRemaining = -1;
let _lastStatus    = '';

function renderState(state) {
  if (!state) return;

  const lang     = (state.settings && state.settings.language) || 'de';
  const labels   = LABELS[lang] || LABELS.de;
  const mode     = state.mode     || 'focus';
  const status   = state.status   || 'stopped';
  const remaining = typeof state.remaining === 'number' ? state.remaining : 0;
  const total     = typeof state.total     === 'number' ? state.total     : remaining;

  // Sound on transition to done
  if (_lastRemaining > 0 && remaining === 0 && status !== 'stopped') {
    if (state.settings && state.settings.soundEnabled !== false) playChime();
  }
  _lastRemaining = remaining;
  _lastStatus    = status;

  // Timer
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = formatTime(remaining);

  // Mode label
  const modeLabelEl = document.getElementById('modeLabel');
  if (modeLabelEl) modeLabelEl.textContent = labels[mode] || mode;

  // Progress ring
  const circle = document.getElementById('progressCircle');
  if (circle) {
    const color    = getModeColor(mode);
    circle.style.stroke = color;
    const progress = total > 0 ? remaining / total : 1;
    circle.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
  }

  // Play button
  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = status === 'running' ? '⏸' : '▶';

  // Mode button highlights
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Session counter
  const sessEl   = document.getElementById('sessionCount');
  const settings = state.settings || {};
  if (sessEl) {
    const until   = parseInt(settings.sessionsUntilLongBreak, 10) || 4;
    const count   = parseInt(state.sessionCount, 10) || 0;
    const inCycle = count % until;
    sessEl.textContent = `🍅 ${inCycle} / ${until} ${labels.sessionLabel}`;
  }

  // Auto-loop toggle
  const autoToggle = document.getElementById('autoLoopToggle');
  if (autoToggle && autoToggle !== document.activeElement) {
    autoToggle.checked = !!state.autoLoop;
  }

  // Auto-loop label
  const autoLabel = document.getElementById('autoLoopLabel');
  if (autoLabel) autoLabel.textContent = labels.autoLoop;

  // Mode button labels
  const btnFocus = document.getElementById('btn-focus');
  const btnShort = document.getElementById('btn-shortBreak');
  const btnLong  = document.getElementById('btn-longBreak');
  if (btnFocus) btnFocus.textContent = labels.focus;
  if (btnShort) btnShort.textContent = labels.shortBreak;
  if (btnLong)  btnLong.textContent  = labels.longBreak;
}

// ─── Messaging ────────────────────────────────────────────────────────────────
function sendMsg(type, extra, cb) {
  const msg = { type, ...extra };
  chrome.runtime.sendMessage(msg, (response) => {
    if (chrome.runtime.lastError) {
      console.warn('[Popup] sendMsg error:', chrome.runtime.lastError.message);
      return;
    }
    if (cb) cb(response);
    else renderState(response);
  });
}

function pollState() {
  sendMsg('GET_STATE', {}, renderState);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  pollState();
  pollTimer = setInterval(pollState, 1000);

  // Play / Pause
  document.getElementById('playBtn').addEventListener('click', () => {
    sendMsg('GET_STATE', {}, (state) => {
      if (!state) return;
      const action = state.status === 'running' ? 'PAUSE' : 'START';
      sendMsg(action, {}, renderState);
    });
  });

  // Reset
  document.getElementById('resetBtn').addEventListener('click', () => {
    sendMsg('RESET', {}, renderState);
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMsg('SET_MODE', { mode: btn.dataset.mode }, renderState);
    });
  });

  // Auto-loop toggle
  const autoToggle = document.getElementById('autoLoopToggle');
  if (autoToggle) {
    autoToggle.addEventListener('change', () => {
      sendMsg('SET_AUTOLOOP', { value: autoToggle.checked });
    });
  }

  // Settings button
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      document.getElementById('playBtn').click();
    } else if (e.code === 'KeyR') {
      document.getElementById('resetBtn').click();
    }
  });
});

window.addEventListener('unload', () => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
});