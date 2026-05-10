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

          <div className="pdf-panel-cream mt-4 rounded-[1.1rem] px-4 py-5 text-center text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
            <p className="text-lg font-black sm:text-3xl">Kenali aksara Sunda berikut ini.</p>
            <div className="font-aksara mt-4 text-[5.2rem] leading-none sm:text-[8rem]">
              {currentItem.aksara}
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#2d5f1f] sm:text-sm">
              Bacaan Latin
            </p>
            <p className="mt-1 text-2xl font-black sm:text-4xl">{currentItem.latin}</p>
            <p className="mt-3 text-sm font-semibold leading-[1.45] text-[#5f4d31] sm:text-base">
              {currentItem.note}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SpeakButton
              text={currentItem.latin}
              audioSrc={currentItem.audioSrc}
              className="pdf-panel-cream flex min-h-[58px] items-center justify-center gap-2 rounded-[0.95rem] px-4 py-3 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:min-h-[66px] sm:text-xl"
            />

            {isLastItem ? (
              <Link
                href="/quiz/level-1"
                className="pdf-button-green flex min-h-[58px] items-center justify-center rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:min-h-[66px] sm:text-xl"
              >
                Mulai Kuis
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => value + 1)}
                className="pdf-button-green flex min-h-[58px] items-center justify-center rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:min-h-[66px] sm:text-xl"
              >
                Selanjutnya
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/level"
              className="pdf-button-beige flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali
            </Link>

            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => value - 1)}
                className="pdf-button-yellow flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                Sebelumnya
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
