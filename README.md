# ErgoFocus – Pomodoro & Health Timer

**ErgoFocus** is a browser extension for Google Chrome that combines the Pomodoro timer with ergonomic break exercises. It helps screen workers stay productive while taking care of their health – completely offline, with no tracking.

**Supports German (DE) and English (EN) languages.**

<img width="293" height="407" alt="Image" src="https://github.com/user-attachments/assets/1424efd4-506d-481e-b0de-fa5138e5bf03" />

---

## What does ErgoFocus do?

-   **Pomodoro Timer** – Focus time and breaks run automatically in the background, even if you have another tab open.
-   **Health Breaks** – At the start of each break, a dedicated screen appears with specific exercises for eyes, shoulders, breathing, and movement.
-   **Auto-Loop** – Optionally, focus and break sessions alternate endlessly until you turn off the switch.
-   **Customizable** – You decide how long focus and break times last and which exercise categories are displayed.
-   **100% Private** – No cloud, no servers, no trackers. All data remains local on your device.

---

## Manual Installation in Google Chrome

Since the extension is not yet available in the Chrome Web Store, you can install it directly:

**Step 1 – Download the files**

Download the project folder or clone the repository to your computer.

**Step 2 – Enable Developer Mode**

Open Chrome and enter the following in the address bar:
```
chrome://extensions
```
Turn on the **"Developer mode"** switch in the top right.

**Step 3 – Load the extension**

Click on **"Load unpacked"** and select the folder containing the `manifest.json` file.

**Step 4 – Pin the icon to the toolbar**

Click on the puzzle icon in the Chrome toolbar, find **ErgoFocus**, and click the pin icon to keep the icon visible.

**Done.** ErgoFocus is now running in your browser.

---

## Extending Exercises

The exercise database is located in `data/exercises.js`. To add a new exercise, simply copy an existing object and adjust the fields:

```js
{
  category:    'movement',        // eyes | ergonomics | mental | movement
  emoji: '🚶',
  de: { title: 'Neue Übung', text: 'Beschreibung auf Deutsch.' },
  en: { title: 'New Exercise', text: 'Description in English.' }
}
```

---

Created by [ecomcodeLab](https://github.com/ecomcodeLab)

---

# ErgoFocus – Pomodoro & Health Timer

**ErgoFocus** ist eine Browser-Extension für Google Chrome, die den Pomodoro-Timer mit ergonomischen Pausen-Übungen verbindet. Sie hilft Bildschirmarbeitern dabei, produktiv zu bleiben und gleichzeitig auf ihre Gesundheit zu achten – komplett offline, ohne Tracking.

<img width="293" height="407" alt="Image" src="https://github.com/user-attachments/assets/1424efd4-506d-481e-b0de-fa5138e5bf03" />

---

## Was macht ErgoFocus?

-   **Pomodoro-Timer** – Fokuszeit und Pausen laufen automatisch im Hintergrund, auch wenn du einen anderen Tab geöffnet hast.
-   **Gesundheits-Pausen** – Beim Start jeder Pause erscheint ein eigener Bildschirm mit konkreten Übungen für Augen, Schultern, Atmung und Bewegung.
-   **Auto-Loop** – Optional laufen Fokus und Pause endlos abwechselnd, bis du den Schalter ausstellst.
-   **Anpassbar** – Du entscheidest, wie lange Fokus und Pausen dauern und welche Übungskategorien dir angezeigt werden.
-   **100 % privat** – Keine Cloud, keine Server, keine Tracker. Alle Daten bleiben lokal auf deinem Gerät.

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
  emoji: '🚶',
  de: { title: 'Neue Übung', text: 'Beschreibung auf Deutsch.' },
  en: { title: 'New Exercise', text: 'Description in English.' }
}
```

---

Erstellt von [ecomcodeLab](https://github.com/ecomcodeLab)