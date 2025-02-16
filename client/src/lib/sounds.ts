let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// List of meow sound files to load with correct extensions
const MEOW_FILES = [
  'meow2.m4a',  
  'meow3.m4a',
  'Recording.m4a',
  'Recording (3).m4a'
].map(file => {
  // In development, use absolute path; in production, use relative path
  const isDev = import.meta.env.DEV;
  return isDev ? `/assets/${file}` : `./assets/${file}`;
});

// Simple beep as fallback sound if cat sounds fail to load
const createFallbackSound = (context: AudioContext) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

  return { oscillator, gainNode };
};

export async function initializeAudio() {
  // If audio initialization fails, we'll just continue without sound
  try {
    if (audioContext) {
      if (audioContext.state === 'suspended') {
        await audioContext.resume().catch(console.error);
      }
      return;
    }

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume().catch(console.error);
    }

    // Try to load sounds but don't block game start
    for (const soundFile of MEOW_FILES) {
      try {
        const response = await fetch(soundFile);
        if (!response.ok) continue;
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        catSounds.push(audioBuffer);
      } catch (error) {
        console.warn(`Failed to load sound: ${soundFile}`, error);
        continue;
      }
    }
  } catch (error) {
    console.warn('Audio initialization failed:', error);
    // Don't throw, let the game continue without sound
  }
}

export function playPopSound() {
  if (!audioContext) return;

  try {
    if (catSounds.length > 0) {
      const source = audioContext.createBufferSource();
      const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
      source.buffer = randomSound;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.4;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
    } else {
      const { oscillator, gainNode } = createFallbackSound(audioContext);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.warn('Sound playback failed:', error);
    // Continue game even if sound fails
  }
}