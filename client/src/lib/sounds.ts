let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

// Track currently playing sounds to prevent overlap
let isPlayingSound = false;

async function loadSounds() {
  if (!audioContext) return;

  const soundPath = '/assets/';
  for (const soundFile of MEOW_FILES) {
    try {
      const response = await fetch(`${soundPath}${soundFile}`);
      if (!response.ok) continue;

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      catSounds.push(audioBuffer);
    } catch (error) {
      // Ignore errors during sound loading - sounds will be loaded when possible
      continue;
    }
  }
}

export function playPopSound() {
  // If a sound is currently playing, don't play another one
  if (isPlayingSound) return;

  try {
    // Only create AudioContext on first user interaction
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      loadSounds(); // Start loading sounds after context is created
    }

    // If no sounds are loaded yet, just return silently
    if (catSounds.length === 0) {
      return;
    }

    isPlayingSound = true;
    const source = audioContext.createBufferSource();
    const soundIndex = Math.floor(Math.random() * catSounds.length);
    const randomSound = catSounds[soundIndex];

    if (!randomSound) return;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.35; // Set volume to 35%

    source.buffer = randomSound;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.playbackRate.value = 1.25;

    // Reset the playing flag when the sound ends
    source.onended = () => {
      isPlayingSound = false;
    };

    source.start(0);

    // Failsafe: reset the playing flag after 1 second in case onended doesn't fire
    setTimeout(() => {
      isPlayingSound = false;
    }, 1000);
  } catch (error) {
    console.error('Sound playback failed:', error);
    isPlayingSound = false; // Reset the flag in case of error
  }
}