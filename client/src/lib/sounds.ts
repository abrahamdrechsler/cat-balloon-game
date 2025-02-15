let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_URLS = [
  'https://storage.googleapis.com/cat-sounds/cat-meow-1.mp3',
  'https://storage.googleapis.com/cat-sounds/cat-meow-2.mp3',
  'https://storage.googleapis.com/cat-sounds/cat-meow-3.mp3'
];

export async function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Create a fallback oscillator-based meow sound
    const createFallbackMeow = async () => {
      if (!audioContext) return null;

      const duration = 0.5;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate a simple meow-like sound
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const frequency = 500 - 200 * (t / duration);
        data[i] = 0.5 * Math.sin(2 * Math.PI * frequency * t) * 
                 Math.exp(-4 * t / duration);
      }

      return buffer;
    };

    // Try loading real meow sounds, fall back to synthetic if needed
    for (const url of MEOW_URLS) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        if (!audioContext) throw new Error('Audio context is null');
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        catSounds.push(audioBuffer);
      } catch (error) {
        console.warn('Failed to load meow sound, using fallback:', error);
        const fallbackSound = await createFallbackMeow();
        if (fallbackSound) catSounds.push(fallbackSound);
      }
    }

    // Ensure we have at least one sound
    if (catSounds.length === 0) {
      const fallbackSound = await createFallbackMeow();
      if (fallbackSound) catSounds.push(fallbackSound);
    }

    console.log(`Audio initialized with ${catSounds.length} sounds`);
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    console.warn('Audio not initialized or no sounds loaded');
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    // Add a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Reduce volume to 50%

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}