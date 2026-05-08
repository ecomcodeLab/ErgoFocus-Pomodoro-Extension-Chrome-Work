'use strict';

const TRANSLATIONS = {
  de: {
    settingsTitle: 'Einstellungen',
    languageTitle: 'Sprache',
    timerTitle: '⏱️ Timer',
    focusLabel: 'Fokuszeit (Minuten)',
    focusHint: 'empfohlen: 20–25 Min für optimale Konzentration',
    shortBreakLabel: 'Kurze Pause (Minuten)',
    shortBreakHint: 'empfohlen: 5 Min nach jeder Fokuseinheit',
    longBreakLabel: 'Lange Pause (Minuten)',
    longBreakHint: 'empfohlen: 15–20 Min nach 4 Einheiten',
    sessionsLabel: 'Einheiten bis lange Pause',
    sessionsHint: 'empfohlen: 4 Einheiten',
    soundTitle: 'Benachrichtigungen',
    soundLabel: 'Ton bei Timer-Ablauf',
    notifLabel: 'Desktop-Benachrichtigungen',
    categoriesTitle: '🏷️ Übungskategorien',
    categoriesHint: 'Wähle, welche Kategorien in der Pause angezeigt werden.',
    catEyes: 'Augen',
    catMental: 'Mental',
    catMovement: 'Bewegung',
    saveBtn: 'Einstellungen speichern',
    savedMsg: 'Einstellungen gespeichert'
  },
  en: {
    settingsTitle: 'Settings',
    languageTitle: 'Language',
    timerTitle: '⏱️ Timer',
    focusLabel: 'Focus duration (minutes)',
    focusHint: 'recommended: 20–25 min for optimal focus',
    shortBreakLabel: 'Short break (minutes)',
    shortBreakHint: 'recommended: 5 min after each focus session',
    longBreakLabel: 'Long break (minutes)',
    longBreakHint: 'recommended: 15–20 min after 4 sessions',
    sessionsLabel: 'Sessions until long break',
    sessionsHint: 'recommended: 4 sessions',
    soundTitle: 'Notifications',
    soundLabel: 'Sound on timer end',
    notifLabel: 'Desktop notifications',
    categoriesTitle: '🏷️ Exercise categories',
    categoriesHint: 'Choose which categories are shown during breaks.',
    catEyes: 'Eyes',
    catMental: 'Mental',
    catMovement: 'Movement',
    saveBtn: 'Save settings',
    savedMsg: 'Settings saved'
  }
};

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

let currentLang = 'de';

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['de'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
}

function setLanguage(lang) {
  currentLang = lang;
  applyTranslations(lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (s) => {
    document.getElementById('focusDuration').value = s.focusDuration;
    document.getElementById('shortBreakDuration').value = s.shortBreakDuration;
    document.getElementById('longBreakDuration').value = s.longBreakDuration;
    document.getElementById('sessionsUntilLongBreak').value = s.sessionsUntilLongBreak;
    document.getElementById('soundEnabled').checked = s.soundEnabled;
    document.getElementById('notificationsEnabled').checked = !!s.notificationsEnabled;

    const lang = s.language || 'de';
    setLanguage(lang);

    const enabled = Array.isArray(s.enabledCategories)
      ? s.enabledCategories
      : DEFAULT_SETTINGS.enabledCategories;

    document.querySelectorAll('.category-card').forEach(card => {
      const cat = card.getAttribute('data-category');
      card.classList.toggle('active', enabled.includes(cat));
    });
  });
}

function saveSettings() {
  const focusDuration        = Math.min(60,  Math.max(1, parseInt(document.getElementById('focusDuration').value, 10) || 20));
  const shortBreakDuration   = Math.min(30,  Math.max(1, parseInt(document.getElementById('shortBreakDuration').value, 10) || 5));
  const longBreakDuration    = Math.min(60,  Math.max(1, parseInt(document.getElementById('longBreakDuration').value, 10) || 15));
  const sessionsUntilLongBreak = Math.min(12, Math.max(1, parseInt(document.getElementById('sessionsUntilLongBreak').value, 10) || 4));
  const soundEnabled         = document.getElementById('soundEnabled').checked;
  const notificationsEnabled = document.getElementById('notificationsEnabled').checked;

  const enabledCategories = [];
  document.querySelectorAll('.category-card.active').forEach(card => {
    enabledCategories.push(card.getAttribute('data-category'));
  });

  const settings = {
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsUntilLongBreak,
    soundEnabled,
    notificationsEnabled,
    language: currentLang,
    enabledCategories
  };

  chrome.storage.sync.set(settings, () => {
    chrome.runtime.sendMessage({ type: 'RELOAD_SETTINGS' });
    showSaved();
  });
}

function showSaved() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['de'];
  const el = document.getElementById('saveStatus');
  el.textContent = t.savedMsg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  // Category cards toggle
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });

  // Save button
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
});