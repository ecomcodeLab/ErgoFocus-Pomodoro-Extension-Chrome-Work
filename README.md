# ErgoFocus – Pomodoro & Health Timer

**ErgoFocus** ist eine Browser-Extension für Google Chrome, die den Pomodoro-Timer mit ergonomischen Pausen-Übungen verbindet. Sie hilft Bildschirmarbeitern dabei, produktiv zu bleiben und gleichzeitig auf ihre Gesundheit zu achten – komplett offline, ohne Tracking.

<img width="293" height="407" alt="Image" src="https://github.com/user-attachments/assets/1424efd4-506d-481e-b0de-fa5138e5bf03" />

---

## Was macht ErgoFocus?

- **Pomodoro-Timer** – Fokuszeit und Pausen laufen automatisch im Hintergrund, auch wenn du einen anderen Tab geöffnet hast.
- **Gesundheits-Pausen** – Beim Start jeder Pause erscheint ein eigener Bildschirm mit konkreten Übungen für Augen, Schultern, Atmung und Bewegung.
- **Auto-Loop** – Optional laufen Fokus und Pause endlos abwechselnd, bis du den Schalter ausstellst.
- **Anpassbar** – Du entscheidest, wie lange Fokus und Pausen dauern und welche Übungskategorien dir angezeigt werden.
- **100 % privat** – Keine Cloud, keine Server, keine Tracker. Alle Daten bleiben lokal auf deinem Gerät.

---

## Installation in Google Chrome (manuell)

Da die Extension noch nicht im Chrome Web Store verfügbar ist, kannst du sie so direkt installieren:

**Schritt 1 – Dateien herunterladen**

Lade den Projekt-Ordner herunter oder klone das Repository auf deinen Computer.

**Schritt 2 – Entwicklermodus aktivieren**

Öffne Chrome und gib in die Adresszeile ein:
```
chrome://extensions
```
Aktiviere oben rechts den Schalter **"Entwicklermodus"**.

**Schritt 3 – Extension laden**

Klicke auf **"Entpackte Erweiterung laden"** und wähle den Ordner aus, in dem sich die Datei `manifest.json` befindet.

**Schritt 4 – Icon in der Toolbar anpinnen**

Klicke auf das Puzzle-Symbol in der Chrome-Toolbar, suche **ErgoFocus** und klicke auf das Pin-Symbol, damit das Icon immer sichtbar ist.

**Fertig.** ErgoFocus läuft jetzt in deinem Browser.

---

## Übungen erweitern

Die Übungsdatenbank liegt in `data/exercises.js`. Um eine neue Übung hinzuzufügen, kopiere einfach ein vorhandenes Objekt und passe die Felder an:

```js
{
  category:    'movement',        // eyes | ergonomics | mental | movement
  category_label: 'Bewegung',    // Anzeigename Deutsch
  category_en: 'Movement',       // Anzeigename Englisch
  emoji: '🚶',
  title:    'Neue Übung',
  title_en: 'New Exercise',
  desc:    'Beschreibung auf Deutsch.',
  desc_en: 'Description in English.'
}
```

---

Erstellt von [ecomcodeLab](https://github.com/ecomcodeLab)