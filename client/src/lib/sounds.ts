// Simplified audio handling with proper base path
const BASE_PATH = import.meta.env.DEV ? '' : '';
const AUDIO_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

// Simple sound manager with a single instance
const POP_SOUND = new Audio('/assets/meow2.mp3');
POP_SOUND.volume = 0.35;

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
    // Reset and play
    POP_SOUND.currentTime = 0;

    const playPromise = POP_SOUND.play();
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