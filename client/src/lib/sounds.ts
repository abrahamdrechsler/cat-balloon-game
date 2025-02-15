let audioContext: AudioContext | null = null;
const sounds: { [key: string]: AudioBuffer } = {};

const meows = [
  'https://cdn.freesound.org/previews/524/524108_11396535-lq.mp3',  // Cat meow 1
  'https://cdn.freesound.org/previews/415/415209_1934854-lq.mp3',   // Cat meow 2
  'https://cdn.freesound.org/previews/463/463744_4094540-lq.mp3'    // Cat meow 3
];

export async function initializeAudio() {
  try {
    // Create AudioContext on first user interaction
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Resume the audio context (required by browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    console.log('Loading audio files...');
    for (let i = 0; i < meows.length; i++) {
      try {
        const response = await fetch(meows[i]);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sounds[`meow${i}`] = audioBuffer;
        console.log(`Loaded meow sound ${i + 1}`);
      } catch (error) {
        console.error(`Failed to load meow sound ${i + 1}:`, error);
      }
    }
    console.log('Audio initialization complete');
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

export function playPopSound() {
  if (!audioContext || Object.keys(sounds).length === 0) {
    console.warn('Audio not initialized or no sounds loaded');
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    const randomMeow = `meow${Math.floor(Math.random() * meows.length)}`;
    source.buffer = sounds[randomMeow];
    source.connect(audioContext.destination);
    source.start(0);
    console.log('Playing sound:', randomMeow);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}