// Array of cat meow sounds with proper error handling
const meowSounds = [
  '/sounds/meow1.wav',
  '/sounds/meow2.wav',
  '/sounds/meow3.wav',
  '/sounds/meow4.wav',
  '/sounds/meow5.wav'
];

const dogSound = '/sounds/dog.wav';

let audioContext: AudioContext | null = null;
const audioBuffers: AudioBuffer[] = [];
let dogAudioBuffer: AudioBuffer | null = null;

// Initialize audio context with proper error handling
export async function initAudio() {
  try {
    // Create audio context only on first initialization
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const loadSound = async (url: string) => {
      console.log(`Loading sound: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      if (!audioContext) {
        throw new Error('AudioContext not initialized');
      }
      return await audioContext.decodeAudioData(arrayBuffer);
    };

    // Load all cat sounds with proper error handling
    for (const soundUrl of meowSounds) {
      try {
        const buffer = await loadSound(soundUrl);
        audioBuffers.push(buffer);
        console.log(`Successfully loaded sound: ${soundUrl}`);
      } catch (error) {
        console.error(`Failed to load sound ${soundUrl}:`, error);
      }
    }

    // Load dog sound
    try {
      dogAudioBuffer = await loadSound(dogSound);
      console.log('Successfully loaded dog sound');
    } catch (error) {
      console.error('Failed to load dog sound:', error);
    }
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

// Play a random meow sound with proper error handling and increased speed/pitch
export function playRandomMeow() {
  if (!audioContext || audioBuffers.length === 0) {
    console.warn('Audio not properly initialized or no sounds loaded');
    return;
  }

  try {
    // Resume audio context if it's suspended (browsers require user interaction)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    const randomIndex = Math.floor(Math.random() * audioBuffers.length);
    source.buffer = audioBuffers[randomIndex];
    source.playbackRate.value = 1.5; // Increase speed and pitch by 1.5x
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play meow sound:', error);
  }
}

// Play dog bark sound
export function playDogBark() {
  if (!audioContext || !dogAudioBuffer) {
    console.warn('Audio not properly initialized or dog sound not loaded');
    return;
  }

  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = dogAudioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play dog sound:', error);
  }
}