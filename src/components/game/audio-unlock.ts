"use client";

const AUDIO_UNLOCK_EVENT = "aksara-audio-unlocked";

export function markAudioUnlocked() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUDIO_UNLOCK_EVENT));
}

export function onAudioUnlocked(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(AUDIO_UNLOCK_EVENT, handler);
  return () => window.removeEventListener(AUDIO_UNLOCK_EVENT, handler);
}

export function hasUserActivatedAudio() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(navigator.userActivation?.hasBeenActive);
}
