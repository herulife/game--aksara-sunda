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
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col items-center justify-center px-4 py-6 text-center sm:max-w-[540px] sm:px-6 sm:py-8">
        <p className="mockup-title text-[1.95rem] font-semibold leading-none sm:text-[2.7rem]">
          Selamat Datang
        </p>
        <h1 className="mt-1 text-[3.15rem] font-black leading-[0.82] tracking-[0.02em] text-[#60431e] drop-shadow-[0_3px_0_rgba(255,255,255,0.22)] sm:text-[4.85rem]">
          SUNDA
          <br />
          GAME
        </h1>
        <p className="mt-1 text-[0.84rem] font-bold text-[#fff9ef] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-[1.02rem]">
          Permainan Edukasi Bahasa Sunda
        </p>

        <div className="mt-4 flex items-end justify-center">
          <Image
            src="/assets/characters/splash-characters.png"
            alt="Karakter pemain Aksara Sunda"
            width={1383}
            height={922}
            className="h-auto w-[248px] drop-shadow-[0_16px_24px_rgba(39,30,14,0.16)] sm:w-[344px]"
            priority
          />
        </div>

        <Link
          href={startHref}
          className="pdf-button-green relative z-20 mt-3 flex min-h-[58px] w-full max-w-[228px] touch-manipulation items-center justify-center rounded-[1rem] px-7 text-[1.58rem] font-black tracking-[0.05em] shadow-[0_5px_0_rgba(26,76,27,0.32),0_14px_24px_rgba(44,101,36,0.18)] sm:min-h-[70px] sm:max-w-[270px] sm:text-[2.1rem]"
        >
          MULAI
        </Link>

        <div className="relative z-20 mt-5 grid w-full max-w-[334px] grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="pdf-panel-cream flex min-h-[54px] touch-manipulation items-center justify-center gap-2 rounded-[0.95rem] px-4 text-[0.88rem] font-black text-black shadow-[0_4px_0_rgba(152,130,67,0.26),0_12px_18px_rgba(35,28,15,0.12)] sm:min-h-[66px] sm:text-[1.04rem]"
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
            className="pdf-panel-cream flex min-h-[54px] touch-manipulation items-center justify-center gap-2 rounded-[0.95rem] px-4 text-[0.88rem] font-black text-black shadow-[0_4px_0_rgba(152,130,67,0.26),0_12px_18px_rgba(35,28,15,0.12)] sm:min-h-[66px] sm:text-[1.04rem]"
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
            href="/login"
            className="relative z-20 mt-4 touch-manipulation text-[0.8rem] font-bold text-[#fff8ec] underline underline-offset-4 drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)]"
          >
            Sudah punya akun? Masuk di sini
          </Link>
        ) : null}
      </section>

      {showGuide ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(27,21,10,0.52)] px-4">
          <div className="pdf-panel-cream w-full max-w-[360px] rounded-[0.95rem] px-4 py-4 text-left text-black shadow-[0_16px_28px_rgba(35,28,15,0.24)]">
            <p className="text-xl font-black text-[#2d5f1f]">Petunjuk Bermain</p>
            <div className="mt-3 space-y-2 text-sm font-black leading-[1.4] text-[#4e4028]">
              <p>1. Tekan `Mulai` untuk memulai permainan.</p>
              <p>2. Pelajari aksara, lalu jawab kuisnya.</p>
              <p>3. Latihan menulis dan membaca untuk menambah kemampuan.</p>
              <p>4. Kumpulkan skor tertinggi di setiap level.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="pdf-button-green mt-4 w-full rounded-[0.9rem] px-4 py-3 text-base font-black text-white"
            >
              Mengerti
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
