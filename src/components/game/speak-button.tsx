"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hasUserActivatedAudio, onAudioUnlocked } from "@/components/game/audio-unlock";

type SpeakButtonProps = {
  text: string;
  audioSrc?: string;
  label?: string;
  className?: string;
};

export function SpeakButton({
  text,
  audioSrc,
  label = "Dengar Suara",
  className = "",
}: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    return onAudioUnlocked(() => {
      if (!pendingPlayRef.current) return;
      const play = pendingPlayRef.current;
      pendingPlayRef.current = null;
      play();
    });
  }, []);

  async function speak() {
    setPlaybackError(null);

    if (audioSrc && typeof window !== "undefined") {
      try {
        if (!audioRef.current) {
          const resolvedAudioSrc = new URL(audioSrc, window.location.origin).toString();
          audioRef.current = new Audio(resolvedAudioSrc);
          audioRef.current.preload = "auto";
          audioRef.current.playsInline = true;
          audioRef.current.load();
          audioRef.current.onended = () => setIsSpeaking(false);
          audioRef.current.onerror = () => setIsSpeaking(false);
        }

        audioRef.current.muted = false;
        audioRef.current.currentTime = 0;
        setIsSpeaking(true);
        if (!hasUserActivatedAudio()) {
          pendingPlayRef.current = () => {
            void speak();
          };
          setIsSpeaking(false);
          setPlaybackError("Sentuh layar sekali lagi untuk mengaktifkan suara.");
          return;
        }

        await audioRef.current.play();
        return;
      } catch {
        setIsSpeaking(false);
        setPlaybackError("Audio perangkat tidak aktif. Mencoba suara cadangan...");
      }
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      className={`transition hover:-translate-y-0.5 ${className}`}
      aria-label={`Putar suara untuk ${text}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3f8e41] text-white shadow-[0_6px_12px_rgba(39,30,14,0.16)] sm:h-9 sm:w-9">
        <Image
          src="/assets/icons/speaker-white.png"
          alt=""
          width={469}
          height={396}
          className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
        />
      </span>
      <span>{isSpeaking ? "Memutar..." : label}</span>
      {playbackError ? <span className="sr-only">{playbackError}</span> : null}
    </button>
  );
}
