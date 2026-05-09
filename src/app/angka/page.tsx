"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { learningNumberItems } from "@/lib/game-data";

function shuffleItems<T>(items: readonly T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export default function AngkaPage() {
  const [sessionItems] = useState(() => shuffleItems(learningNumberItems));
  const featuredItem = sessionItems[0];

  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Belajar Angka
      </header>

      <section className="screen-stage relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center px-3 text-center sm:px-5">
        <div className="flex w-full max-w-[620px] flex-wrap items-start justify-between gap-3">
          <div className="pdf-button-yellow rounded-[1rem] px-4 py-2.5 text-left text-xl font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:rounded-[1.3rem] sm:px-5 sm:py-3 sm:text-3xl">
            Angka Sunda
          </div>
          <div className="pdf-button-green rounded-[0.9rem] px-3 py-2 text-xl font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:rounded-[1rem] sm:px-4 sm:py-2.5 sm:text-2xl">
            {sessionItems.length} angka
          </div>
        </div>

        <div className="pdf-panel-cream mt-4 w-full max-w-[620px] rounded-[1.1rem] px-4 py-4 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:mt-5 sm:rounded-[1.4rem] sm:px-6 sm:py-6">
          <p className="responsive-card-title font-black">Kenali heula angka Sunda dasar.</p>
          <div className="font-aksara mt-3 text-[3.4rem] leading-none text-black sm:mt-4 sm:text-[5.6rem] lg:text-[6.6rem]">
            {featuredItem.aksara}
          </div>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[#2d5f1f] sm:text-lg">
            Angka Latin
          </p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{featuredItem.latin}</p>
          <p className="responsive-card-copy mx-auto mt-3 max-w-[560px] font-semibold text-[#5f4d31]">
            {featuredItem.note}
          </p>
        </div>

        <div className="mt-3.5 grid w-full max-w-[620px] gap-2.5 sm:mt-4 sm:grid-cols-2">
          <Link
            href="/quiz/angka"
            className="pdf-button-green flex min-h-[62px] items-center justify-center gap-2.5 rounded-[1rem] px-4 py-3 text-white shadow-[0_16px_28px_rgba(35,28,15,0.18)] responsive-button-text font-black sm:min-h-[76px] sm:rounded-[1.2rem]"
          >
            <Image
              src="/assets/icons/book-open.png"
              alt=""
              width={544}
              height={544}
              className="h-5 w-5 sm:h-7 sm:w-7"
            />
            <span>Mulai Kuis Angka</span>
          </Link>
          <Link
            href="/level"
            className="pdf-button-beige flex min-h-[62px] items-center justify-center gap-2.5 rounded-[1rem] px-4 py-3 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] responsive-button-text font-black sm:min-h-[76px] sm:rounded-[1.2rem]"
          >
            <span>Lihat Level Lain</span>
          </Link>
        </div>

        <div className="mt-3.5 grid w-full max-w-[620px] gap-2.5 sm:mt-4 sm:grid-cols-2">
          {sessionItems.map((item, index) => (
            <div
              key={item.id}
              className={`rounded-[1rem] px-4 py-3.5 text-left shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:rounded-[1.2rem] ${
                index === 0 ? "bg-[#e6d38f] text-black" : "pdf-panel-cream text-black"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black sm:text-xl">{item.title}</p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">Latin: {item.latin}</p>
                </div>
                <div className="font-aksara flex-none text-[1.9rem] leading-none sm:text-4xl">{item.aksara}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex w-full max-w-[620px] justify-start">
          <Link
            href="/dashboard"
            className="pdf-button-green rounded-[1rem] px-4 py-2.5 text-xl font-black text-white shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:rounded-[1.2rem] sm:px-5 sm:py-3 sm:text-2xl"
          >
            {"< KEMBALI"}
          </Link>
        </div>
      </section>
    </main>
  );
}
