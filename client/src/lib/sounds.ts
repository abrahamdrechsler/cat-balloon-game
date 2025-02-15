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
    // Create oscillator for the meow sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Random frequency between 400-600 Hz for cat-like sound
    const baseFreq = 400 + Math.random() * 200;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set initial parameters
    oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Schedule the meow envelope
    const now = audioContext.currentTime;

    // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);

    // Frequency sweep down
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.2);

    // Release
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + 0.3);

    console.log('Playing synthesized meow sound');
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}