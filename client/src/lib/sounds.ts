const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const sounds: { [key: string]: AudioBuffer } = {};

const meows = [
  'https://assets.mixkit.co/active_storage/sfx/2326/2326-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2327/2327-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2328/2328-preview.mp3'
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
