let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

export async function initializeAudio() {
  try {
    if (audioContext) {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      return;
    }

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Load each sound file
    for (const soundFile of MEOW_FILES) {
      try {
        console.log(`Attempting to load sound: ${soundFile}`);
        const response = await fetch(`/assets/${soundFile}`);

        if (!response.ok) {
          console.error(`Failed to load ${soundFile}:`, response.status, response.statusText);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log(`Successfully fetched ${soundFile}, size:`, arrayBuffer.byteLength);

        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          catSounds.push(audioBuffer);
          console.log(`Successfully decoded ${soundFile}`);
        } catch (decodeError) {
          console.error(`Failed to decode ${soundFile}:`, decodeError);
        }
      } catch (error) {
        console.error(`Error loading ${soundFile}:`, error);
      }
    }

    if (catSounds.length === 0) {
      console.error('No cat sounds loaded successfully');
    } else {
      console.log(`Successfully loaded ${catSounds.length} cat sounds`);
    }
  } catch (error) {
    console.error('Audio initialization failed:', error);
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    console.warn('No sounds available to play');
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    source.buffer = randomSound;

    // Set playback rate to 2.0 for double speed (higher pitch)
    source.playbackRate.value = 2.0;

    const gainNode = audioContext.createGain();
    // Reduce volume slightly as higher pitches can sound louder
    gainNode.gain.value = 0.3;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}