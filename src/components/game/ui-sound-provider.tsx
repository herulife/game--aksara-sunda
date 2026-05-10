"use client";

import { useEffect, useRef } from "react";
import { markAudioUnlocked } from "@/components/game/audio-unlock";

const SOUND_PREF_KEY = "aksara-sunda-sound-enabled";
const CLICK_SOUND_SRC = "/assets/audio/mouse-click.mp3";
export const UI_SOUND_EVENT = "aksara-sunda-play-ui-sound";

export function UiSoundProvider({ initialSoundEnabled = true }: { initialSoundEnabled?: boolean }) {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayAtRef = useRef(0);

  useEffect(() => {
    if (!clickAudioRef.current) {
      const audio = new Audio(new URL(CLICK_SOUND_SRC, window.location.origin).toString());
      audio.preload = "auto";
      audio.volume = 0.88;
      audio.setAttribute("playsinline", "true");
      clickAudioRef.current = audio;
    }

    window.localStorage.setItem(SOUND_PREF_KEY, String(initialSoundEnabled));

    function isSoundEnabled() {
      const storedValue = window.localStorage.getItem(SOUND_PREF_KEY);
      return storedValue === null ? true : storedValue === "true";
    }

    function playClickSound() {
      if (!isSoundEnabled()) {
        return;
      }

      const now = performance.now();
      if (now - lastPlayAtRef.current < 70) {
        return;
      }
      lastPlayAtRef.current = now;

      try {
        const audio = clickAudioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        void audio.play();
      } catch {
        // ignore UI click sound failures
      }
    }

    function handleInteraction(target: EventTarget | null) {
      markAudioUnlocked();
      if (!(target instanceof Element)) return;

      const clickable = target.closest("button, a, [role='button']");
      if (!clickable) return;

      if (clickable instanceof HTMLButtonElement && clickable.disabled) {
        return;
      }

      playClickSound();
    }

    function onPointerDown(event: PointerEvent) {
      handleInteraction(event.target);
    }

    function onTouchStart(event: TouchEvent) {
      handleInteraction(event.target);
    }

    function onClick(event: MouseEvent) {
      handleInteraction(event.target);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      handleInteraction(event.target);
    }

    function onPlayEvent() {
      markAudioUnlocked();
      playClickSound();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener(UI_SOUND_EVENT, onPlayEvent);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(UI_SOUND_EVENT, onPlayEvent);
      clickAudioRef.current?.pause();
      clickAudioRef.current = null;
    };
  }, [initialSoundEnabled]);

  return null;
}
