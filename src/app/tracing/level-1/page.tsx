"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveTracingResultAction } from "@/app/game-actions";
import { TracingCanvas } from "@/components/game/tracing-canvas";
import { useRewardSpeech } from "@/components/game/use-reward-speech";
import { tracingLevelOneItems } from "@/lib/game-data";

type Phase = "practice" | "success" | "retry" | "saved";

function shuffleItems<T>(items: readonly T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export default function TracingLevelOnePage() {
  const [sessionItems, setSessionItems] = useState(() => shuffleItems(tracingLevelOneItems));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("practice");
  const [attemptCount, setAttemptCount] = useState(1);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [likelyCorrect, setLikelyCorrect] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const startedAtRef = useRef<number | null>(null);

  const currentItem = sessionItems[currentIndex];
  const isLastItem = currentIndex === sessionItems.length - 1;

  useRewardSpeech({
    effect: phase === "success" ? "success" : phase === "retry" ? "error" : undefined,
    key: `tracing-${currentItem.id}-${phase}-${attemptCount}`,
    enabled: phase !== "practice",
    message: phase === "saved" ? "Bagus. Semua latihan menulis sudah disimpan." : "",
  });

  function resetPractice() {
    setHasInk(false);
    setLikelyCorrect(false);
    startedAtRef.current = null;
    setPhase("practice");
  }

  function moveToNextQuestion() {
    setHasInk(false);
    setLikelyCorrect(false);
    startedAtRef.current = null;
    setAttemptCount(1);
    setSaveError(null);
    setCurrentIndex((value) => value + 1);
    setPhase("practice");
  }

  function resetSession() {
    setSessionItems(shuffleItems(tracingLevelOneItems));
    setCurrentIndex(0);
    setHasInk(false);
    setLikelyCorrect(false);
    startedAtRef.current = null;
    setAttemptCount(1);
    setSaveError(null);
    setPhase("practice");
  }

  function markTraceStarted(hasStarted: boolean) {
    setHasInk(hasStarted);
    if (hasStarted && startedAtRef.current === null) {
      startedAtRef.current = performance.now();
    }
  }

  function handleTraceStateChange(state: { hasInk: boolean; likelyCorrect: boolean }) {
    setHasInk(state.hasInk);
    setLikelyCorrect(state.likelyCorrect);
  }

  function persistSuccess() {
    setSaveError(null);

    startSaving(async () => {
      const durationSeconds =
        startedAtRef.current === null
          ? 5
          : Math.max(5, Math.round((performance.now() - startedAtRef.current) / 1000));

      const result = await saveTracingResultAction({
        levelNumber: 1,
        targetText: currentItem.aksara,
        attemptCount,
        durationSeconds,
        completed: true,
      });

      if (!result.ok) {
        setSaveError(result.error ?? "Gagal menyimpan latihan menulis.");
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
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[760px] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[620px]">
          {phase === "practice" ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="pdf-button-green rounded-[1rem] px-4 py-2 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-5 sm:py-2.5 sm:text-[1.4rem]">
                  Latihan Menulis
                </div>
                <div className="pdf-panel-cream rounded-[0.95rem] px-4 py-2 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.16)] sm:text-xl">
                  {currentIndex + 1} / {sessionItems.length}
                </div>
              </div>

              <div className="pdf-panel-cream mt-4 rounded-[1.1rem] px-4 py-5 text-center text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
                <p className="text-lg font-black sm:text-3xl">Tebalkan aksara Sunda berikut.</p>

                <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-4 shadow-inner sm:px-5 sm:py-5">
                  <TracingCanvas
                    guideLetter={currentItem.aksara}
                    onInkChange={markTraceStarted}
                    onTraceStateChange={handleTraceStateChange}
                  />
                </div>

                <p className="mt-3 text-sm font-semibold leading-[1.45] text-[#5f4d31] sm:text-base">
                  Ikuti garis tipisnya sampai bentuk huruf terasa pas.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttemptCount((value) => value + 1);
                    setPhase("retry");
                  }}
                  className="pdf-button-sky flex min-h-[58px] items-center justify-center rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:min-h-[66px] sm:text-xl"
                >
                  Ulangi
                </button>
                <button
                  type="button"
                  onClick={() => setPhase(hasInk && likelyCorrect ? "success" : "retry")}
                  className={`flex min-h-[58px] items-center justify-center rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:min-h-[66px] sm:text-xl ${
                    hasInk && likelyCorrect ? "pdf-button-green" : "pdf-button-muted"
                  }`}
                >
                  {hasInk && likelyCorrect ? (isLastItem ? "Simpan Hasil" : "Selanjutnya") : "Ikuti Huruf Dulu"}
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href="/dashboard"
                  className="pdf-button-beige flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Kembali ke Menu
                </Link>
                <Link
                  href="/membaca/level-1"
                  className="pdf-button-yellow flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Latihan Membaca
                </Link>
              </div>

              {!hasInk ? (
                <p className="mt-4 text-center text-sm font-black text-[#8b5d36]">
                  Sentuh area menulis terlebih dahulu, lalu lanjutkan.
                </p>
              ) : !likelyCorrect ? (
                <p className="mt-4 text-center text-sm font-black text-[#8b5d36]">
                  Coretanmu belum cukup mengikuti bentuk huruf. Coba tebalkan sesuai contoh.
                </p>
              ) : null}
            </>
          ) : phase === "success" ? (
            <div className="pdf-panel-cream rounded-[1.15rem] px-4 py-5 text-center text-black shadow-[0_18px_32px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
              <div className="mx-auto inline-flex rounded-full bg-[#edf6d8] px-5 py-2 text-xl font-black text-[#2f8b34] ring-2 ring-[#8cc46a] sm:text-3xl">
                BENAR!
              </div>
              <p className="mt-3 text-lg font-black sm:text-2xl">Tulisanmu sudah sesuai.</p>

              <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-4 shadow-inner">
                <div className="mx-auto flex h-[146px] max-w-[220px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                  <div className="font-aksara text-[4rem] leading-none sm:text-[5.1rem]">{currentItem.aksara}</div>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-center gap-3">
                <Image
                  src="/assets/characters/boy-correct.png"
                  alt="Karakter benar"
                  width={717}
                  height={1076}
                  className="h-auto w-[92px] sm:w-[126px]"
                />
                <div className="rounded-[1rem] bg-[#efe5b9] px-3.5 py-2.5 text-left text-xs font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-sm">
                  Bagus sekali.
                  <br />
                  Kamu sudah menulis dengan benar.
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttemptCount((value) => value + 1);
                    resetPractice();
                  }}
                  className="pdf-button-sky rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Ulangi
                </button>
                <button
                  type="button"
                  onClick={persistSuccess}
                  className="pdf-button-green rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  {isLastItem ? "Simpan Hasil" : "Selanjutnya"}
                </button>
              </div>
            </div>
          ) : phase === "retry" ? (
            <div className="pdf-panel-cream rounded-[1.15rem] px-4 py-5 text-center text-black shadow-[0_18px_32px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
              <div className="mx-auto inline-flex rounded-full bg-[#ffe1dd] px-5 py-2 text-xl font-black text-[#d1000f] ring-2 ring-[#ee8a84] sm:text-3xl">
                COBA LAGI
              </div>
              <p className="mt-3 text-lg font-black sm:text-2xl">Tulisanmu belum pas.</p>

              <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-4 shadow-inner">
                <div className="mx-auto flex h-[146px] max-w-[220px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                  <div className="font-aksara text-[4rem] leading-none text-black/18 sm:text-[5.1rem]">
                    {currentItem.aksara}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-center gap-3">
                <Image
                  src="/assets/characters/boy-thinking.png"
                  alt="Karakter mencoba lagi"
                  width={717}
                  height={1076}
                  className="h-auto w-[92px] sm:w-[126px]"
                />
                <div className="rounded-[1rem] bg-[#efe5b9] px-3.5 py-2.5 text-left text-xs font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-sm">
                  Perhatikan bentuk hurufnya,
                  <br />
                  lalu tebalkan sekali lagi.
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={resetPractice}
                  className="pdf-button-sky rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Ulangi
                </button>
                <button
                  type="button"
                  onClick={resetPractice}
                  className="pdf-button-red rounded-[0.95rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : (
            <div className="pdf-panel-cream rounded-[1.15rem] px-4 py-5 text-center text-black shadow-[0_18px_32px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
              <p className="text-3xl font-black text-[#2f8b34] sm:text-5xl">Bagus!</p>
              <p className="mt-2.5 text-sm font-black sm:text-lg">
                Semua latihan menulis berhasil disimpan.
              </p>
              {isSaving ? (
                <p className="mt-2 text-sm font-black text-[#2d5f1f]">Menyimpan hasil...</p>
              ) : null}
              {saveError ? (
                <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
              ) : null}
              <div className="mt-4 flex items-end justify-center gap-3">
                <Image
                  src="/assets/characters/boy-correct.png"
                  alt="Karakter"
                  width={717}
                  height={1076}
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
                Terus berlatih setiap hari supaya tulisanmu semakin rapi.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard"
                  className="pdf-button-green rounded-[0.95rem] px-6 py-3 text-center text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Kembali ke Menu
                </Link>
                <button
                  type="button"
                  onClick={resetSession}
                  className="pdf-button-sky rounded-[0.95rem] px-6 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
                >
                  Main Acak Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
