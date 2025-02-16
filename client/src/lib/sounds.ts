let audioContext: AudioContext | null = null;
let catSounds: AudioBuffer[] = [];
let isAudioInitialized = false;

// Update file extensions to .mp3 since that's what we're converting to
const MEOW_FILES = [
  'meow2.mp3',
  'meow3.mp3',
  'Recording.mp3',
  'Recording (3).mp3'
];

export async function initializeAudio() {
  // If already initialized, don't try again
  if (isAudioInitialized) {
    return;
  }

  try {
    // Only create AudioContext when explicitly called (after user interaction)
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

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
        console.log(`Successfully fetched ${soundFile}, size:`, arrayBuffer.byteLength);

        if (!audioContext) {
          throw new Error('AudioContext not initialized');
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log(`Successfully decoded ${soundFile}`);

        catSounds.push(audioBuffer);
        loadedAnySound = true;
      } catch (error) {
        // Ignore specific storage access errors since they don't affect functionality
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          console.debug('Storage access not yet allowed - this is expected before user interaction');
          continue;
        }
        console.warn(`Error loading ${soundFile}:`, error);
        continue;
      }
    }

    if (!loadedAnySound) {
      console.warn('No sounds could be loaded');
      return;
    }

    isAudioInitialized = true;
    console.log(`Successfully loaded ${catSounds.length} cat sounds`);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      console.debug('Storage access not yet allowed - this is expected before user interaction');
      return;
    }
    console.error('Audio initialization failed:', error);
    // Allow the game to continue without sound
  }
}

export function playPopSound() {
  if (!audioContext || catSounds.length === 0) {
    return; // Silently fail if audio isn't ready
  }

  try {
    const source = audioContext.createBufferSource();
    const soundIndex = Math.floor(Math.random() * catSounds.length);
    const randomSound = catSounds[soundIndex];

    if (!randomSound) {
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