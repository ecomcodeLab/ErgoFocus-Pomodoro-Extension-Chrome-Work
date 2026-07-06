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
    remainingAtPause: local.remainingAtPause || (settings.focusDuration * 60),
    sessionCount: local.sessionCount || 0,
    autoLoop: local.autoLoop || false,
    settings: { ...DEFAULT_SETTINGS, ...settings }
  };
}

// Aktualisiert das Icon Badge
async function updateBadge() {
  const state = await getFullState();
  if (state.status !== 'running' && state.status !== 'paused') {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  let remaining = 0;
  if (state.status === 'running') {
    remaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
  } else {
    remaining = state.remainingAtPause;
  }

  const badgeText = remaining < 60 ? remaining + 's' : Math.ceil(remaining / 60) + 'm';
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({
    color: state.mode === 'focus' ? '#f97316' : '#22c55e'
  });
}

// Logik wenn ein Timer abläuft
async function handleTimerFinished() {
  const state = await getFullState();
  await chrome.alarms.clear('timerEnd');
  
  // Sound-Flag für Popup/Breakpage setzen
  await chrome.storage.local.set({ playSoundFlag: Date.now() });

  const lang = state.settings.language || 'de';

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
    } else {
      await chrome.storage.local.set({ status: 'stopped', mode: 'focus', remainingAtPause: focusSecs });
    }
  }
  updateBadge();
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
        sendResponse({ ok: true });
      }

      else if (msg.type === 'PAUSE') {
        const remaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
        await chrome.storage.local.set({ status: 'paused', remainingAtPause: remaining });
        chrome.alarms.clear('timerEnd');
        updateBadge();
        sendResponse({ ok: true });
      }

      else if (msg.type === 'RESET') {
        chrome.alarms.clearAll();
        const resetRemaining = state.settings.focusDuration * 60;
        await chrome.storage.local.set({ status: 'stopped', mode: 'focus', remainingAtPause: resetRemaining });
        updateBadge();
        sendResponse({ ok: true });
      }

      else if (msg.type === 'SET_MODE') {
        chrome.alarms.clearAll();
        const mins = msg.mode === 'focus' ? state.settings.focusDuration : 
                     (msg.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration);
        await chrome.storage.local.set({ status: 'stopped', mode: msg.mode, remainingAtPause: mins * 60 });
        updateBadge();
        sendResponse({ ok: true });
      }

      else if (msg.type === 'SET_AUTOLOOP') {
        await chrome.storage.local.set({ autoLoop: !!msg.value });
        sendResponse({ ok: true });
      }

      else if (msg.type === 'BREAK_PAGE_SKIP') {
        await handleTimerFinished(); // Simuliert Ablauf der Pause
        sendResponse({ ok: true });
      }

      else if (msg.type === 'RELOAD_SETTINGS') {
        const updated = await getFullState();
        sendResponse(updated);
      }
      
      else {
        // Fallback für unbekannte Nachrichten
        sendResponse({ error: 'Unknown message type' });
      }
    } catch (err) {
      console.error('Error in background message handler:', err);
      sendResponse({ error: err.message });
    }
  })();

  return true; // Ermöglicht asynchrones sendResponse
});

// Initialisierung
updateBadge();