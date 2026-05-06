'use strict';

const TRANSLATIONS = {
  de: {
    headerSubtitle: 'Einstellungen',
    langTitle: '🌐 Sprache',
    langLabel: 'Sprache',
    timerTitle: '⏱️ Timer',
    focusLabel: 'Fokuszeit',
    focusHint: '(gesund: 25–50 Min)',
    shortBreakLabel: 'Kurze Pause',
    shortBreakHint: '(gesund: 5–10 Min)',
    longBreakLabel: 'Lange Pause',
    longBreakHint: '(gesund: 15–30 Min)',
    sessionsLabel: 'Einheiten bis lange Pause',
    sessionsHint: '(empfohlen: 4 Einheiten)',
    notifTitle: '🔔 Benachrichtigungen',
    soundLabel: 'Ton bei Timer-Ablauf',
    notifLabel: 'Desktop-Benachrichtigungen',
    catTitle: '🏷️ Übungskategorien',
    catDesc: 'Wähle, welche Kategorien in der Pause angezeigt werden.',
    catEyesLabel: 'Augen',
    catMovementLabel: 'Bewegung',
    catMentalLabel: 'Mental',
    saveBtnText: 'Einstellungen speichern',
    savedMsg: '✅ Gespeichert!'
  },
  en: {
    headerSubtitle: 'Settings',
    langTitle: '🌐 Language',
    langLabel: 'Language',
    timerTitle: '⏱️ Timer',
    focusLabel: 'Focus Time',
    focusHint: '(healthy: 25–50 min)',
    shortBreakLabel: 'Short Break',
    shortBreakHint: '(healthy: 5–10 min)',
    longBreakLabel: 'Long Break',
    longBreakHint: '(healthy: 15–30 min)',
    sessionsLabel: 'Sessions until long break',
    sessionsHint: '(recommended: 4 sessions)',
    notifTitle: '🔔 Notifications',
    soundLabel: 'Sound on timer end',
    notifLabel: 'Desktop notifications',
    catTitle: '🏷️ Exercise Categories',
    catDesc: 'Choose which categories to show during breaks.',
    catEyesLabel: 'Eyes',
    catMovementLabel: 'Movement',
    catMentalLabel: 'Mental',
    saveBtnText: 'Save settings',
    savedMsg: '✅ Saved!'
  }
};

let currentLang = 'de';

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['de'];
  const ids = [
    'headerSubtitle','langTitle','langLabel','timerTitle',
    'focusLabel','focusHint','shortBreakLabel','shortBreakHint',
    'longBreakLabel','longBreakHint','sessionsLabel','sessionsHint',
    'notifTitle','soundLabel','notifLabel',
    'catTitle','catDesc','catEyesLabel','catMovementLabel','catMentalLabel',
    'saveBtnText'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && t[id] !== undefined) el.textContent = t[id];
  });

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function loadSettings() {
  chrome.storage.local.get(['pomodoroSettings'], (data) => {
    const s = data.pomodoroSettings || {};

    document.getElementById('focusDuration').value        = s.focusDuration        ?? 25;
    document.getElementById('shortBreakDuration').value   = s.shortBreakDuration   ?? 5;
    document.getElementById('longBreakDuration').value    = s.longBreakDuration    ?? 15;
    document.getElementById('sessionsUntilLongBreak').value = s.sessionsUntilLongBreak ?? 4;
    document.getElementById('soundEnabled').checked       = s.soundEnabled         ?? true;
    document.getElementById('notificationsEnabled').checked = s.notificationsEnabled ?? true;

    const cats = s.categories || { eyes: true, movement: true, mental: true };
    document.getElementById('catEyesToggle').checked     = cats.eyes    ?? true;
    document.getElementById('catMovementToggle').checked = cats.movement ?? true;
    document.getElementById('catMentalToggle').checked   = cats.mental  ?? true;

    currentLang = s.language || 'de';
    applyTranslations(currentLang);
  });
}

function saveSettings() {
  const focusDuration        = parseInt(document.getElementById('focusDuration')?.value, 10)        || 25;
  const shortBreakDuration   = parseInt(document.getElementById('shortBreakDuration')?.value, 10)   || 5;
  const longBreakDuration    = parseInt(document.getElementById('longBreakDuration')?.value, 10)    || 15;
  const sessionsUntilLongBreak = parseInt(document.getElementById('sessionsUntilLongBreak')?.value, 10) || 4;
  const soundEnabled         = document.getElementById('soundEnabled')?.checked ?? true;
  const notificationsEnabled = document.getElementById('notificationsEnabled')?.checked ?? true;

  const cats = {
    eyes:     document.getElementById('catEyesToggle')?.checked     ?? true,
    movement: document.getElementById('catMovementToggle')?.checked ?? true,
    mental:   document.getElementById('catMentalToggle')?.checked   ?? true
  };

  const settings = {
    focusDuration:        Math.max(1, Math.min(90, focusDuration)),
    shortBreakDuration:   Math.max(1, Math.min(30, shortBreakDuration)),
    longBreakDuration:    Math.max(1, Math.min(60, longBreakDuration)),
    sessionsUntilLongBreak: Math.max(1, Math.min(10, sessionsUntilLongBreak)),
    soundEnabled,
    notificationsEnabled,
    language:   currentLang,
    categories: cats
  };

  chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error sending UPDATE_SETTINGS message:', chrome.runtime.lastError.message);
      const status = document.getElementById('saveStatus');
      if (status) {
        status.textContent = '❌ Fehler beim Speichern!';
        status.style.color = 'red';
        setTimeout(() => { status.textContent = ''; status.style.color = ''; }, 3000);
      }
      return;
    }
    const status = document.getElementById('saveStatus');
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS['de'];
    if (status) {
      status.textContent = t.savedMsg;
      status.style.color = 'var(--green)';
      setTimeout(() => { status.textContent = ''; status.style.color = ''; }, 2500);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      applyTranslations(currentLang);
      // No need to save settings here, only when save button is clicked
    });
  });

  // Category card click toggles checkbox
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (event) => {
      // Prevent toggling if the click originated from the toggle-switch itself
      if (event.target.closest('.toggle-switch')) {
        return;
      }
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        // No need to save settings here, only when save button is clicked
      }
    });
  });

  // Save button
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);
});