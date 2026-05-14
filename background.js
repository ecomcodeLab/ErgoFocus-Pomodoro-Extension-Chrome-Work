'use strict';

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  focusDuration: 20,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  language: 'de',
  enabledCategories: ['eyes', 'mental', 'movement']
};

const STATE_KEY = 'ergofocus_state';

// ── In-memory state ───────────────────────────────────────────
let state = {
  status: 'stopped',
  mode: 'focus',
  remaining: 0,
  sessionCount: 0,
  autoLoop: false,
  settings: { ...DEFAULT_SETTINGS }
};

// ── Persist / restore state ───────────────────────────────────
function saveState() {
  chrome.storage.local.set({ [STATE_KEY]: {
    status: state.status,
    mode: state.mode,
    remaining: state.remaining,
    sessionCount: state.sessionCount,
    autoLoop: state.autoLoop
  }});
}

function restoreState(cb) {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    state.settings = { ...DEFAULT_SETTINGS, ...settings };

    chrome.storage.local.get([STATE_KEY], (local) => {
      const saved = local[STATE_KEY];
      if (saved) {
        state.status       = saved.status       || 'stopped';
        state.mode         = saved.mode         || 'focus';
        state.remaining    = typeof saved.remaining === 'number' ? saved.remaining : (state.settings.focusDuration * 60);
        state.sessionCount = saved.sessionCount || 0;
        state.autoLoop     = saved.autoLoop     || false;
      } else {
        state.remaining = state.settings.focusDuration * 60;
      }
      if (typeof cb === 'function') cb();
    });
  });
}

// ── Badge ─────────────────────────────────────────────────────
function updateBadge() {
  if (state.status === 'stopped') {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  const remaining = state.remaining;
  let badgeText;

  if (remaining <= 0) {
    badgeText = '0';
  } else if (remaining < 60) {
    badgeText = String(remaining);
  } else {
    const mins = Math.ceil(remaining / 60);
    badgeText = String(mins);
  }

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({
    color: state.mode === 'focus' ? '#f97316' : '#22c55e'
  });
}

// ── Sound ─────────────────────────────────────────────────────
function notifySound() {
  // Flag setzen, damit das Popup oder die Break-Seite den Ton abspielt
  chrome.storage.local.set({ playSoundFlag: Date.now() });
}

// ── Notification ──────────────────────────────────────────────
function showNotification(title, message) {
  if (!state.settings.notificationsEnabled) return;
  chrome.notifications.create(`ergofocus_${Date.now()}`, {
    type: 'basic',
    iconUrl: 'assets/icon128.png',
    title,
    message
  });
}

// ── Timer tick ────────────────────────────────────────────────
function tick() {
  if (state.status !== 'running') return;
  
  if (state.remaining <= 0) {
    timerFinished();
    return;
  }
  
  state.remaining -= 1;
  updateBadge();
  saveState();
}

// ── Timer finished ────────────────────────────────────────────
function timerFinished() {
  chrome.alarms.clear('tick');
  state.status = 'stopped';
  notifySound();

  const lang = state.settings.language || 'de';

  if (state.mode === 'focus') {
    // Fokus beendet -> Pause konfigurieren
    state.sessionCount += 1;
    const sessUntil = state.settings.sessionsUntilLongBreak || 4;
    const isLongBreak = (state.sessionCount % sessUntil === 0);

    const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
    const breakMins = isLongBreak
      ? state.settings.longBreakDuration
      : state.settings.shortBreakDuration;

    state.mode = nextMode;
    state.remaining = breakMins * 60;
    
    // Status auf RUNNING setzen, damit die Pause sofort losläuft
    state.status = 'running';

    const title   = lang === 'en' ? 'Focus done!' : 'Fokus beendet!';
    const message = lang === 'en'
      ? `${breakMins} min ${isLongBreak ? 'long ' : ''}break starting.`
      : `${breakMins} Min. ${isLongBreak ? 'lange ' : ''}Pause beginnt.`;
    showNotification(title, message);

    saveState();
    openBreakPage();
    
    // Timer für die Pause starten
    chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
    updateBadge();

  } else {
    // Pause beendet -> Zurück zu Fokus
    const focusMins = state.settings.focusDuration;
    state.mode = 'focus';
    state.remaining = focusMins * 60;

    const title   = lang === 'en' ? 'Break over!' : 'Pause beendet!';
    const message = lang === 'en'
      ? `${focusMins} min focus session starting.`
      : `${focusMins} Min. Fokus beginnt.`;
    showNotification(title, message);

    // Wenn Auto-Loop aktiv ist, direkt weiterlaufen lassen
    if (state.autoLoop) {
      state.status = 'running';
      chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
    } else {
      state.status = 'stopped';
    }

    saveState();
    closeBreakPage();
    updateBadge();
  }
}

// ── Break page management ─────────────────────────────────────
let breakTabId = null;

function openBreakPage() {
  const url = chrome.runtime.getURL('break/break.html');
  chrome.tabs.create({ url }, (t) => { 
    breakTabId = t.id; 
  });
}

function closeBreakPage() {
  if (breakTabId !== null) {
    chrome.tabs.remove(breakTabId, () => { 
      if (chrome.runtime.lastError) { /* ignore */ }
    });
    breakTabId = null;
  }
}

// ── Message handler ───────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {

    case 'GET_STATE':
      sendResponse({ ...state });
      return false;

    case 'START':
      if (state.status !== 'running') {
        if (state.remaining <= 0) {
          const dur = (state.mode === 'focus') ? state.settings.focusDuration : 
                      (state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
          state.remaining = dur * 60;
        }
        state.status = 'running';
        chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
        updateBadge();
        saveState();
      }
      sendResponse({ ...state });
      return false;

    case 'PAUSE':
      state.status = 'paused';
      chrome.alarms.clear('tick');
      updateBadge();
      saveState();
      sendResponse({ ...state });
      return false;

    case 'RESET':
      chrome.alarms.clear('tick');
      state.status = 'stopped';
      state.mode = 'focus';
      state.remaining = state.settings.focusDuration * 60;
      updateBadge();
      saveState();
      sendResponse({ ...state });
      return false;

    case 'SET_MODE': {
      chrome.alarms.clear('tick');
      state.status = 'stopped';
      state.mode = msg.mode;
      const mins = (msg.mode === 'focus') ? state.settings.focusDuration : 
                   (msg.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
      state.remaining = mins * 60;
      updateBadge();
      saveState();
      sendResponse({ ...state });
      return false;
    }

    case 'SET_AUTOLOOP':
      state.autoLoop = !!msg.value;
      chrome.storage.sync.set({ autoLoop: state.autoLoop });
      saveState();
      sendResponse({ ...state });
      return false;

    case 'RELOAD_SETTINGS':
      chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        state.settings = { ...DEFAULT_SETTINGS, ...settings };
        // Nur Zeit anpassen, wenn Timer nicht läuft
        if (state.status === 'stopped' || state.status === 'paused') {
          const dur = (state.mode === 'focus') ? state.settings.focusDuration : 
                      (state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
          state.remaining = dur * 60;
        }
        updateBadge();
        saveState();
        sendResponse({ ...state });
      });
      return true;

    case 'BREAK_PAGE_DONE':
      // Wird aufgerufen wenn Break-Timer abgelaufen ist oder Fenster geschlossen wurde
      breakTabId = null;
      sendResponse({ ok: true });
      return false;

    case 'BREAK_PAGE_SKIP':
      // Manueller Skip auf der Break-Seite
      breakTabId = null;
      chrome.alarms.clear('tick');
      state.mode = 'focus';
      state.remaining = state.settings.focusDuration * 60;
      state.status = state.autoLoop ? 'running' : 'stopped';
      if (state.autoLoop) {
        chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
      }
      updateBadge();
      saveState();
      sendResponse({ ok: true });
      return false;

    case 'PLAY_SOUND':
      return false;

    default:
      return false;
  }
});

// ── Alarm handler ─────────────────────────────────────────────
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tick') tick();
});

// ── Tab closed ────────────────────────────────────────────────
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === breakTabId) {
    breakTabId = null;
  }
});

// ── Initialization ────────────────────────────────────────────
restoreState(() => {
  updateBadge();
  if (state.status === 'running') {
    chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
  }
});