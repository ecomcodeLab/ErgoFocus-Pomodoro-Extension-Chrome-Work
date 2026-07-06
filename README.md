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

## 🚀 How to Install from GitHub (Developer Mode)

Since the extension is not yet available in the Chrome Web Store, you can easily install it directly from this GitHub repository using Chrome's Developer Mode:

**Step 1 – Download the Code**
- Click the green **"<> Code"** button at the top of this GitHub repository.
- Select **"Download ZIP"** and extract the downloaded folder on your computer. 
- *(Alternatively, you can clone the repository via Git: `git clone <repository-url>`)*

**Step 2 – Open Chrome Extensions**
- Open Google Chrome.
- Type `chrome://extensions/` into the address bar and press Enter.

**Step 3 – Enable Developer Mode**
- In the top right corner of the Extensions page, toggle the switch for **"Developer mode"** to the **ON** position.

**Step 4 – Load the Extension**
- Click the **"Load unpacked"** button that appeared in the top left.
- Select the extracted folder (the one containing the `manifest.json` file).

**Step 5 – Pin the Extension**
- Click the puzzle icon 🧩 in the Chrome toolbar (top right).
- Find **ErgoFocus** in the list and click the **Pin** 📌 icon so it stays visible.

**Done!** Click the ErgoFocus icon to start your first session.

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
---

# ErgoFocus – Pomodoro & Health Timer (Deutsch)

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

## 🚀 Installation via GitHub (Entwicklermodus)

Da die Extension noch nicht im Chrome Web Store verfügbar ist, kannst du sie in wenigen Sekunden direkt aus diesem GitHub-Repository installieren:

**Schritt 1 – Code herunterladen**
- Klicke oben in diesem GitHub-Repository auf den grünen Button **"<> Code"**.
- Wähle **"Download ZIP"** und entpacke den heruntergeladenen Ordner auf deinem Computer.
- *(Alternativ kannst du das Repository klonen: `git clone <repository-url>`)*

**Schritt 2 – Chrome Erweiterungen öffnen**
- Öffne Google Chrome.
- Gib `chrome://extensions/` in die Adresszeile ein und drücke Enter.

**Schritt 3 – Entwicklermodus aktivieren**
- Aktiviere oben rechts auf der Seite den Schalter für den **"Entwicklermodus"** (Developer mode).

**Schritt 4 – Erweiterung laden**
- Klicke oben links auf den neuen Button **"Entpackte Erweiterung laden"** (Load unpacked).
- Wähle den entpackten Projektordner aus (der Ordner, in dem sich die Datei `manifest.json` befindet).

**Schritt 5 – Icon anpinnen**
- Klicke auf das Puzzle-Symbol 🧩 in der Chrome-Toolbar (oben rechts).
- Suche **ErgoFocus** in der Liste und klicke auf das **Pin-Symbol** 📌, damit das Icon immer sichtbar bleibt.

**Fertig!** Klicke auf das ErgoFocus-Icon, um deine erste Fokus-Session zu starten.

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