'use strict';

const DEFAULTS = {
  focusDuration:          20,
  shortBreakDuration:      5,
  longBreakDuration:       15,
  sessionsUntilLongBreak:  4,
  soundEnabled:            true,
  notificationsEnabled:    true,
  language:               'de',
};

let state = {
  status:       'stopped',
  mode:         'focus',
  remaining:    DEFAULTS.focusDuration * 60,
  sessionCount: 0,
  autoLoop:     false,
  settings:     { ...DEFAULTS },
};

const TICK_ALARM = 'ERGOFOCUS_TICK';
let lastTickTime = null;

// ── Storage ────────────────────────────────────────────────────────────────
function saveState() {
  return chrome.storage.local.set({ timerState: state });
}

async function loadState() {
  const data = await chrome.storage.local.get(['timerState', 'settings', 'enabledCategories', 'autoLoop']);

  if (data.settings) {
    state.settings = { ...DEFAULTS, ...data.settings };
  }
  if (data.enabledCategories) {
    state.settings.enabledCategories = data.enabledCategories;
  }

  if (data.timerState) {
    const t = data.timerState;
    state.status       = t.status       || 'stopped';
    state.mode         = t.mode         || 'focus';
    state.sessionCount = t.sessionCount || 0;
    state.autoLoop     = typeof t.autoLoop === 'boolean' ? t.autoLoop : false;

    if (t.status === 'running' || t.status === 'paused') {
      state.remaining = typeof t.remaining === 'number' ? t.remaining : getDuration(state.mode);
    } else {
      state.remaining = getDuration(state.mode);
    }

    if (t.settings) {
      state.settings = { ...DEFAULTS, ...t.settings };
      if (data.settings) state.settings = { ...state.settings, ...data.settings };
      if (data.enabledCategories) state.settings.enabledCategories = data.enabledCategories;
    }
  } else {
    state.remaining = getDuration('focus');
  }

  if (typeof data.autoLoop === 'boolean') {
    state.autoLoop = data.autoLoop;
  }
}

// ── Duration ───────────────────────────────────────────────────────────────
function getDuration(mode) {
  const s = state.settings;
  if (mode === 'focus')      return Math.max(1, (s.focusDuration      || DEFAULTS.focusDuration))      * 60;
  if (mode === 'shortBreak') return Math.max(1, (s.shortBreakDuration  || DEFAULTS.shortBreakDuration))  * 60;
  if (mode === 'longBreak')  return Math.max(1, (s.longBreakDuration   || DEFAULTS.longBreakDuration))   * 60;
  return Math.max(1, (s.focusDuration || DEFAULTS.focusDuration)) * 60;
}

// ── Badge ──────────────────────────────────────────────────────────────────
function updateBadge() {
  if (state.status === 'stopped') {
    chrome.action.setBadgeText({ text: '' });
    return;
  }
  const totalSecs = state.remaining;
  let text;
  if (totalSecs >= 60) {
    text = String(Math.ceil(totalSecs / 60)) + 'm';
  } else {
    text = String(totalSecs) + 's';
  }
  const color = state.mode === 'focus' ? '#f97316' : state.mode === 'longBreak' ? '#3b82f6' : '#22c55e';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

// ── Sound ──────────────────────────────────────────────────────────────────
function triggerSound() {
  if (state.settings.soundEnabled) {
    chrome.storage.local.set({ playSoundFlag: Date.now() });
  }
}

// ── Notification ───────────────────────────────────────────────────────────
function notify(title, message) {
  if (!state.settings.notificationsEnabled) return;
  chrome.notifications.create('ef_' + Date.now(), {
    type:    'basic',
    iconUrl: 'assets/icon128.png',
    title,
    message,
  });
}

// ── Break tab ──────────────────────────────────────────────────────────────
function openBreakTab() {
  const url = chrome.runtime.getURL('break/break.html');
  chrome.tabs.query({ url }, (tabs) => {
    if (tabs && tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  });
}

function closeBreakTab() {
  const url = chrome.runtime.getURL('break/break.html');
  chrome.tabs.query({ url }, (tabs) => {
    tabs.forEach(t => chrome.tabs.remove(t.id));
  });
}

// ── Alarm ──────────────────────────────────────────────────────────────────
function startAlarm() {
  lastTickTime = Date.now();
  chrome.alarms.create(TICK_ALARM, { periodInMinutes: 1 / 60 });
}

function stopAlarm() {
  chrome.alarms.clear(TICK_ALARM);
  lastTickTime = null;
}

// ── Timer finished ─────────────────────────────────────────────────────────
async function timerFinished() {
  stopAlarm();
  triggerSound();

  const lang = state.settings.language || 'de';

  if (state.mode === 'focus') {
    state.sessionCount += 1;

    const needed   = Math.max(1, state.settings.sessionsUntilLongBreak || DEFAULTS.sessionsUntilLongBreak);
    const isLong   = (state.sessionCount % needed) === 0;
    const nextMode = isLong ? 'longBreak' : 'shortBreak';

    state.mode      = nextMode;
    state.status    = 'running';
    state.remaining = getDuration(nextMode);

    notify(
      lang === 'en' ? 'Focus done! Break time 🌿' : 'Fokus vorbei! Pause 🌿',
      lang === 'en'
        ? (isLong ? 'Long' : 'Short') + ' break started.'
        : (isLong ? 'Lange' : 'Kurze') + ' Pause gestartet.'
    );

    await saveState();
    startAlarm();
    updateBadge();
    openBreakTab();

  } else {
    closeBreakTab();
    notify(
      lang === 'en' ? 'Break over! Back to work 💪' : 'Pause vorbei! Weiter 💪',
      lang === 'en' ? 'Focus session starting.' : 'Fokus-Session startet.'
    );

    if (state.autoLoop) {
      state.mode      = 'focus';
      state.status    = 'running';
      state.remaining = getDuration('focus');
      await saveState();
      startAlarm();
      updateBadge();
    } else {
      state.mode      = 'focus';
      state.status    = 'stopped';
      state.remaining = getDuration('focus');
      await saveState();
      updateBadge();
    }
  }
}

// ── Alarm listener ─────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== TICK_ALARM) return;
  if (state.status !== 'running') return;

  const now     = Date.now();
  const elapsed = lastTickTime ? Math.round((now - lastTickTime) / 1000) : 1;
  lastTickTime  = now;

  state.remaining = Math.max(0, state.remaining - elapsed);
  updateBadge();
  await saveState();

  if (state.remaining <= 0) {
    await timerFinished();
  }
});

// ── Messages ───────────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    switch (msg.type) {

      case 'GET_STATE':
        sendResponse({ ...state });
        break;

      case 'START':
        if (state.status !== 'running') {
          if (state.remaining <= 0) state.remaining = getDuration(state.mode);
          state.status = 'running';
          startAlarm();
          await saveState();
          updateBadge();
        }
        sendResponse({ ...state });
        break;

      case 'PAUSE':
        if (state.status === 'running') {
          state.status = 'paused';
          stopAlarm();
          await saveState();
          updateBadge();
        }
        sendResponse({ ...state });
        break;

      case 'RESET':
        stopAlarm();
        state.status    = 'stopped';
        state.remaining = getDuration(state.mode);
        await saveState();
        updateBadge();
        sendResponse({ ...state });
        break;

      case 'SET_MODE': {
        const m = msg.mode;
        if (['focus', 'shortBreak', 'longBreak'].includes(m)) {
          stopAlarm();
          state.mode      = m;
          state.status    = 'stopped';
          state.remaining = getDuration(m);
          await saveState();
          updateBadge();
        }
        sendResponse({ ...state });
        break;
      }

      case 'SET_AUTOLOOP':
        state.autoLoop = !!msg.value;
        await chrome.storage.local.set({ autoLoop: state.autoLoop });
        await saveState();
        sendResponse({ ...state });
        break;

      case 'BREAK_SKIP':
        closeBreakTab();
        stopAlarm();
        if (state.autoLoop) {
          state.mode      = 'focus';
          state.status    = 'running';
          state.remaining = getDuration('focus');
          startAlarm();
        } else {
          state.mode      = 'focus';
          state.status    = 'stopped';
          state.remaining = getDuration('focus');
        }
        await saveState();
        updateBadge();
        sendResponse({ ...state });
        break;

      case 'RELOAD_SETTINGS': {
        const data = await chrome.storage.local.get(['settings', 'enabledCategories']);
        if (data.settings) {
          state.settings = { ...DEFAULTS, ...data.settings };
        }
        if (data.enabledCategories) {
          state.settings.enabledCategories = data.enabledCategories;
        }
        if (state.status !== 'running') {
          state.remaining = getDuration(state.mode);
        }
        await saveState();
        updateBadge();
        sendResponse({ ...state });
        break;
      }

      default:
        sendResponse(null);
    }
  })();
  return true;
});

// ── Startup ────────────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(['settings']);
  if (!data.settings) {
    await chrome.storage.local.set({ settings: { ...DEFAULTS } });
  }
  await loadState();
  updateBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  await loadState();
  updateBadge();
  if (state.status === 'running') startAlarm();
});

loadState().then(() => {
  updateBadge();
  if (state.status === 'running') startAlarm();
});