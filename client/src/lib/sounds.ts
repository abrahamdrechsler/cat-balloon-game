const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const sounds: { [key: string]: AudioBuffer } = {};

const meows = [
  'https://cdn.freesound.org/previews/524/524108_11396535-lq.mp3',  // Cat meow 1
  'https://cdn.freesound.org/previews/415/415209_1934854-lq.mp3',   // Cat meow 2
  'https://cdn.freesound.org/previews/463/463744_4094540-lq.mp3'    // Cat meow 3
];

export async function initializeAudio() {
  try {
    for (let i = 0; i < meows.length; i++) {
      const response = await fetch(meows[i]);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      sounds[`meow${i}`] = audioBuffer;
    }
  } catch (error) {
    console.error('Failed to load audio:', error);
  }
}

export function playPopSound() {
  if (Object.keys(sounds).length === 0) return;

  const source = audioContext.createBufferSource();
  const randomMeow = `meow${Math.floor(Math.random() * meows.length)}`;
  source.buffer = sounds[randomMeow];
  source.connect(audioContext.destination);
  source.start(0);
}