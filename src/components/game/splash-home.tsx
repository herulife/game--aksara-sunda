"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBackgroundMusic } from "@/components/game/background-music-provider";

type SplashHomeProps = {
  startHref: string;
  showRegisterLink: boolean;
  initialMusicEnabled: boolean;
};

export function SplashHome({
  startHref,
  showRegisterLink,
  initialMusicEnabled,
}: SplashHomeProps) {
  const [showGuide, setShowGuide] = useState(false);
  const { musicEnabled, initializePreference, toggleMusic } = useBackgroundMusic();

  useEffect(() => {
    initializePreference(initialMusicEnabled);
  }, [initialMusicEnabled, initializePreference]);

  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col items-center px-4 pb-4 pt-5 text-center sm:max-w-[450px] sm:px-5 sm:pb-6 sm:pt-6">
        <p className="mockup-title text-[1.65rem] leading-none sm:text-[2.4rem]">
          Wilujeng Sumping
        </p>
        <h1 className="mt-0.5 text-[2.45rem] font-black leading-[0.84] tracking-[0.02em] text-[#60431e] drop-shadow-[0_3px_0_rgba(255,255,255,0.22)] sm:text-[4rem]">
          SUNDA
          <br />
          GAME
        </h1>
        <p className="mt-0.5 text-[0.78rem] font-bold text-[#fff9ef] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-[1rem]">
          Sundanese Educational Game
        </p>

        <div className="mt-1 flex flex-1 items-end justify-center">
          <Image
            src="/assets/characters/splash-characters.png"
            alt="Karakter pamaen Aksara Sunda"
            width={1383}
            height={922}
            className="h-auto w-[194px] drop-shadow-[0_14px_22px_rgba(39,30,14,0.14)] sm:w-[286px]"
            priority
          />
        </div>

        <Link
          href={startHref}
          className="pdf-button-green relative z-20 -mt-7 flex min-h-[50px] w-full max-w-[198px] touch-manipulation items-center justify-center rounded-[0.82rem] px-7 text-[1.42rem] font-black tracking-[0.04em] shadow-[0_5px_0_rgba(26,76,27,0.32),0_14px_24px_rgba(44,101,36,0.18)] sm:-mt-8 sm:min-h-[66px] sm:max-w-[246px] sm:text-[2rem]"
        >
          MULAI
        </Link>

        <div className="relative z-20 mt-3 grid w-full max-w-[304px] grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="pdf-panel-cream flex min-h-[50px] touch-manipulation items-center justify-center gap-2 rounded-[0.78rem] px-4 text-[0.84rem] font-black text-black shadow-[0_4px_0_rgba(152,130,67,0.26),0_12px_18px_rgba(35,28,15,0.12)] sm:min-h-[64px] sm:text-[1.02rem]"
            >
              <Image
                src="/assets/icons/book-open.png"
                alt=""
                width={544}
                height={544}
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              <span>PETUNJUK</span>
            </button>
            <button
              type="button"
              onClick={() => void toggleMusic()}
              className="pdf-panel-cream flex min-h-[50px] touch-manipulation items-center justify-center gap-2 rounded-[0.78rem] px-4 text-[0.84rem] font-black text-black shadow-[0_4px_0_rgba(152,130,67,0.26),0_12px_18px_rgba(35,28,15,0.12)] sm:min-h-[64px] sm:text-[1.02rem]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3f8e41] text-white shadow-[0_6px_12px_rgba(39,30,14,0.16)] sm:h-6 sm:w-6">
                <Image
                  src="/assets/icons/speaker-white.png"
                  alt=""
                  width={469}
                  height={396}
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                />
              </span>
              <span>{musicEnabled ? "MUSIK ON" : "MUSIK OFF"}</span>
            </button>
        </div>

        {showRegisterLink ? (
          <Link
            href="/register"
            className="relative z-20 mt-3 touch-manipulation text-[0.7rem] font-bold text-[#fff8ec] underline underline-offset-4 drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)]"
          >
            Daptar pamaen anyar
          </Link>
        ) : null}
      </section>

      {showGuide ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(27,21,10,0.52)] px-4">
          <div className="pdf-panel-cream w-full max-w-[360px] rounded-[0.95rem] px-4 py-4 text-left text-black shadow-[0_16px_28px_rgba(35,28,15,0.24)]">
            <p className="text-xl font-black text-[#2d5f1f]">Petunjuk Maen</p>
            <div className="mt-3 space-y-2 text-sm font-black leading-[1.4] text-[#4e4028]">
              <p>1. Pencet `Mulai` pikeun asup ka kaulinan.</p>
              <p>2. Diajar aksara, tuluy jawab kuisna.</p>
              <p>3. Latihan nulis jeung maca pikeun nambah kamampuh.</p>
              <p>4. Kumpulkeun skor pangluhurna dina unggal level.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="pdf-button-green mt-4 w-full rounded-[0.9rem] px-4 py-3 text-base font-black text-white"
            >
              Ngartos
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
