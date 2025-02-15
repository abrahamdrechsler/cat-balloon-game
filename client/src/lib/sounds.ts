let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// List of meow sound files to load
const MEOW_FILES = [
  'meow1 (2).m4a',
  'meow2.m4a',
  'meow3.m4a',
  'Recording.m4a',
  'Recording (3).m4a'
].map(file => `/src/assets/${file}`);

export async function initializeAudio() {
  try {
    // Create audio context with proper fallback
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
      console.log('Audio context resumed');
    }

    console.log('Audio context state:', audioContext.state);

    // Load each meow sound file
    for (const soundFile of MEOW_FILES) {
      try {
        console.log('Attempting to load sound file:', soundFile);
        const response = await fetch(soundFile);

        if (!response.ok) {
          console.error('Failed to fetch:', soundFile, 'Status:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('Successfully fetched file:', soundFile, 'Size:', arrayBuffer.byteLength);

        // Decode the audio data with error handling
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          catSounds.push(audioBuffer);
          console.log('Successfully decoded audio file:', soundFile);
        } catch (decodeError) {
          console.error('Failed to decode audio data:', soundFile, decodeError);
          throw decodeError;
        }
      } catch (error) {
        console.error('Failed to load cat sound:', soundFile, error);
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