// ErgoFocus Exercise Database
// Categories: eyes | mental | movement
// Each exercise has DE and EN versions

const EXERCISES = [
  // ─── AUGEN / EYES ───────────────────────────────────────────
  {
    category: 'eyes',
    emoji: '👁️',
    de: { title: 'Augen-Erholung', text: '20-20-20-Regel: Schau 20 Sekunden auf einen Punkt ca. 6 Meter entfernt.' },
    en: { title: 'Eye Relief', text: '20-20-20 rule: Look at something 20 feet away for 20 seconds.' }
  },
  {
    category: 'eyes',
    emoji: '👁️',
    de: { title: 'Augenkreisen', text: 'Schließe die Augen, rolle sie 5× im und 5× gegen den Uhrzeigersinn.' },
    en: { title: 'Eye Circles', text: 'Close your eyes and roll them 5× clockwise and 5× counter-clockwise.' }
  },
  {
    category: 'eyes',
    emoji: '👁️',
    de: { title: 'Daumen-Fokus', text: 'Halte den Daumen 25 cm vor dein Gesicht. Wechsle den Fokus zwischen Daumen und Ferne – 3–5 Mal.' },
    en: { title: 'Thumb Focus', text: 'Hold your thumb 10 inches from your face. Alternate focus between thumb and distance – 3–5 times.' }
  },
  {
    category: 'eyes',
    emoji: '👁️',
    de: { title: 'Augen in alle Richtungen', text: 'Schließe die Augen und rolle sie langsam nach oben, unten, links und rechts. 3 Wiederholungen.' },
    en: { title: 'Eye Directions', text: 'Close your eyes and slowly roll them up, down, left, and right. 3 repetitions.' }
  },

  // ─── MENTAL ─────────────────────────────────────────────────
  {
    category: 'mental',
    emoji: '🧘',
    de: { title: 'Box-Breathing', text: '4 Sek. einatmen · 4 halten · 4 ausatmen · 4 halten. 3–4 Runden.' },
    en: { title: 'Box Breathing', text: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. 3–4 rounds.' }
  },
  {
    category: 'mental',
    emoji: '🧠',
    de: { title: 'Kurze Achtsamkeit', text: 'Schließe die Augen, konzentriere dich 60 Sekunden lang nur auf deinen Atem.' },
    en: { title: 'Short Mindfulness', text: 'Close your eyes and focus only on your breath for 60 seconds.' }
  },
  {
    category: 'mental',
    emoji: '🧠',
    de: { title: 'Progressive Entspannung', text: 'Spanne Fäuste 5 Sek. an, loslassen – dann Schultern 5 Sek. anspannen, loslassen.' },
    en: { title: 'Progressive Relaxation', text: 'Tense your fists for 5s, release – then shoulders for 5s, release.' }
  },
  {
    category: 'mental',
    emoji: '☁️',
    de: { title: 'Gedanken beobachten', text: 'Beobachte deine Gedanken 30–60 Sek. ohne Bewertung. Stell dir vor, sie ziehen wie Wolken vorbei.' },
    en: { title: 'Thought Observation', text: 'Observe your thoughts for 30–60s without judgment. Imagine them passing like clouds.' }
  },
  {
    category: 'mental',
    emoji: '🌄',
    de: { title: 'Kurze Visualisierung', text: 'Schließe die Augen, stell dir einen Ort vor, an dem du dich vollkommen wohlfühlst – 30–60 Sek.' },
    en: { title: 'Short Visualization', text: 'Close your eyes, imagine a place where you feel completely at ease – 30–60 seconds.' }
  },

  // ─── BEWEGUNG / MOVEMENT ────────────────────────────────────
  {
    category: 'movement',
    emoji: '💧',
    de: { title: 'Wasser-Break', text: 'Steh auf, hol dir ein großes Glas Wasser und trink es vollständig aus.' },
    en: { title: 'Water Break', text: 'Stand up, get a large glass of water and drink it completely.' }
  },
  {
    category: 'movement',
    emoji: '🚶',
    de: { title: 'Mini-Walk', text: 'Gehe einmal durch deine Wohnung oder dein Büro – lockere Beine und Geist.' },
    en: { title: 'Mini Walk', text: 'Walk through your home or office once – loosen your legs and mind.' }
  },
  {
    category: 'movement',
    emoji: '🤸',
    de: { title: 'Schulter-Reset', text: 'Schultern zu den Ohren ziehen, 3 Sek. halten, fallen lassen. 5× wiederholen.' },
    en: { title: 'Shoulder Reset', text: 'Pull shoulders to ears, hold 3s, let go. Repeat 5 times.' }
  },
  {
    category: 'movement',
    emoji: '🤸',
    de: { title: 'Brust-Öffner', text: 'Hände hinter dem Rücken verschränken, Brustbein zur Decke ziehen. 15 Sek. halten.' },
    en: { title: 'Chest Opener', text: 'Clasp hands behind your back, lift your chest toward the ceiling. Hold 15 seconds.' }
  },
  {
    category: 'movement',
    emoji: '🤸',
    de: { title: 'Schulterblatt-Squeeze', text: 'Schulterblätter zusammenziehen (Bleistift dazwischen), 5 Sek. halten. 5–8 Wiederholungen.' },
    en: { title: 'Shoulder Blade Squeeze', text: 'Squeeze shoulder blades together, hold 5s. 5–8 repetitions.' }
  },
  {
    category: 'movement',
    emoji: '🤲',
    de: { title: 'Handgelenk-Stretch', text: 'Arm ausstrecken, Finger nach unten ziehen (15 Sek.), dann nach oben drücken (15 Sek.). Beide Hände.' },
    en: { title: 'Wrist Stretch', text: 'Extend arm, pull fingers down (15s), then push up (15s). Both hands.' }
  },
  {
    category: 'movement',
    emoji: '🖐️',
    de: { title: 'Finger-Stretch', text: 'Finger spreizen so weit wie möglich, dann Faust machen. 10× wiederholen.' },
    en: { title: 'Finger Stretch', text: 'Spread fingers as wide as possible, then make a fist. Repeat 10 times.' }
  },
  {
    category: 'movement',
    emoji: '🧍',
    de: { title: 'Katze-Kuh im Sitzen', text: 'Hände auf Knien – einatmen: Rücken beugen, Schultern zurück. Ausatmen: Rücken runden, Kinn zur Brust. 5–10×.' },
    en: { title: 'Seated Cat-Cow', text: 'Hands on knees – inhale: arch back, pull shoulders back. Exhale: round back, chin to chest. 5–10×.' }
  },
  {
    category: 'movement',
    emoji: '🏃',
    de: { title: 'Marschieren auf der Stelle', text: 'Marschiere 90 Sek. auf der Stelle und schwinge die Arme kräftig mit.' },
    en: { title: 'March in Place', text: 'March in place for 90 seconds, swinging your arms vigorously.' }
  },
  {
    category: 'movement',
    emoji: '🦵',
    de: { title: 'Kniebeugen', text: 'Vor einen Stuhl stellen, fast hinsetzen, Stuhl leicht berühren, wieder aufstehen. 10–12 Mal.' },
    en: { title: 'Modified Squats', text: 'Stand in front of a chair, almost sit down, lightly touch, stand back up. 10–12 times.' }
  },
  {
    category: 'movement',
    emoji: '🦵',
    de: { title: 'Waden-Stretch', text: 'Hände an Wand, ein Bein zurück, Ferse am Boden. Vorderes Knie beugen. 20 Sek. pro Seite.' },
    en: { title: 'Calf Stretch', text: 'Hands on wall, one leg back, heel on floor. Bend front knee. 20 seconds per side.' }
  },
  {
    category: 'movement',
    emoji: '🦩',
    de: { title: 'Standwaage', text: 'Auf einem Bein stehen, 15–30 Sek. halten. Wechsle das Bein. Wand zur Unterstützung nutzen.' },
    en: { title: 'Balance Pose', text: 'Stand on one leg for 15–30 seconds. Switch legs. Use a wall for support if needed.' }
  },
  {
    category: 'movement',
    emoji: '💪',
    de: { title: 'Armkreisen', text: 'Kleine Kreise nach vorne (20 Sek.), dann nach hinten (20 Sek.). Kreise langsam vergrößern.' },
    en: { title: 'Arm Circles', text: 'Small circles forward (20s), then backward (20s). Gradually increase circle size.' }
  }
];