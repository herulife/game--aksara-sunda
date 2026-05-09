"use client";

import { useEffect, useRef } from "react";
import { hasUserActivatedAudio, onAudioUnlocked } from "@/components/game/audio-unlock";

type RewardSpeechOptions = {
  enabled?: boolean;
  effect?: "error" | "success";
  key: string;
  message: string;
};

export function useRewardSpeech({ enabled = true, effect, key, message }: RewardSpeechOptions) {
  const lastSpokenKeyRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queuedPlaybackRef = useRef<(() => void) | null>(null);

  function playEffectTone(kind: "error" | "success") {
    if (typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = kind === "error" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(kind === "error" ? 330 : 620, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      kind === "error" ? 180 : 760,
      context.currentTime + (kind === "error" ? 0.18 : 0.14),
    );

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (kind === "error" ? 0.22 : 0.18));

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + (kind === "error" ? 0.24 : 0.2));
    oscillator.onended = () => {
      void context.close();
    };
  }

  useEffect(() => {
    return onAudioUnlocked(() => {
      if (!queuedPlaybackRef.current) return;
      const play = queuedPlaybackRef.current;
      queuedPlaybackRef.current = null;
      play();
    });
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || (!message && !effect)) {
      return;
    }

    if (lastSpokenKeyRef.current === key) {
      return;
    }

    lastSpokenKeyRef.current = key;
    let isCancelled = false;

    async function playReward() {
      if (!hasUserActivatedAudio()) {
        queuedPlaybackRef.current = () => {
          void playReward();
        };
        return;
      }

      if (effect === "error" && !message) {
        playEffectTone("error");
        return;
      }

      try {
        const response = await fetch("/api/reward-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("reward-speech-failed");
        }

        const audioBlob = await response.blob();
        if (isCancelled) return;

        const objectUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(objectUrl);
        audio.preload = "auto";
        audio.setAttribute("playsinline", "true");
        audioRef.current = audio;
        await audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(objectUrl);
        };
        return;
      } catch {
        if (isCancelled) return;
      }

      if (effect === "success" && !message) {
        playEffectTone("success");
        return;
      }

      if (!("speechSynthesis" in window) || !message) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 0.92;
      utterance.pitch = 1.02;

      window.speechSynthesis.speak(utterance);
    }

    void playReward();

    return () => {
      isCancelled = true;
      queuedPlaybackRef.current = null;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, [effect, enabled, key, message]);
}
