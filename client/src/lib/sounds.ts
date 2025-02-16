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

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 44100 // Set a fixed sample rate that matches our converted files
    });

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Get the base URL based on environment
    const basePath = window.location.origin.includes('github.io') ? '.' : '';
    const soundPath = `${basePath}/assets/`;
    console.log('Loading sounds from:', soundPath);

    // Load each sound file
    const loadPromises = MEOW_FILES.map(async (soundFile) => {
      try {
        console.log(`Fetching ${soundPath}${soundFile}...`);
        const response = await fetch(`${soundPath}${soundFile}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          throw new Error('Empty file received');
        }

        console.log(`Successfully fetched ${soundFile}, size:`, arrayBuffer.byteLength);

        const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
          audioContext!.decodeAudioData(
            arrayBuffer,
            (buffer) => resolve(buffer),
            (error) => reject(new Error(`Failed to decode ${soundFile}: ${error}`))
          );
        });

        if (!audioBuffer || audioBuffer.duration === 0) {
          throw new Error('Invalid audio data');
        }

        console.log(`Successfully decoded ${soundFile}, duration:`, audioBuffer.duration);
        return audioBuffer;
      } catch (error) {
        console.error(`Error loading ${soundFile}:`, error);
        return null;
      }
    });

    // Wait for all sounds to load
    const loadedSounds = await Promise.all(loadPromises);
    catSounds = loadedSounds.filter((sound): sound is AudioBuffer => sound !== null);

    if (catSounds.length === 0) {
      throw new Error('No sounds loaded successfully');
    }

    console.log(`Successfully loaded ${catSounds.length} cat sounds`);
  } catch (error) {
    console.error('Audio initialization failed:', error);
    throw error;
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    console.warn('No sounds available to play');
    return;
  }

  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    const soundIndex = Math.floor(Math.random() * catSounds.length);
    const randomSound = catSounds[soundIndex];

    if (!randomSound || !randomSound.duration) {
      console.error(`Invalid sound buffer at index ${soundIndex}`);
      return;
    }

    // Create and configure gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.35; // Set volume to 35%

    // Connect nodes
    source.buffer = randomSound;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback with a slightly higher pitch
    source.playbackRate.value = 1.25;
    source.start(0);

    console.log(`Playing sound ${soundIndex + 1} of ${catSounds.length}`);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}