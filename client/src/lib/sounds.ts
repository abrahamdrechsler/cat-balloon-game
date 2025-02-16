let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_FILES = [
  'meow2.m4a',
  'meow3.m4a',
  'Recording.m4a',
  'Recording (3).m4a'
];

export async function initializeAudio() {
  try {
    if (audioContext) {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      return;
    }

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Load each sound file
    for (const soundFile of MEOW_FILES) {
      try {
        console.log(`Attempting to load sound: ${soundFile}`);
        const response = await fetch(`/assets/${soundFile}`);

        if (!response.ok) {
          console.error(`Failed to load ${soundFile}:`, response.status, response.statusText);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log(`Successfully fetched ${soundFile}, size:`, arrayBuffer.byteLength);

        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          catSounds.push(audioBuffer);
          console.log(`Successfully decoded ${soundFile}`);
        } catch (decodeError) {
          console.error(`Failed to decode ${soundFile}:`, decodeError);
        }
      } catch (error) {
        console.error(`Error loading ${soundFile}:`, error);
      }
    }

    if (catSounds.length === 0) {
      console.error('No cat sounds loaded successfully');
    } else {
      console.log(`Successfully loaded ${catSounds.length} cat sounds`);
    }
  } catch (error) {
    console.error('Audio initialization failed:', error);
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    console.warn('No sounds available to play');
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}

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