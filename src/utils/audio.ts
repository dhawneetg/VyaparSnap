// Web Audio API offline cash register sound effect
export function playCashRegisterChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First ding (high pleasant chime)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Second metallic register bell
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.08); // A6
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn('Audio chime unsupported or blocked by browser policy', err);
  }
}

// Indian Soundbox Voice Announcement (Paytm/PhonePe style)
export function speakSoundboxAnnouncement(amount: number, language: 'hi' | 'en' = 'hi') {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // clear queue
    const phrase =
      language === 'hi'
        ? `व्यापार स्नैप पर ${amount} रुपये प्राप्त हुए`
        : `Received rupees ${amount} on VyaparSnap`;

    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Look for Indian English or Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) =>
        v.lang.includes('hi') ||
        v.lang.includes('en-IN') ||
        v.name.toLowerCase().includes('india')
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
}
