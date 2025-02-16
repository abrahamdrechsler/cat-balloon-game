// Simplified audio handling with proper base path
const BASE_PATH = import.meta.env.DEV ? '' : '';
const AUDIO_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

// Pre-load all sounds
const SOUNDS = AUDIO_FILES.map(file => {
  const audio = new Audio(`${BASE_PATH}/assets/${file}`);
  audio.volume = 0.35;
  return audio;
});

let isPlaying = false;
let lastPlayTime = 0;
const DEBOUNCE_TIME = 150; // Increased debounce time to prevent overlaps

export function playPopSound() {
  const now = Date.now();

  // Don't play if already playing or too soon after last play
  if (isPlaying || now - lastPlayTime < DEBOUNCE_TIME) {
    return;
  }

  try {
    // Pick a random sound
    const sound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];

    // Reset and play
    sound.currentTime = 0;
    const playPromise = sound.play();

    if (playPromise) {
      isPlaying = true;
      lastPlayTime = now;

      playPromise
        .then(() => {
          isPlaying = false;
        })
        .catch(() => {
          isPlaying = false;
        });
    }
  } catch (error) {
    isPlaying = false;
    console.warn('Sound playback failed:', error);
  }
}