// Simplified audio handling with proper base path
const BASE_PATH = import.meta.env.DEV ? '' : '';
const AUDIO_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

let lastPlayTime = 0;
const DEBOUNCE_TIME = 100; // Prevent multiple sounds within 100ms

const sounds = AUDIO_FILES.map(file => {
  const audio = new Audio(`${BASE_PATH}/assets/${file}`);
  audio.volume = 0.35; // Set volume to 35%
  return audio;
});

export function playPopSound() {
  // Debounce to prevent multiple sounds
  const now = Date.now();
  if (now - lastPlayTime < DEBOUNCE_TIME) {
    return;
  }
  lastPlayTime = now;

  try {
    // Get a random sound that's not currently playing
    const availableSounds = sounds.filter(sound => sound.paused);
    if (availableSounds.length === 0) return;

    const sound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
    sound.currentTime = 0;
    sound.play().catch(error => {
      // Ignore errors - audio will play when possible
      console.warn('Audio playback failed:', error);
    });
  } catch (error) {
    // Ignore errors - audio will play when possible
    console.warn('Audio system error:', error);
  }
}