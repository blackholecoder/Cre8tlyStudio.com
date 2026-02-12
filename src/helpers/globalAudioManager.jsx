let currentAudioElement = null;

export function registerAudio(audioEl) {
  if (!audioEl) return;

  // If another audio is playing, pause it
  if (currentAudioElement && currentAudioElement !== audioEl) {
    currentAudioElement.pause();
  }

  currentAudioElement = audioEl;
}

export function unregisterAudio(audioEl) {
  if (currentAudioElement === audioEl) {
    currentAudioElement = null;
  }
}
