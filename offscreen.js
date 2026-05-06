// Generates a soft two-tone chime using Web Audio API
function playChime() {
  try {
    const ctx = new AudioContext();

    function tone(freq, startTime, duration, gain) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    const now = ctx.currentTime;
    tone(880, now, 0.6, 0.4);
    tone(1108, now + 0.18, 0.5, 0.3);
    tone(1320, now + 0.36, 0.7, 0.25);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLAY_SOUND') {
    playChime();
  }
});