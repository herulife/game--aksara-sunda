"use client";

import { useEffect, useRef } from "react";
import { hasUserActivatedAudio, onAudioUnlocked } from "@/components/game/audio-unlock";

type RewardSpeechOptions = {
  enabled?: boolean;
  effect?: "error" | "success";
  key: string;
  message: string;
};

const EFFECT_AUDIO_MAP = {
  success: "/assets/audio/benar.mp3",
  error: "/assets/audio/salah.mp3",
} as const;

export function useRewardSpeech({ enabled = true, effect, key, message }: RewardSpeechOptions) {
  const lastSpokenKeyRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queuedPlaybackRef = useRef<(() => void) | null>(null);

  function playEffectTone(kind: "error" | "success") {
    if (typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.connect(context.destination);

    const pulses =
      kind === "success"
        ? [
            { time: 0, frequency: 740, duration: 0.1, type: "sine" as OscillatorType, volume: 0.08 },
            { time: 0.11, frequency: 980, duration: 0.12, type: "triangle" as OscillatorType, volume: 0.09 },
          ]
        : [
            { time: 0, frequency: 220, duration: 0.12, type: "triangle" as OscillatorType, volume: 0.1 },
            { time: 0.08, frequency: 130, duration: 0.16, type: "sawtooth" as OscillatorType, volume: 0.08 },
          ];

    pulses.forEach((pulse) => {
      const oscillator = context.createOscillator();
      const pulseGain = context.createGain();
      oscillator.type = pulse.type;
      oscillator.frequency.setValueAtTime(pulse.frequency, context.currentTime + pulse.time);
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(70, pulse.frequency * (kind === "success" ? 1.08 : 0.62)),
        context.currentTime + pulse.time + pulse.duration,
      );
      pulseGain.gain.setValueAtTime(0.0001, context.currentTime + pulse.time);
      pulseGain.gain.exponentialRampToValueAtTime(
        pulse.volume,
        context.currentTime + pulse.time + 0.01,
      );
      pulseGain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + pulse.time + pulse.duration,
      );
      oscillator.connect(pulseGain);
      pulseGain.connect(gain);
      oscillator.start(context.currentTime + pulse.time);
      oscillator.stop(context.currentTime + pulse.time + pulse.duration);
    });

    window.setTimeout(() => {
      void context.close();
    }, kind === "success" ? 320 : 360);
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

      if (effect && !message) {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
          }

          const effectAudio = new Audio(new URL(EFFECT_AUDIO_MAP[effect], window.location.origin).toString());
          effectAudio.preload = "auto";
          effectAudio.setAttribute("playsinline", "true");
          audioRef.current = effectAudio;
          await effectAudio.play();
          return;
        } catch {
          playEffectTone(effect);
          return;
        }
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
