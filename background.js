'use strict';

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  language: 'de',
  categories: { eyes: true, movement: true, mental: true }
};

const DEFAULT_STATE = {
  mode: 'focus',
  status: 'stopped',
  remaining: DEFAULT_SETTINGS.focusDuration * 60,
  sessionCount: 0,
  autoLoop: false,
  settings: DEFAULT_SETTINGS
};

let state = null;

async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['pomodoroState', 'pomodoroSettings'], (data) => {
      const savedSettings = data.pomodoroSettings
        ? { ...DEFAULT_SETTINGS, ...data.pomodoroSettings }
        : { ...DEFAULT_SETTINGS };

      if (data.pomodoroState) {
        state = {
          ...DEFAULT_STATE,
          ...data.pomodoroState,
          settings: savedSettings
        };
        if (state.status === 'running') {
          // If SW was killed and timer was running, set to paused to avoid desync
          state.status = 'paused';
        }
      } else {
        state = {
          ...DEFAULT_STATE,
          settings: savedSettings,
          remaining: savedSettings.focusDuration * 60
        };
      }
      resolve(state);
    });
  });
}

async function saveState() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ pomodoroState: { ...state, settings: undefined } }, resolve);
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ pomodoroSettings: settings }, resolve);
  });
}

function getModeDuration(mode, settings) {
  if (mode === 'focus') return (settings.focusDuration || DEFAULT_SETTINGS.focusDuration) * 60;
  if (mode === 'shortBreak') return (settings.shortBreakDuration || DEFAULT_SETTINGS.shortBreakDuration) * 60;
  if (mode === 'longBreak') return (settings.longBreakDuration || DEFAULT_SETTINGS.longBreakDuration) * 60;
  return DEFAULT_SETTINGS.focusDuration * 60;
}

function playChime() {
  if (!state || !state.settings.soundEnabled) return;
  // Sound is played in popup/break pages via Web Audio API
}

function sendNotification(title, message) {
  if (!state || !state.settings.notificationsEnabled) return;
  chrome.notifications.create(String(Date.now()), { // Unique ID for each notification
    type: 'basic',
    iconUrl: '../assets/icon128.png',
    title,
    message
  });
}

function setBadge(remaining, mode) {
  const minutes = Math.ceil(remaining / 60);
  const text = minutes > 0 ? String(minutes) : '0';
  const color = mode === 'focus' ? '#f97316' : mode === 'longBreak' ? '#3b82f6' : '#22c55e';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

async function openBreakPage(mode) {
  const tabs = await chrome.tabs.query({ url: chrome.runtime.getURL('break/break.html') });
  if (tabs.length === 0) {
    await chrome.tabs.create({ url: chrome.runtime.getURL('break/break.html'), active: true });
  } else {
    // If break page already open, just activate it
    await chrome.tabs.update(tabs[0].id, { active: true });
  }
}

async function timerFinished() {
  if (!state) return;

  const prevMode = state.mode;

  if (prevMode === 'focus') {
    // Increment session count ONLY when a focus session finishes
    state.sessionCount = (state.sessionCount || 0) + 1;

    const sessionsUntilLong = state.settings.sessionsUntilLongBreak || DEFAULT_SETTINGS.sessionsUntilLongBreak;
    const nextMode = (state.sessionCount % sessionsUntilLong === 0) ? 'longBreak' : 'shortBreak';

    state.mode = nextMode;
    state.remaining = getModeDuration(nextMode, state.settings);
    state.status = 'running'; // Break starts running automatically

    const lang = state.settings.language || 'de';
    const title = lang === 'en' ? 'Break Time!' : 'Pausenzeit!';
    const msg = nextMode === 'longBreak'
      ? (lang === 'en' ? `Long break! Session ${state.sessionCount} complete.` : `Lange Pause! Session ${state.sessionCount} abgeschlossen.`)
      : (lang === 'en' ? 'Short break time!' : 'Kurze Pause!');

    sendNotification(title, msg);
    await saveState();
    await scheduleAlarm();
    await openBreakPage(nextMode);

  } else { // Break finished (shortBreak or longBreak)
    // Break finished → go back to focus
    state.mode = 'focus';
    state.remaining = getModeDuration('focus', state.settings);

    if (state.autoLoop) {
      state.status = 'running';
      const lang = state.settings.language || 'de';
      sendNotification(
        lang === 'en' ? 'Focus Time!' : 'Fokuszeit!',
        lang === 'en' ? 'Break over. Focus again!' : 'Pause vorbei. Wieder fokussieren!'
      );
      await saveState();
      await scheduleAlarm();
    } else {
      state.status = 'stopped';
      await saveState();
    }
  }
}

async function scheduleAlarm() {
  await chrome.alarms.clear('pomodoroTick');
  if (state && state.status === 'running' && state.remaining > 0) {
    chrome.alarms.create('pomodoroTick', { periodInMinutes: 1 / 60 });
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'pomodoroTick') return;
  if (!state) {
    await loadState();
  }
  if (!state || state.status !== 'running') {
    await chrome.alarms.clear('pomodoroTick');
    return;
  }
  state.remaining = Math.max(0, state.remaining - 1);
  setBadge(state.remaining, state.mode);
  await saveState();

  if (state.remaining <= 0) {
    await chrome.alarms.clear('pomodoroTick');
    await timerFinished();
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (!state) await loadState();

    switch (msg.type) {
      case 'GET_STATE':
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;

      case 'START':
        if (state.status !== 'running') {
          state.status = 'running';
          if (state.remaining <= 0) {
            state.remaining = getModeDuration(state.mode, state.settings);
          }
          await saveState();
          await scheduleAlarm();
        }
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;

      case 'PAUSE':
        if (state.status === 'running') {
          state.status = 'paused';
          await chrome.alarms.clear('pomodoroTick');
          await saveState();
        }
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;

      case 'RESET':
        await chrome.alarms.clear('pomodoroTick');
        state.status = 'stopped';
        state.sessionCount = 0; // Reset session count on full reset
        state.remaining = getModeDuration(state.mode, state.settings);
        await saveState();
        setBadge(state.remaining, state.mode);
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;

      case 'SET_MODE': {
        const newMode = msg.mode;
        if (['focus', 'shortBreak', 'longBreak'].includes(newMode)) {
          await chrome.alarms.clear('pomodoroTick');
          state.mode = newMode;
          state.status = 'stopped';
          state.remaining = getModeDuration(newMode, state.settings);
          await saveState();
          setBadge(state.remaining, newMode);
        }
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;
      }

      case 'SET_AUTOLOOP':
        state.autoLoop = !!msg.value;
        await saveState();
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;

      case 'UPDATE_SETTINGS': {
        const newSettings = { ...DEFAULT_SETTINGS, ...msg.settings };
        state.settings = newSettings;
        await saveSettings(newSettings);
        // Update remaining if timer is stopped or mode changed
        if (state.status === 'stopped' || state.mode !== msg.settings.mode) { // Added mode check
          state.remaining = getModeDuration(state.mode, newSettings);
        }
        await saveState();
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;
      }

      case 'BREAK_PAGE_DONE':
      case 'BREAK_PAGE_SKIP': {
        await chrome.alarms.clear('pomodoroTick');
        // If break was skipped/done, and autoLoop is off, set status to stopped
        if (!state.autoLoop) {
          state.status = 'stopped';
        }
        state.mode = 'focus';
        state.remaining = getModeDuration('focus', state.settings);

        if (state.autoLoop) {
          state.status = 'running';
          const lang = state.settings.language || 'de';
          sendNotification(
            lang === 'en' ? 'Focus Time!' : 'Fokuszeit!',
            lang === 'en' ? 'Break over. Focus again!' : 'Pause vorbei. Wieder fokussieren!'
          );
          await saveState();
          await scheduleAlarm();
        } else {
          state.status = 'stopped'; // Ensure it's stopped if autoLoop is off
          await saveState();
        }
        sendResponse({ ...state, total: getModeDuration(state.mode, state.settings) });
        break;
      }

      default:
        sendResponse({});
    }
  })();
  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  await loadState();
  if (state) setBadge(state.remaining, state.mode);
});

chrome.runtime.onStartup.addListener(async () => {
  await loadState();
  if (state) setBadge(state.remaining, state.mode);
});

// Init on service worker start
loadState().then(() => {
  if (state) setBadge(state.remaining, state.mode);
});