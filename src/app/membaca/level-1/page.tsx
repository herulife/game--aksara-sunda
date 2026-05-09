"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { SpeakButton } from "@/components/game/speak-button";
import { saveReadingResultAction } from "@/app/game-actions";
import { useRewardSpeech } from "@/components/game/use-reward-speech";
import { readingLevelOneItems } from "@/lib/game-data";

type Phase = "question" | "correct" | "wrong" | "saved";

function shuffleItems<T>(items: readonly T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export default function MembacaLevelOnePage() {
  const [sessionItems, setSessionItems] = useState(() => shuffleItems(readingLevelOneItems));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>("question");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const currentItem = sessionItems[currentIndex];
  const totalItems = sessionItems.length;
  const isLastItem = currentIndex === totalItems - 1;

  useRewardSpeech({
    effect: phase === "correct" ? "success" : phase === "wrong" ? "error" : undefined,
    key: `membaca-${currentItem.id}-${phase}-${answer.trim().toLowerCase() || "kosong"}`,
    enabled: phase !== "question",
    message:
      phase === "correct" || phase === "wrong"
        ? ""
        : phase === "saved"
          ? "Alus. Sadaya latihan maca parantos kasimpen."
          : "",
  });

  function submitAnswer() {
    if (answer.trim().toLowerCase() === currentItem.expected) {
      setPhase("correct");
      return;
    }

    setPhase("wrong");
  }

  function moveToNextQuestion() {
    setAnswer("");
    setSaveError(null);
    setCurrentIndex((value) => value + 1);
    setPhase("question");
  }

  function resetSession() {
    setSessionItems(shuffleItems(readingLevelOneItems));
    setCurrentIndex(0);
    setAnswer("");
    setSaveError(null);
    setPhase("question");
  }

  function persistReading() {
    setSaveError(null);

    startSaving(async () => {
      const result = await saveReadingResultAction({
        levelNumber: 1,
        promptText: currentItem.aksara,
        expectedText: currentItem.expected,
        answerText: currentItem.expected,
        isCorrect: true,
      });

      if (!result.ok) {
        setSaveError(result.error ?? "Gagal menyimpan latihan membaca.");
        return;
      }

      if (isLastItem) {
        setPhase("saved");
        return;
      }

      moveToNextQuestion();
    });
  }

  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Membaca Kata
      </header>

      <section className="screen-stage relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center px-3 text-center sm:px-5">
        {phase === "question" ? (
          <>
            <div className="flex w-full max-w-[540px] items-start justify-between gap-3">
              <div className="pdf-button-green rounded-[1rem] px-4 py-2.5 text-lg font-black text-white sm:text-2xl">
                Membaca Kata
              </div>
              <div className="pdf-button-green rounded-[0.9rem] px-3 py-2 text-lg font-black text-white sm:text-2xl">
                {currentIndex + 1}/{totalItems}
              </div>
            </div>

            <div className="pdf-panel-cream mt-3 w-full max-w-[540px] rounded-[1.1rem] px-4 py-3.5 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:px-5">
              <p className="text-lg font-black leading-[1.2] sm:text-[1.9rem]">
                Baca kata aksara Sunda berikut!
              </p>

              <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner">
                <div className="mx-auto flex h-[132px] max-w-[220px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                  <div className="font-aksara text-[3.2rem] leading-none sm:text-[4.4rem]">
                    {currentItem.aksara}
                  </div>
                </div>
              </div>
            </div>

            <div className="pdf-panel-cream mt-3 w-full max-w-[540px] rounded-[1.1rem] px-4 py-3.5 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:px-5">
              <p className="text-sm font-black sm:text-lg">Tulis bacaan latin dibawah ini</p>
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Ketik jawaban..."
                className="mockup-input mt-4 text-base sm:text-lg"
              />
              <button
                type="button"
                onClick={submitAnswer}
                className="pdf-button-green mt-4 rounded-[1rem] px-6 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                Cek Jawaban
              </button>
            </div>
          </>
        ) : phase === "correct" ? (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="mx-auto inline-flex rounded-full bg-[#edf6d8] px-5 py-2 text-xl font-black text-[#2f8b34] ring-2 ring-[#8cc46a] sm:text-3xl">
              LERES!
            </div>
            <p className="mt-3 text-lg font-black sm:text-2xl">Jawabanmu benar!</p>

            <div className="mt-3 rounded-[1rem] bg-white/82 px-4 py-4 shadow-inner">
              <div className="mx-auto flex h-[148px] max-w-[220px] flex-col items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[3.8rem] leading-none sm:text-[5rem]">
                  {currentItem.aksara}
                </div>
                <div className="mt-1.5 text-[1.7rem] font-black sm:text-[2.2rem]">{currentItem.expected}</div>
              </div>
            </div>

            <div className="mt-3 flex items-end justify-center gap-3">
              <Image
                src="/assets/characters/boy-correct.png"
                alt="Karakter benar"
                width={717}
                height={1076}
                className="h-auto w-[90px] sm:w-[126px]"
              />
              <div className="rounded-[1rem] bg-[#efe5b9] px-3.5 py-2.5 text-left text-xs font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-sm">
                Hebat! Kamu sudah
                <br />
                membaca dengan benar.
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <SpeakButton
                text={currentItem.expected}
                audioSrc={currentItem.audioSrc}
                label="Dengar Lagi"
                className="pdf-button-sky flex items-center justify-center gap-2.5 rounded-[0.9rem] px-4 py-3 text-base font-black text-white sm:text-lg"
              />
              <button
                type="button"
                onClick={persistReading}
                className="pdf-button-green rounded-[1rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                {isLastItem ? "Simpan Hasil" : "Selanjutnya"}
              </button>
            </div>
          </div>
        ) : phase === "wrong" ? (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="mx-auto inline-flex rounded-full bg-[#ffe1dd] px-5 py-2 text-xl font-black text-[#d1000f] ring-2 ring-[#ee8a84] sm:text-3xl">
              SALAH!
            </div>
            <p className="mt-3 text-lg font-black sm:text-2xl">Yuk coba lagi!</p>

            <div className="mt-3 rounded-[1rem] bg-white/82 px-4 py-4 shadow-inner">
              <div className="mx-auto flex h-[148px] max-w-[220px] flex-col items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[3.8rem] leading-none sm:text-[5rem]">
                  {currentItem.aksara}
                </div>
                <div className="mt-1.5 text-[1.7rem] font-black sm:text-[2.2rem]">{currentItem.expected}</div>
              </div>
            </div>

            <div className="mt-3 flex items-end justify-center gap-3">
              <Image
                src="/assets/characters/boy-thinking.png"
                alt="Karakter salah"
                width={717}
                height={1076}
                className="h-auto w-[90px] sm:w-[126px]"
              />
              <div className="rounded-[1rem] bg-[#efe5b9] px-3.5 py-2.5 text-left text-xs font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-sm">
                Perhatikan bentuk aksara
                <br />
                dan dengarkan suaranya ya.
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <SpeakButton
                text={currentItem.expected}
                audioSrc={currentItem.audioSrc}
                label="Dengar Lagi"
                className="pdf-button-sky flex items-center justify-center gap-2.5 rounded-[0.9rem] px-4 py-3 text-base font-black text-white sm:text-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setAnswer("");
                  setPhase("question");
                }}
                className="pdf-button-red rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <p className="text-3xl font-black text-[#2f8b34] sm:text-5xl">Bagus!</p>
            <p className="mt-2.5 text-sm font-black sm:text-lg">
              Sadaya latihan membacamu berhasil disimpan.
            </p>
            {isSaving ? (
              <p className="mt-2 text-sm font-black text-[#2d5f1f]">Menyimpan hasil...</p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}
            <div className="mt-4 flex items-end justify-center gap-3">
              <Image
                src="/assets/characters/avatar-girl.png"
                alt="Karakter"
                width={377}
                height={377}
                className="h-auto w-[82px] sm:w-[108px]"
              />
              <Image
                src="/assets/ui/trophy.png"
                alt="Hasil"
                width={1211}
                height={1139}
                className="h-auto w-[82px] sm:w-[108px]"
              />
            </div>
            <p className="mt-3 text-xs font-black leading-[1.35] sm:text-sm">
              Membaca setiap hari membuatmu semakin pintar!
            </p>
            <Link
              href="/dashboard"
              className="pdf-button-green mt-6 inline-flex rounded-[1rem] px-6 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali Ke Menu
            </Link>
            <button
              type="button"
              onClick={resetSession}
              className="pdf-button-sky mt-3 inline-flex rounded-[1rem] px-6 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Main Acak Lagi
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
