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
    const soundIndex = Math.floor(Math.random() * catSounds.length);
    const randomSound = catSounds[soundIndex];

    // Verify the sound buffer is valid
    if (!randomSound || !randomSound.duration) {
      console.error(`Invalid sound buffer at index ${soundIndex}`);
      return;
    }

    source.buffer = randomSound;
    console.log(`Playing sound ${soundIndex + 1} of ${catSounds.length}`);

    // Set playback rate to 1.5 for moderately higher pitch (halfway between normal and double speed)
    source.playbackRate.value = 1.5;

    const gainNode = audioContext.createGain();
    // Adjust volume for the new playback rate
    gainNode.gain.value = 0.35;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}