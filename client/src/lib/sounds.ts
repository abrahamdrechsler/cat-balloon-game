let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// List of meow sound files to load
const MEOW_FILES = [
  'meow1.mp3',
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
].map(file => `/src/assets/${file}`);

// Simple beep as fallback sound if cat sounds fail to load
const createFallbackSound = (context: AudioContext) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

  return { oscillator, gainNode };
};

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
          continue; // Skip this file and try the next one
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
          continue; // Skip this file and try the next one
        }
      } catch (error) {
        console.error('Failed to load cat sound:', soundFile, error);
      }
    }

    console.log(`Loaded ${catSounds.length} cat sounds`);

    // If no cat sounds loaded, create a fallback beep sound
    if (catSounds.length === 0) {
      console.warn('No cat sounds loaded, will use fallback sound');
    }
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

export function playPopSound() {
  if (!audioContext) {
    console.warn('Audio not initialized');
    return;
  }

  try {
    if (catSounds.length > 0) {
      // Play a random cat sound
      const source = audioContext.createBufferSource();
      const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
      source.buffer = randomSound;

      // Add a gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.4; // Reduce volume to 40%

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
    } else {
      // Use fallback beep sound
      const { oscillator, gainNode } = createFallbackSound(audioContext);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}