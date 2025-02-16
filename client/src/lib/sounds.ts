let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// List of meow sound files to load
const MEOW_FILES = [
  'meow2.mp3',  
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
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
  try {
    if (audioContext) {
      // If context exists but is suspended, try to resume it
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      return; // Audio is already initialized
    }

    // Create audio context with proper fallback
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Resume audio context if suspended (needed for some browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Load each meow sound file
    for (const soundFile of MEOW_FILES) {
      try {
        const response = await fetch(soundFile);

        if (!response.ok) {
          console.warn(`Failed to load sound file: ${soundFile}`);
          continue; // Skip this file and try the next one
        }

        const arrayBuffer = await response.arrayBuffer();

        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          catSounds.push(audioBuffer);
        } catch (decodeError) {
          console.warn(`Failed to decode sound file: ${soundFile}`);
          continue;
        }
      } catch (error) {
        console.warn(`Failed to fetch sound file: ${soundFile}`);
        continue;
      }
    }

    // Only log if we have no sounds at all
    if (catSounds.length === 0) {
      console.warn('No cat sounds loaded, will use fallback sound');
    }
  } catch (error) {
    console.error('Failed to initialize audio:', error);
    throw error; // Let the caller handle the error
  }
}

export function playPopSound() {
  if (!audioContext) {
    return;
  }

  try {
    if (catSounds.length > 0) {
      // Play a random cat sound
      const source = audioContext.createBufferSource();
      const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
      source.buffer = randomSound;

      // Add a gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.4; // Reduce volume to 40%

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
    } else {
      // Use fallback beep sound
      const { oscillator, gainNode } = createFallbackSound(audioContext);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.error('Error playing sound:', error);
    // Continue game even if sound fails
  }
}