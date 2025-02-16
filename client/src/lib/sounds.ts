let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];

// Update file extensions to .mp3 since that's what we're converting to
const MEOW_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

export async function initializeAudio() {
  try {
    // Create AudioContext lazily on first user interaction
    const resumeAudioContext = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    };

    // Add click handler to resume audio context
    document.addEventListener('click', () => {
      resumeAudioContext().catch(console.error);
    }, { once: true });

    await resumeAudioContext();

    const soundPath = '/assets/';
    console.log('Loading sounds from:', soundPath);

    // Load each sound file with better error handling
    let loadedAnySound = false;
    for (const soundFile of MEOW_FILES) {
      try {
        console.log(`Attempting to load ${soundFile}...`);
        const response = await fetch(`${soundPath}${soundFile}`);

        if (!response.ok) {
          console.warn(`Failed to fetch ${soundFile}: ${response.status}`);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          console.warn(`Empty file received for ${soundFile}`);
          continue;
        }

        if (!audioContext) {
          throw new Error('AudioContext not initialized');
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (!audioBuffer || audioBuffer.duration === 0) {
          console.warn(`Invalid audio data for ${soundFile}`);
          continue;
        }

        catSounds.push(audioBuffer);
        loadedAnySound = true;
        console.log(`Successfully loaded ${soundFile}`);
      } catch (error) {
        console.warn(`Error loading ${soundFile}:`, error);
        continue;
      }
    }

    if (!loadedAnySound) {
      throw new Error('No sounds could be loaded');
    }

    console.log(`Successfully loaded ${catSounds.length} cat sounds`);
  } catch (error) {
    console.error('Audio initialization failed:', error);
    // Allow the game to continue without sound
    return;
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
      console.warn(`Invalid sound buffer at index ${soundIndex}`);
      return;
    }

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.35; // Set volume to 35%

    source.buffer = randomSound;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.playbackRate.value = 1.25;
    source.start(0);
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
}