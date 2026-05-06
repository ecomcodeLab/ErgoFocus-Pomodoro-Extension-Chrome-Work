'use strict';

const EXERCISES = {
  eyes: {
    label: { de: '👁️ Augen', en: '👁️ Eyes' },
    exercises: [
      {
        title: { de: '20-20-20 Regel', en: '20-20-20 Rule' },
        desc: { de: 'Schau für 20 Sekunden auf einen Punkt ca. 6 Meter entfernt. Entspannt deine Augenmuskulatur.', en: 'Look at an object 20 feet away for 20 seconds. Relaxes your eye muscles.' }
      },
      {
        title: { de: 'Augenkreisen', en: 'Eye Circles' },
        desc: { de: 'Schließe die Augen und rolle sie 5x im und 5x gegen den Uhrzeigersinn. Langsam und sanft.', en: 'Close your eyes and roll them 5x clockwise and 5x counterclockwise. Slow and gentle.' }
      },
      {
        title: { de: 'Daumen-Fokus', en: 'Thumb Focus' },
        desc: { de: 'Halte den Daumen 25 cm vor dein Gesicht. Fokussiere 10 Sek. auf den Daumen, dann auf einen fernen Punkt. 3–5 Mal wechseln.', en: 'Hold your thumb 10 inches from your face. Focus 10 sec on thumb, then on a distant point. Switch 3–5 times.' }
      },
      {
        title: { de: 'Augenrollen', en: 'Eye Rolling' },
        desc: { de: 'Schließe die Augen und rolle sie langsam nach oben, unten, links und rechts. 3 Mal wiederholen.', en: 'Close your eyes and slowly roll them up, down, left, and right. Repeat 3 times.' }
      },
      {
        title: { de: 'Handflächen-Wärme', en: 'Palm Warmth' },
        desc: { de: 'Reibe die Handflächen aneinander und lege sie sanft über deine geschlossenen Augen. 30 Sekunden verweilen.', en: 'Rub palms together and gently cup them over closed eyes. Rest for 30 seconds.' }
      },
      {
        title: { de: 'Schulterblatt-Squeeze', en: 'Shoulder Blade Squeeze' },
        desc: { de: 'Ziehe deine Schulterblätter zusammen als ob du einen Bleistift zwischen ihnen hältst. 5 Sek. halten, 5–8 Mal.', en: 'Squeeze shoulder blades together as if holding a pencil between them. Hold 5 sec, repeat 5–8 times.' }
      }
    ]
  },
  movement: {
    label: { de: '🚶 Bewegung', en: '🚶 Movement' },
    exercises: [
      {
        title: { de: 'Wasser-Break', en: 'Water Break' },
        desc: { de: 'Steh auf, hol dir ein großes Glas Wasser und trinke es komplett aus. Hydration = Fokus.', en: 'Stand up, get a large glass of water and drink it completely. Hydration = focus.' }
      },
      {
        title: { de: 'Mini-Spaziergang', en: 'Mini Walk' },
        desc: { de: 'Gehe einmal durch deine Wohnung oder dein Büro. Bewegt deinen ganzen Körper.', en: 'Walk once through your apartment or office. Moves your whole body.' }
      },
      {
        title: { de: 'Kniebeugen (modifiziert)', en: 'Modified Squats' },
        desc: { de: 'Stehe vor einem Stuhl. Setze dich fast hin, berühre ihn leicht und stehe wieder auf. 10–12 Mal.', en: 'Stand in front of a chair. Almost sit, lightly touch it, stand back up. 10–12 times.' }
      },
      {
        title: { de: 'Schulter-Reset', en: 'Shoulder Reset' },
        desc: { de: 'Schultern zu den Ohren ziehen, 3 Sek. halten, fallen lassen. 5 Mal wiederholen.', en: 'Pull shoulders to ears, hold 3 sec, let them drop. Repeat 5 times.' }
      },
      {
        title: { de: 'Armkreisen', en: 'Arm Circles' },
        desc: { de: 'Mache kleine Kreise mit den Armen nach vorne, dann nach hinten. Steigere langsam. 20 Sek. pro Richtung.', en: 'Make small circles with arms forward, then backward. Increase size slowly. 20 sec each direction.' }
      },
      {
        title: { de: 'Marschieren auf der Stelle', en: 'March in Place' },
        desc: { de: 'Marschiere 90 Sekunden auf der Stelle und schwinge die Arme kräftig mit.', en: 'March in place for 90 seconds, swinging your arms vigorously.' }
      },
      {
        title: { de: 'Waden-Stretch', en: 'Calf Stretch' },
        desc: { de: 'Stelle dich mit den Händen gegen eine Wand. Ein Bein zurück, Ferse am Boden. 20 Sek. pro Seite dehnen.', en: 'Stand hands against wall. Step one leg back, heel on floor. Stretch 20 sec per side.' }
      },
      {
        title: { de: 'Standwaage', en: 'Balance Stand' },
        desc: { de: 'Stelle dich auf ein Bein für 15–30 Sek. Wechsle dann das Bein. Wand zur Unterstützung nutzen.', en: 'Stand on one leg for 15–30 sec. Switch legs. Use wall for support if needed.' }
      },
      {
        title: { de: 'Brust-Öffner', en: 'Chest Opener' },
        desc: { de: 'Hände hinter dem Rücken verschränken und Brustbein zur Decke ziehen. 15–20 Sek. halten.', en: 'Clasp hands behind your back and lift your chest toward the ceiling. Hold 15–20 sec.' }
      },
      {
        title: { de: 'Handgelenk-Stretching', en: 'Wrist Stretch' },
        desc: { de: 'Arm nach vorne strecken, Finger nach unten ziehen (15 Sek.), dann nach oben drücken (15 Sek.). Beide Hände.', en: 'Extend arm forward, pull fingers down (15 sec), then push up (15 sec). Both hands.' }
      },
      {
        title: { de: 'Finger- und Daumenstreckung', en: 'Finger & Thumb Stretch' },
        desc: { de: 'Spreize die Finger so weit wie möglich. Dann Faust machen. 10 Mal wiederholen. Jeden Daumen einzeln strecken.', en: 'Spread fingers as wide as possible. Make a fist. Repeat 10 times. Stretch each thumb individually.' }
      },
      {
        title: { de: 'Katze-Kuh im Sitzen', en: 'Seated Cat-Cow' },
        desc: { de: 'Hände auf den Knien. Einatmen: Rücken beugen, Schultern zurück (Kuh). Ausatmen: Rücken runden, Kinn zur Brust (Katze). 5–10 Mal.', en: 'Hands on knees. Inhale: arch back, pull shoulders back (cow). Exhale: round back, chin to chest (cat). 5–10 times.' }
      },
      {
        title: { de: 'Brustwirbel-Rotation', en: 'Thoracic Rotation' },
        desc: { de: 'Aufrecht sitzen, Hände hinter dem Kopf. Oberkörper langsam zu einer Seite drehen. 5–8 Mal pro Seite.', en: 'Sit upright, hands behind head. Slowly rotate torso to one side. 5–8 reps per side.' }
      }
    ]
  },
  mental: {
    label: { de: '🧠 Mental', en: '🧠 Mental' },
    exercises: [
      {
        title: { de: 'Box-Breathing', en: 'Box Breathing' },
        desc: { de: '4 Sek. einatmen → 4 Sek. halten → 4 Sek. ausatmen → 4 Sek. halten. 3–4 Runden.', en: 'Inhale 4 sec → hold 4 sec → exhale 4 sec → hold 4 sec. Do 3–4 rounds.' }
      },\n      {\n        title: { de: 'Atemübung 4-6', en: 'Breathing 4-6' },\n        desc: { de: '5 Mal tief einatmen (4 Sek.) und langsam ausatmen (6 Sek.). Beruhigt das Nervensystem.', en: 'Breathe in deeply (4 sec) and slowly out (6 sec) 5 times. Calms the nervous system.' }\n      },\n      {\n        title: { de: 'Kurze Achtsamkeit', en: 'Short Mindfulness' },\n        desc: { de: 'Schließe die Augen, konzentriere dich 60 Sek. auf deinen Atem. Nimm wahr ohne zu bewerten.', en: 'Close eyes, focus on your breath for 60 sec. Observe without judgment.' }\n      },\n      {\n        title: { de: 'Progressive Entspannung', en: 'Progressive Relaxation' },
        desc: { de: 'Spanne nacheinander Fäuste, Schultern 5 Sek. fest an, dann 10–15 Sek. locker lassen. 2–3 Gruppen.', en: 'Progressively tense fists, shoulders 5 sec, then release 10–15 sec. 2–3 muscle groups.' }\n      },\n      {\n        title: { de: 'Gedanken-Beobachtung', en: 'Thought Observation' },
        desc: { de: 'Schließe die Augen. Beobachte Gedanken wie vorbeiziehende Wolken – ohne sie zu greifen. 30–60 Sek.', en: 'Close eyes. Watch thoughts like passing clouds – without grabbing them. 30–60 sec.' }\n      },\n      {\n        title: { de: 'Kurze Visualisierung', en: 'Short Visualization' },
        desc: { de: 'Stell dir einen Ort vor, an dem du absolut entspannt bist. Verweile dort für 30–60 Sek.', en: 'Imagine a place where you feel completely relaxed. Stay there for 30–60 sec.' }\n      }\n    ]\n  }\n};\n\nif (typeof module !== 'undefined') module.exports = EXERCISES;\n