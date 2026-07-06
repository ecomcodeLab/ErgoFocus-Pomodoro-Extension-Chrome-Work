'use strict';

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

// Lädt den kompletten Zustand (Einstellungen + Timer-Status)
async function getFullState() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  const local = await chrome.storage.local.get(['status', 'mode', 'endTime', 'remainingAtPause', 'sessionCount', 'autoLoop']);
  
  return {
    status: local.status || 'stopped',
    mode: local.mode || 'focus',
    endTime: local.endTime || 0,
    remainingAtPause: typeof local.remainingAtPause === 'number' ? local.remainingAtPause : (settings.focusDuration * 60),
    sessionCount: local.sessionCount || 0,
    autoLoop: local.autoLoop || false,
    settings: { ...DEFAULT_SETTINGS, ...settings }
  };
}

// Aktualisiert das Icon Badge ressourcenschonend (liest nur lokales Storage)
async function updateBadge() {
  const local = await chrome.storage.local.get(['status', 'mode', 'endTime', 'remainingAtPause']);
  const status = local.status || 'stopped';
  const mode = local.mode || 'focus';

  if (status !== 'running' && status !== 'paused') {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  let remaining = 0;
  if (status === 'running') {
    remaining = Math.max(0, Math.round(((local.endTime || 0) - Date.now()) / 1000));
  } else {
    remaining = local.remainingAtPause || 0;
  }

  const badgeText = remaining < 60 ? remaining + 's' : Math.ceil(remaining / 60) + 'm';
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({
    color: mode === 'focus' ? '#f97316' : '#22c55e'
  });
}

// Badge Intervall Management (nur aktiv, wenn Timer läuft)
let badgeInterval = null;

function manageBadgeInterval(status) {
  if (status === 'running') {
    if (!badgeInterval) {
      badgeInterval = setInterval(updateBadge, 5000);
    }
  } else {
    if (badgeInterval) {
      clearInterval(badgeInterval);
      badgeInterval = null;
    }
  }
}

// Logik wenn ein Timer abläuft
async function handleTimerFinished() {
  const state = await getFullState();
  await chrome.alarms.clear('timerEnd');
  
  // Sound-Flag für Popup/Breakpage setzen
  await chrome.storage.local.set({ playSoundFlag: Date.now() });

  const lang = state.settings.language || 'de';
  let nextStatus = 'stopped';

  if (state.mode === 'focus') {
    // Wechsel zu Pause
    const newSessionCount = (state.sessionCount || 0) + 1;
    const sessUntil = state.settings.sessionsUntilLongBreak || 4;
    const isLongBreak = (newSessionCount % sessUntil === 0);
    const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
    const breakMins = isLongBreak ? state.settings.longBreakDuration : state.settings.shortBreakDuration;
    const durationMs = breakMins * 60 * 1000;

    await chrome.storage.local.set({
      status: 'running',
      mode: nextMode,
      endTime: Date.now() + durationMs,
      sessionCount: newSessionCount
    });
    nextStatus = 'running';

    if (state.settings.notificationsEnabled) {
      chrome.notifications.create('break_start', {
        type: 'basic', iconUrl: 'assets/icon128.png',
        title: lang === 'en' ? 'Focus done!' : 'Fokus beendet!',
        message: lang === 'en' ? `${breakMins} min break starting.` : `${breakMins} Min. Pause beginnt.`
      });
    }

    chrome.alarms.create('timerEnd', { when: Date.now() + durationMs });
    chrome.tabs.create({ url: chrome.runtime.getURL('break/break.html') });
  } else {
    // Wechsel zu Fokus
    const focusMins = state.settings.focusDuration;
    const focusSecs = focusMins * 60;
    const durationMs = focusMins * 60 * 1000;

    if (state.settings.notificationsEnabled) {
      chrome.notifications.create('focus_start', {
        type: 'basic', iconUrl: 'assets/icon128.png',
        title: lang === 'en' ? 'Break over!' : 'Pause beendet!',
        message: lang === 'en' ? `Time to focus for ${focusMins} minutes.` : `Zeit für ${focusMins} Minuten Fokus.`
      });
    }

    if (state.autoLoop) {
      await chrome.storage.local.set({ status: 'running', mode: 'focus', endTime: Date.now() + durationMs });
      chrome.alarms.create('timerEnd', { when: Date.now() + durationMs });
      nextStatus = 'running';
    } else {
      await chrome.storage.local.set({ status: 'stopped', mode: 'focus', remainingAtPause: focusSecs });
      nextStatus = 'stopped';
    }
  }
  updateBadge();
  manageBadgeInterval(nextStatus);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timerEnd') handleTimerFinished();
});

// Haupt-Nachrichten-Handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Wichtig: Wir nutzen eine asynchrone IIFE, rufen aber sendResponse am Ende IMMER auf.
  (async () => {
    try {
      const state = await getFullState();

      if (msg.type === 'GET_STATE') {
        let currentRemaining = 0;
        if (state.status === 'running') {
          currentRemaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
          if (currentRemaining <= 0) {
            await handleTimerFinished();
            const updated = await getFullState();
            sendResponse(updated);
            return;
          }
        } else {
          currentRemaining = state.remainingAtPause;
        }
        sendResponse({ ...state, remaining: currentRemaining });
      }

      else if (msg.type === 'START') {
        if (state.status === 'running') {
          sendResponse({ ok: false, reason: 'Already running' });
          return;
        }

        let seconds = 0;
        if (state.status === 'paused' && state.remainingAtPause > 0) {
          seconds = state.remainingAtPause;
        } else {
          const mins = state.mode === 'focus' ? state.settings.focusDuration : 
                       (state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
          seconds = mins * 60;
        }

        const endTime = Date.now() + (seconds * 1000);
        await chrome.storage.local.set({ status: 'running', endTime: endTime });
        chrome.alarms.create('timerEnd', { when: endTime });
        updateBadge();
        manageBadgeInterval('running');
        sendResponse({ ok: true });
      }

      else if (msg.type === 'PAUSE') {
        if (state.status !== 'running') {
          sendResponse({ ok: false, reason: 'Not running' });
          return;
        }

        const remaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
        await chrome.storage.local.set({ status: 'paused', remainingAtPause: remaining });
        chrome.alarms.clear('timerEnd');
        updateBadge();
        manageBadgeInterval('paused');
        sendResponse({ ok: true });
      }

      else if (msg.type === 'RESET') {
        chrome.alarms.clearAll();
        const mins = state.mode === 'focus' ? state.settings.focusDuration : 
                     (state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
        await chrome.storage.local.set({ status: 'stopped', remainingAtPause: mins * 60 });
        updateBadge();
        manageBadgeInterval('stopped');
        sendResponse({ ok: true });
      }

      else if (msg.type === 'SET_MODE') {
        if (state.status === 'running') {
          sendResponse({ ok: false });
          return;
        }

        if (state.mode === msg.mode && state.status !== 'stopped') {
          sendResponse({ ok: true });
          return;
        }

        const mins = msg.mode === 'focus' ? state.settings.focusDuration : 
                     (msg.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
        
        chrome.alarms.clearAll();
        await chrome.storage.local.set({ status: 'stopped', mode: msg.mode, remainingAtPause: mins * 60 });
        
        updateBadge();
        manageBadgeInterval('stopped');
        sendResponse({ ok: true });
      }

      else if (msg.type === 'SET_AUTOLOOP') {
        await chrome.storage.local.set({ autoLoop: !!msg.value });
        sendResponse({ ok: true });
      }

      else if (msg.type === 'BREAK_PAGE_SKIP') {
        await handleTimerFinished();
        sendResponse({ ok: true });
      }

      else if (msg.type === 'RELOAD_SETTINGS') {
        const updated = await getFullState();
        sendResponse(updated);
      }
      
      else {
        sendResponse({ error: 'Unknown message type' });
      }
    } catch (err) {
      console.error('Error in background message handler:', err);
      sendResponse({ error: err.message });
    }
  })();

  return true; 
});

// Initialisierung (wird beim Aufwachen des Service Workers gefeuert)
chrome.storage.local.get(['status']).then(data => {
  const currentStatus = data.status || 'stopped';
  updateBadge();
  manageBadgeInterval(currentStatus);
});