let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

const MEOW_FILES = [
  'meow2.m4a',
  'meow3.m4a',
  'Recording.m4a',
  'Recording (3).m4a'
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

    // Load each sound file with path adjustment for production vs development
    for (const soundFile of MEOW_FILES) {
      try {
        // Use relative path for production, absolute for development
        const basePath = import.meta.env.PROD ? './assets/' : '/assets/';
        const response = await fetch(`${basePath}${soundFile}`);

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
    const soundIndex = Math.floor(Math.random() * catSounds.length);
    const randomSound = catSounds[soundIndex];

    // Verify the sound buffer is valid
    if (!randomSound || !randomSound.duration) {
      console.error(`Invalid sound buffer at index ${soundIndex}`);
      return;
    }

    source.buffer = randomSound;
    console.log(`Playing sound ${soundIndex + 1} of ${catSounds.length}`);

    // Set playback rate to 1.25 for slightly higher pitch
    source.playbackRate.value = 1.25;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.35;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}