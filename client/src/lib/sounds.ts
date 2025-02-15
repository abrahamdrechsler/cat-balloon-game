let audioContext: AudioContext | null = null;

export async function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    console.log('Audio initialized successfully');
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
    const now = audioContext.currentTime;

    // Create main oscillator for the meow
    const mainOsc = audioContext.createOscillator();
    const mainGain = audioContext.createGain();

    // Create modulator oscillator for the "mrr" sound
    const modOsc = audioContext.createOscillator();
    const modGain = audioContext.createGain();

    // Create noise for texture
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = audioContext.createGain();

    // Random base frequency between 350-450 Hz
    const baseFreq = 350 + Math.random() * 100;

    // Connect nodes
    mainOsc.connect(mainGain);
    modOsc.connect(modGain);
    noiseSource.connect(noiseGain);
    mainGain.connect(audioContext.destination);
    modGain.connect(mainOsc.frequency);
    noiseGain.connect(audioContext.destination);

    // Set initial parameters
    mainOsc.frequency.setValueAtTime(baseFreq, now);
    modOsc.frequency.setValueAtTime(30, now); // Slow modulation for "mrr" sound
    modGain.gain.setValueAtTime(100, now);
    mainGain.gain.setValueAtTime(0, now);
    noiseGain.gain.setValueAtTime(0, now);

    // Schedule the meow envelope
    // Initial "mrr" attack
    mainGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    modGain.gain.linearRampToValueAtTime(200, now + 0.1);
    noiseGain.gain.linearRampToValueAtTime(0.01, now + 0.1);

    // Transition to "eow"
    mainOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.2);
    modGain.gain.linearRampToValueAtTime(0, now + 0.2);
    mainGain.gain.linearRampToValueAtTime(0.4, now + 0.2);

    // Release
    mainOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.4);
    mainGain.gain.linearRampToValueAtTime(0, now + 0.4);
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.4);

    // Start and stop
    mainOsc.start(now);
    modOsc.start(now);
    noiseSource.start(now);

    mainOsc.stop(now + 0.5);
    modOsc.stop(now + 0.5);
    noiseSource.stop(now + 0.5);

    console.log('Playing enhanced meow sound');
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}