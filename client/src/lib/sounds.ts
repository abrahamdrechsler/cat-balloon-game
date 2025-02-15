let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// Base64 encoded WAV files of real cat meows
const MEOW_SOUNDS = [
  // Standard meow
  "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YRAAAAAP8gwCP8KPwM/AAADPwQ==",
  // Playful meow
  "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YRAAAAAP7gwCP7KPwM/AAADPwQ==",
  // Short meow
  "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YRAAAAAP5gwCP6KPwM/AAADPwQ=="
];

export async function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Load the base64 encoded audio data
    for (const soundData of MEOW_SOUNDS) {
      try {
        // Convert base64 to array buffer
        const base64 = soundData.split(',')[1];
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        catSounds.push(audioBuffer);
      } catch (error) {
        console.error('Failed to decode audio:', error);
      }
    }

    console.log(`Loaded ${catSounds.length} real cat sounds`);
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
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    // Add a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4; // Reduce volume to 40%

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}