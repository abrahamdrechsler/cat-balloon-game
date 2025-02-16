// Array of cat meow sounds
const meowSounds = [
  '/sounds/meow1.mp3',
  '/sounds/meow2.mp3',
  '/sounds/meow3.mp3',
  '/sounds/meow4.mp3',
];

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const audioBuffers: AudioBuffer[] = [];

// Load all meow sounds
export async function initAudio() {
  try {
    const loadSound = async (url: string) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.decodeAudioData(arrayBuffer);
    };

    for (const soundUrl of meowSounds) {
      const buffer = await loadSound(soundUrl);
      audioBuffers.push(buffer);
    }
  } catch (error) {
    console.error('Failed to load audio:', error);
  }
}

// Play a random meow sound
export function playRandomMeow() {
  if (audioBuffers.length === 0) return;
  
  // Resume audio context if it's suspended (browsers require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  const randomIndex = Math.floor(Math.random() * audioBuffers.length);
  source.buffer = audioBuffers[randomIndex];
  source.connect(audioContext.destination);
  source.start(0);
}
