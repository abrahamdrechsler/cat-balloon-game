let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_FILES = [
  'meow2.m4a',
  'meow3.m4a',
  'Recording.m4a',
  'Recording (3).m4a'
];

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
      if (audioContext.state === 'suspended') {
        await audioContext.resume().catch(console.error);
      }
      return;
    }

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume().catch(console.error);
    }

    // Load each sound file from the public assets directory
    for (const soundFile of MEOW_FILES) {
      try {
        const response = await fetch(`/assets/${soundFile}`);
        if (!response.ok) {
          console.warn(`Failed to load sound: ${soundFile}`);
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        catSounds.push(audioBuffer);
      } catch (error) {
        console.warn(`Failed to load sound: ${soundFile}`, error);
      }
    }

    // Log if no sounds were loaded
    if (catSounds.length === 0) {
      console.warn('No cat sounds loaded successfully');
    } else {
      console.log(`Successfully loaded ${catSounds.length} cat sounds`);
    }
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) return;

  try {
    const source = audioContext.createBufferSource();
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4; // Reduce volume to 40%

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
}