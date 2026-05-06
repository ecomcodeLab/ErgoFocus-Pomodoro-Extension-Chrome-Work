# ErgoFocus – Pomodoro & Health Timer

**ErgoFocus** ist eine Browser-Extension für Google Chrome, die den Pomodoro-Timer mit ergonomischen Pausen-Übungen verbindet. Sie hilft Bildschirmarbeitern dabei, produktiv zu bleiben und gleichzeitig auf ihre Gesundheit zu achten – komplett offline, ohne Tracking.

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

## Erweiterung für den Chrome Web Store vorbereiten

Wenn du die Extension veröffentlichen möchtest:

1. Erstelle PNG-Icons in den Größen **16×16**, **48×48** und **128×128** und lege sie im Ordner `assets/` ab (`icon16.png`, `icon48.png`, `icon128.png`).
2. Komprimiere den gesamten Projekt-Ordner als `.zip`-Datei (ohne übergeordnete Ordner).
3. Erstelle ein Entwickler-Konto auf [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole) (einmalig 5 USD Gebühr).
4. Lade das `.zip`-Paket hoch, füge Screenshots und eine Beschreibung hinzu.
5. Reiche die Extension zur Prüfung ein (Bearbeitungszeit: 1–3 Werktage).

---

## Übungen erweitern

Die Übungsdatenbank liegt in `data/exercises.js`. Um eine neue Übung hinzuzufügen, kopiere einfach ein vorhandenes Objekt und passe die Felder an:

```js
{
  category:    'movement',        // eyes | ergonomics | mental | movement
  category_label: 'Bewegung',    // Anzeigename Deutsch
  category_en: 'Movement',       // Anzeigename Englisch
  emoji: '🚴',
  title:    'Neue Übung',
  title_en: 'New Exercise',
  desc:    'Beschreibung auf Deutsch.',
  desc_en: 'Description in English.'
}
```

---

Erstellt von [ecomcodeLab](https://github.com/ecomcodeLab)