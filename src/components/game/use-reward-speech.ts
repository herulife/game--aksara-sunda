"use client";

import { useEffect, useRef } from "react";
import { hasUserActivatedAudio, onAudioUnlocked } from "@/components/game/audio-unlock";

type RewardSpeechOptions = {
  enabled?: boolean;
  key: string;
  message: string;
};

export function useRewardSpeech({ enabled = true, key, message }: RewardSpeechOptions) {
  const lastSpokenKeyRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queuedPlaybackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return onAudioUnlocked(() => {
      if (!queuedPlaybackRef.current) return;
      const play = queuedPlaybackRef.current;
      queuedPlaybackRef.current = null;
      play();
    });
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !message) {
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
        audio.playsInline = true;
        audioRef.current = audio;
        await audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(objectUrl);
        };
        return;
      } catch {
        if (isCancelled) return;
      }

      if (!("speechSynthesis" in window)) {
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
  }, [enabled, key, message]);
}
