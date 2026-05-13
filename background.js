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
        state.remaining    = saved.remaining    || 0;
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
  try {
    chrome.runtime.sendMessage({ type: 'PLAY_SOUND' });
  } catch (_) {}
}

// ── Notification ──────────────────────────────────────────────
function showNotification(title, message) {
  if (!state.settings.notificationsEnabled) return;
  chrome.notifications.create(`ergofocus_${Date.now()}`, {
    type: 'basic',
    iconUrl: '../assets/icon128.png',
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
    state.sessionCount += 1;
    const sessUntil = state.settings.sessionsUntilLongBreak || 4;
    const isLongBreak = (state.sessionCount % sessUntil === 0);

    const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
    const breakMins = isLongBreak
      ? state.settings.longBreakDuration
      : state.settings.shortBreakDuration;

    state.mode = nextMode;
    state.remaining = breakMins * 60;

    const title   = lang === 'en' ? 'Focus done!' : 'Fokus beendet!';
    const message = lang === 'en'
      ? `${breakMins} min ${isLongBreak ? 'long ' : ''}break starting.`
      : `${breakMins} Min. ${isLongBreak ? 'lange ' : ''}Pause beginnt.`;
    showNotification(title, message);

    saveState();
    openBreakPage();

    if (state.autoLoop) {
      state.status = 'running';
      state.remaining = breakMins * 60;
      saveState();
      chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
      updateBadge();
    }

  } else {
    const focusMins = state.settings.focusDuration;
    state.mode = 'focus';
    state.remaining = focusMins * 60;

    const title   = lang === 'en' ? 'Break over!' : 'Pause beendet!';
    const message = lang === 'en'
      ? `${focusMins} min focus session starting.`
      : `${focusMins} Min. Fokus beginnt.`;
    showNotification(title, message);

    saveState();
    closeBreakPage();

    if (state.autoLoop) {
      state.status = 'running';
      saveState();
      chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
      updateBadge();
    }
  }
}

// ── Break page management ─────────────────────────────────────
let breakTabId = null;

function openBreakPage() {
  const url = chrome.runtime.getURL('break/break.html');
  if (breakTabId !== null) {
    chrome.tabs.get(breakTabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        chrome.tabs.create({ url }, (t) => { breakTabId = t.id; });
      } else {
        chrome.tabs.update(breakTabId, { active: true });
      }
    });
  } else {
    chrome.tabs.create({ url }, (t) => { breakTabId = t.id; });
  }
}

function closeBreakPage() {
  if (breakTabId !== null) {
    chrome.tabs.remove(breakTabId, () => { void chrome.runtime.lastError; });
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
          state.remaining = state.settings.focusDuration * 60;
        }
        state.status = 'running';
        chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
        updateBadge();
        saveState();
      }
      sendResponse({ ...state });
      return false;

    case 'PAUSE':
      if (state.status === 'running') {
        state.status = 'paused';
        chrome.alarms.clear('tick');
        updateBadge();
        saveState();
      }
      sendResponse({ ...state });
      return false;

    case 'RESET':
      chrome.alarms.clear('tick');
      state.status = 'stopped';
      state.remaining = state.settings.focusDuration * 60;
      state.mode = 'focus';
      updateBadge();
      saveState();
      sendResponse({ ...state });
      return false;

    case 'SET_MODE': {
      const modeMap = {
        focus:      () => state.settings.focusDuration * 60,
        shortBreak: () => state.settings.shortBreakDuration * 60,
        longBreak:  () => state.settings.longBreakDuration * 60
      };
      if (modeMap[msg.mode]) {
        chrome.alarms.clear('tick');
        state.status = 'stopped';
        state.mode = msg.mode;
        state.remaining = modeMap[msg.mode]();
        updateBadge();
        saveState();
      }
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
        if (state.status === 'stopped') {
          if (state.mode === 'focus')       state.remaining = state.settings.focusDuration * 60;
          else if (state.mode === 'shortBreak') state.remaining = state.settings.shortBreakDuration * 60;
          else if (state.mode === 'longBreak')  state.remaining = state.settings.longBreakDuration * 60;
        }
        updateBadge();
        saveState();
        sendResponse({ ...state });
      });
      return true; // async

    case 'BREAK_PAGE_DONE':
      breakTabId = null;
      if (state.autoLoop && state.mode === 'focus') {
        state.status = 'running';
        if (state.remaining <= 0) state.remaining = state.settings.focusDuration * 60;
        chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
        updateBadge();
        saveState();
      }
      sendResponse({ ok: true });
      return false;

    case 'BREAK_PAGE_SKIP':
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
      // handled in popup/break pages directly
      return false;

    default:
      // Unknown message — do NOT call sendResponse to avoid the error
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

// ── Startup ───────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  restoreState(() => { updateBadge(); });
});

chrome.runtime.onStartup.addListener(() => {
  restoreState(() => {
    updateBadge();
    if (state.status === 'running') {
      chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
    }
  });
});

// Init on service worker wake
restoreState(() => {
  updateBadge();
  if (state.status === 'running') {
    chrome.alarms.create('tick', { periodInMinutes: 1 / 60 });
  }
});