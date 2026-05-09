"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { markAudioUnlocked } from "@/components/game/audio-unlock";

export const MUSIC_PREF_KEY = "aksara-sunda-music-enabled";
export const MUSIC_VOLUME_PREF_KEY = "aksara-sunda-music-volume";
const SPLASH_BGM_SRC = "/assets/audio/degung.mp3";
const DEFAULT_VOLUME = 0.78;
const AUTH_PATHS = new Set(["/login", "/register"]);
const GAME_PATH_PREFIXES = ["/quiz", "/tracing", "/membaca", "/belajar/level-", "/level"];

type BackgroundMusicContextValue = {
  musicEnabled: boolean;
  musicVolume: number;
  initialized: boolean;
  initializePreference: (initialEnabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => Promise<void>;
  setMusicVolume: (volume: number) => void;
  toggleMusic: () => Promise<void>;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabledState] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(DEFAULT_VOLUME);
  const [initialized, setInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAutoplayRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);
  const pathname = usePathname();
  const shouldMuteForCurrentRoute =
    AUTH_PATHS.has(pathname) ||
    GAME_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(new URL(SPLASH_BGM_SRC, window.location.origin).toString());
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.volume = musicVolume;
      audioRef.current.playsInline = true;
    }

    return audioRef.current;
  }, [musicVolume]);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetVolume: number, onDone?: () => void) => {
      const audio = ensureAudio();
      stopFade();
      const startVolume = audio.volume;
      const safeTargetVolume = Math.max(0, Math.min(1, targetVolume));
      const startedAt = performance.now();
      const duration = 280;

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const nextVolume = startVolume + (safeTargetVolume - startVolume) * progress;
        audio.volume = Math.max(0, Math.min(1, nextVolume));

        if (progress < 1) {
          fadeFrameRef.current = requestAnimationFrame(step);
          return;
        }

        fadeFrameRef.current = null;
        onDone?.();
      };

      fadeFrameRef.current = requestAnimationFrame(step);
    },
    [ensureAudio, stopFade],
  );

  const playAudio = useCallback(async () => {
    const audio = ensureAudio();
    try {
      audio.volume = 0.001;
      await audio.play();
      fadeTo(musicVolume);
      pendingAutoplayRef.current = false;
    } catch {
      pendingAutoplayRef.current = true;
    }
  }, [ensureAudio, fadeTo, musicVolume]);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    fadeTo(0.001, () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      pendingAutoplayRef.current = false;
    });
  }, [fadeTo]);

  const setMusicEnabled = useCallback(
    async (enabled: boolean) => {
      setMusicEnabledState(enabled);
      window.localStorage.setItem(MUSIC_PREF_KEY, String(enabled));

      if (enabled) {
        await playAudio();
        return;
      }

      pauseAudio();
    },
    [pauseAudio, playAudio],
  );

  const setMusicVolume = useCallback((volume: number) => {
    const nextVolume = Math.max(0, Math.min(1, volume));
    setMusicVolumeState(nextVolume);
    window.localStorage.setItem(MUSIC_VOLUME_PREF_KEY, String(nextVolume));

    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }
  }, []);

  const toggleMusic = useCallback(async () => {
    await setMusicEnabled(!musicEnabled);
  }, [musicEnabled, setMusicEnabled]);

  const initializePreference = useCallback(
    (initialEnabled: boolean) => {
      if (initialized) return;

      const storedValue = window.localStorage.getItem(MUSIC_PREF_KEY);
      const storedVolume = window.localStorage.getItem(MUSIC_VOLUME_PREF_KEY);
      const resolvedEnabled = storedValue === null ? initialEnabled : storedValue === "true";
      const resolvedVolume =
        storedVolume === null ? DEFAULT_VOLUME : Math.max(0, Math.min(1, Number(storedVolume) || DEFAULT_VOLUME));

      window.localStorage.setItem(MUSIC_PREF_KEY, String(resolvedEnabled));
      window.localStorage.setItem(MUSIC_VOLUME_PREF_KEY, String(resolvedVolume));
      setMusicEnabledState(resolvedEnabled);
      setMusicVolumeState(resolvedVolume);
      setInitialized(true);

      if (resolvedEnabled && !shouldMuteForCurrentRoute) {
        void playAudio();
      }
    },
    [initialized, playAudio, shouldMuteForCurrentRoute],
  );

  useEffect(() => {
    function tryResumeFromInteraction() {
      markAudioUnlocked();
      if (!pendingAutoplayRef.current || !musicEnabled) return;
      void playAudio();
    }

    window.addEventListener("pointerdown", tryResumeFromInteraction);
    window.addEventListener("touchstart", tryResumeFromInteraction, { passive: true });
    window.addEventListener("click", tryResumeFromInteraction);
    window.addEventListener("keydown", tryResumeFromInteraction);

    return () => {
      window.removeEventListener("pointerdown", tryResumeFromInteraction);
      window.removeEventListener("touchstart", tryResumeFromInteraction);
      window.removeEventListener("click", tryResumeFromInteraction);
      window.removeEventListener("keydown", tryResumeFromInteraction);
    };
  }, [musicEnabled, playAudio]);

  useEffect(() => {
    return () => {
      stopFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopFade]);

  useEffect(() => {
    if (!initialized) return;

    if (shouldMuteForCurrentRoute) {
      pauseAudio();
      return;
    }

    if (musicEnabled) {
      void playAudio();
    }
  }, [initialized, musicEnabled, pauseAudio, playAudio, shouldMuteForCurrentRoute]);

  const value = useMemo(
    () => ({
      musicEnabled,
      musicVolume,
      initialized,
      initializePreference,
      setMusicEnabled,
      setMusicVolume,
      toggleMusic,
    }),
    [
      initialized,
      initializePreference,
      musicEnabled,
      musicVolume,
      setMusicEnabled,
      setMusicVolume,
      toggleMusic,
    ],
  );

  return <BackgroundMusicContext.Provider value={value}>{children}</BackgroundMusicContext.Provider>;
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);

  if (!context) {
    throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  }

  return context;
}
