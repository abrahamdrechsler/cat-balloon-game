let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

export async function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Create different variations of meow sounds
    const createMeowSound = (baseFreq: number, duration: number) => {
      if (!audioContext) return null;

      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;

        // Create frequency modulation for more realistic meow
        const freqMod = baseFreq + (Math.sin(2 * Math.PI * 3 * t) * 50);
        const freq = freqMod - (t / duration) * 200; // Frequency sweep down

        // Add harmonics for richer sound
        const fundamental = Math.sin(2 * Math.PI * freq * t);
        const harmonic1 = 0.5 * Math.sin(2 * Math.PI * freq * 2 * t);
        const harmonic2 = 0.25 * Math.sin(2 * Math.PI * freq * 3 * t);

        // Envelope shaping
        const attack = t < 0.1 ? t / 0.1 : 1;
        const release = t > duration - 0.2 ? (duration - t) / 0.2 : 1;
        const envelope = attack * release * Math.exp(-3 * t / duration);

        data[i] = (fundamental + harmonic1 + harmonic2) * envelope * 0.3;
      }

      return buffer;
    };

    // Create multiple variations of meow sounds
    const meowVariations = [
      { freq: 400, duration: 0.5 }, // Short meow
      { freq: 350, duration: 0.7 }, // Medium meow
      { freq: 450, duration: 0.4 }  // High-pitched meow
    ];

    for (const variation of meowVariations) {
      const sound = createMeowSound(variation.freq, variation.duration);
      if (sound) catSounds.push(sound);
    }

    console.log(`Created ${catSounds.length} synthetic meow variations`);
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    console.warn('Audio not initialized or no sounds created');
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    // Add a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4; // Reduce volume to 40%

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}