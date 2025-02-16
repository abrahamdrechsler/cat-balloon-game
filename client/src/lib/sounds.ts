// Base path for audio files
const BASE_PATH = import.meta.env.DEV ? '' : '';

// List of available sound files
const AUDIO_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

let lastSoundIndex = -1;
let isPlaying = false;
let lastPlayTime = 0;
const DEBOUNCE_TIME = 150;

// Initialize sound array
const sounds = AUDIO_FILES.map(file => {
  const audio = new Audio(`${BASE_PATH}/assets/${file}`);
  audio.volume = 0.35;
  return audio;
});

function getRandomSoundIndex() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * sounds.length);
  } while (newIndex === lastSoundIndex && sounds.length > 1);
  lastSoundIndex = newIndex;
  return newIndex;
}

export function playPopSound() {
  const now = Date.now();

  if (isPlaying || now - lastPlayTime < DEBOUNCE_TIME) {
    return;
  }

  try {
    const soundIndex = getRandomSoundIndex();
    const sound = sounds[soundIndex];

    sound.currentTime = 0;
    const playPromise = sound.play();

    if (playPromise) {
      isPlaying = true;
      lastPlayTime = now;

      playPromise
        .then(() => {
          isPlaying = false;
        })
        .catch(error => {
          console.warn('Sound playback failed:', error);
          isPlaying = false;
        });
    }
  } catch (error) {
    console.warn('Sound system error:', error);
    isPlaying = false;
  }
}