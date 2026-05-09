"use client";

import { useEffect, useRef } from "react";
import { markAudioUnlocked } from "@/components/game/audio-unlock";

const SOUND_PREF_KEY = "aksara-sunda-sound-enabled";
const CLICK_SOUND_SRC = "/assets/audio/mouse-click.mp3";

export function UiSoundProvider() {
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

    function isSoundEnabled() {
      const storedValue = window.localStorage.getItem(SOUND_PREF_KEY);
      return storedValue === null ? true : storedValue === "true";
    }

    function handleInteraction(target: EventTarget | null) {
      markAudioUnlocked();
      if (!(target instanceof Element)) return;

      const clickable = target.closest("button, a, [role='button']");
      if (!clickable) return;

      if (clickable instanceof HTMLButtonElement && clickable.disabled) {
        return;
      }

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

    function onPointerDown(event: PointerEvent) {
      handleInteraction(event.target);
    }

    function onTouchStart(event: TouchEvent) {
      handleInteraction(event.target);
    }

    function onClick(event: MouseEvent) {
      handleInteraction(event.target);
    }

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("click", onClick, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
      clickAudioRef.current?.pause();
      clickAudioRef.current = null;
    };
  }, []);

  return null;
}
