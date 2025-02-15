let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_URLS = [
  'https://raw.githubusercontent.com/scottlawsonbc/audio-files/main/cat1.mp3',
  'https://raw.githubusercontent.com/scottlawsonbc/audio-files/main/cat2.mp3',
  'https://raw.githubusercontent.com/scottlawsonbc/audio-files/main/cat3.mp3'
];

export async function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Load all cat sounds
    const loadPromises = MEOW_URLS.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        catSounds.push(audioBuffer);
      } catch (error) {
        console.error('Error loading cat sound:', error);
      }
    });

    await Promise.all(loadPromises);
    console.log('Audio initialized successfully');
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
    // Pick a random cat sound
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}