"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/game/speak-button";
import { learningLevelOneItems } from "@/lib/game-data";

function shuffleItems<T>(items: readonly T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export default function BelajarLevelOnePage() {
  const sessionItems = useMemo(() => shuffleItems(learningLevelOneItems), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = sessionItems[currentIndex];
  const isLastItem = currentIndex === sessionItems.length - 1;

  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[760px] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[620px]">
          <div className="flex items-start justify-between gap-3">
            <div className="pdf-button-green rounded-[1rem] px-4 py-2 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-5 sm:py-2.5 sm:text-[1.4rem]">
              Level 1 - Huruf Dasar
            </div>
            <div className="pdf-panel-cream rounded-[0.95rem] px-4 py-2 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.16)] sm:text-xl">
              {currentIndex + 1} / {sessionItems.length}
            </div>
          </div>

          <div className="pdf-panel-cream relative mt-4 rounded-[1.1rem] px-4 py-6 text-center text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-6 sm:py-8">
            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              <SpeakButton
                text={currentItem.latin}
                audioSrc={currentItem.audioSrc}
                label="Dengar"
                className="pdf-button-green flex h-12 min-h-0 w-12 items-center justify-center rounded-full p-0 text-[0] shadow-[0_14px_24px_rgba(35,28,15,0.18)]"
              />
            </div>
            <div className="font-aksara mt-2 text-[6rem] leading-none sm:text-[9.5rem]">
              {currentItem.aksara}
            </div>
            <div className="mt-5 text-2xl sm:text-3xl">
              Bacaan: <span className="font-black text-[#2f7f33]">{currentItem.latin}</span>
            </div>
            <p className="mt-2 text-sm font-semibold leading-[1.45] text-[#5f4d31] sm:text-base">
              Dengarkan suaranya, lalu ulangi bacanya dengan lantang.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (currentIndex === 0 ? null : setCurrentIndex((value) => value - 1))}
              className="pdf-button-beige min-w-[138px] rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] disabled:opacity-60 sm:text-lg"
              disabled={currentIndex === 0}
            >
              Sebelumnya
            </button>
            {isLastItem ? (
              <Link
                href="/quiz/level-1"
                className="pdf-button-green min-w-[150px] rounded-[0.95rem] px-5 py-3 text-center text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                Mulai Kuis
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => value + 1)}
                className="pdf-button-green min-w-[150px] rounded-[0.95rem] px-5 py-3 text-center text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                Selanjutnya
              </button>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <Link
              href="/level"
              className="pdf-button-yellow min-w-[180px] rounded-[0.95rem] px-5 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali ke Level
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
