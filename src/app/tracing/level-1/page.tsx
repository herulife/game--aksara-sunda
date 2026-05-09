"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveTracingResultAction } from "@/app/game-actions";
import { TracingCanvas } from "@/components/game/tracing-canvas";
import { useRewardSpeech } from "@/components/game/use-reward-speech";
import { tracingLevelOneItems } from "@/lib/game-data";

type Phase = "practice" | "success" | "retry" | "saved";

export default function TracingLevelOnePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("practice");
  const [attemptCount, setAttemptCount] = useState(1);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [likelyCorrect, setLikelyCorrect] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const startedAtRef = useRef<number | null>(null);

  const currentItem = tracingLevelOneItems[currentIndex];
  const totalItems = tracingLevelOneItems.length;
  const isLastItem = currentIndex === totalItems - 1;

  useRewardSpeech({
    effect: phase === "success" ? "success" : phase === "retry" ? "error" : undefined,
    key: `tracing-${currentItem.id}-${phase}-${attemptCount}`,
    enabled: phase !== "practice",
    message:
      phase === "success" || phase === "retry"
        ? ""
        : phase === "saved"
          ? "Alus. Sadaya latihan nulis parantos kasimpen."
          : "",
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
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Latihan Menulis
      </header>

      <section className="screen-stage relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center px-3 text-center sm:px-5">
        {phase === "practice" ? (
          <>
            <div className="flex w-full max-w-[540px] items-start justify-between gap-3">
              <div className="pdf-button-green rounded-[1rem] px-4 py-2.5 text-lg font-black text-white sm:text-2xl">
                Latihan Menulis
              </div>
              <div className="pdf-button-green rounded-[0.9rem] px-3 py-2 text-lg font-black text-white sm:text-2xl">
                {currentIndex + 1}/{totalItems}
              </div>
            </div>

            <div className="pdf-panel-cream mt-3.5 w-full max-w-[540px] rounded-[1.2rem] px-4 py-4 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:px-5">
              <p className="text-lg font-black leading-[1.2] sm:text-[1.9rem]">
                Tebalkan aksara Sunda berikut!
              </p>

              <div className="mt-5 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner sm:px-5 sm:py-6">
                <TracingCanvas
                  guideLetter={currentItem.aksara}
                  onInkChange={markTraceStarted}
                  onTraceStateChange={handleTraceStateChange}
                />
                <p className="mt-3 text-sm font-black text-[#70592b] sm:text-base">
                  Ikuti bentuk huruf tipisnya sampai terasa pas.
                </p>
              </div>
            </div>

            <div className="mt-3.5 grid w-full max-w-[540px] grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAttemptCount((value) => value + 1);
                  setPhase("retry");
                }}
                className="pdf-button-sky rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-xl"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={() => setPhase(hasInk && likelyCorrect ? "success" : "retry")}
                className={`rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-xl ${
                  hasInk && likelyCorrect ? "pdf-button-green" : "pdf-button-muted"
                }`}
              >
                {hasInk && likelyCorrect ? (isLastItem ? "Simpan Hasil" : "Selanjutnya") : "Ikuti Huruf Dulu"}
              </button>
            </div>
            {!hasInk ? (
              <p className="mt-3 text-sm font-black text-[#8b5d36]">
                Sentuh area menulis dulu, lalu lanjutkan.
              </p>
            ) : !likelyCorrect ? (
              <p className="mt-3 text-sm font-black text-[#8b5d36]">
                Coretanmu belum cukup mengikuti bentuk huruf. Coba tebalkan sesuai contoh.
              </p>
            ) : null}
          </>
        ) : phase === "success" ? (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="mx-auto inline-flex rounded-full bg-[#edf6d8] px-5 py-2 text-xl font-black text-[#2f8b34] ring-2 ring-[#8cc46a] sm:text-3xl">
              LERES!
            </div>
            <p className="mt-4 text-lg font-black sm:text-2xl">Jawabanmu benar!</p>

            <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner">
              <div className="mx-auto flex h-[165px] max-w-[230px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[4.6rem] leading-none sm:text-[5.8rem]">{currentItem.aksara}</div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-center gap-4">
              <Image
                src="/assets/characters/boy-correct.png"
                alt="Karakter benar"
                width={717}
                height={1076}
                className="h-auto w-[105px] sm:w-[140px]"
              />
              <div className="rounded-[1rem] bg-[#efe5b9] px-4 py-3 text-left text-sm font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-base">
                Hebat! Kamu sudah
                <br />
                menulis dengan benar.
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setAttemptCount((value) => value + 1);
                  resetPractice();
                }}
                className="pdf-button-sky rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-lg"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={persistSuccess}
                className="pdf-button-green rounded-[1rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                {isLastItem ? "Simpan Hasil" : "Selanjutnya"}
              </button>
            </div>
          </div>
        ) : phase === "retry" ? (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="mx-auto inline-flex rounded-full bg-[#ffe1dd] px-5 py-2 text-xl font-black text-[#d1000f] ring-2 ring-[#ee8a84] sm:text-3xl">
              SALAH!
            </div>
            <p className="mt-4 text-lg font-black sm:text-2xl">Yuk coba lagi!</p>

            <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner">
              <div className="mx-auto flex h-[165px] max-w-[230px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[4.6rem] leading-none text-black/18 sm:text-[5.8rem]">
                  {currentItem.aksara}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-center gap-4">
              <Image
                src="/assets/characters/boy-thinking.png"
                alt="Karakter mencoba lagi"
                width={717}
                height={1076}
                className="h-auto w-[105px] sm:w-[140px]"
              />
              <div className="rounded-[1rem] bg-[#efe5b9] px-4 py-3 text-left text-sm font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-base">
                Perhatikan lagi hurufnya,
                <br />
                lalu coba lagi ya.
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={resetPractice}
                className="pdf-button-sky rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-lg"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={resetPractice}
                className="pdf-button-red rounded-[0.9rem] px-4 py-3 text-base font-black text-white transition hover:-translate-y-0.5 sm:text-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <p className="text-3xl font-black text-[#2f8b34] sm:text-5xl">Bagus!</p>
            <p className="mt-3 text-base font-black sm:text-xl">
              Sadaya latihan menulismu berhasil disimpan.
            </p>
            {isSaving ? (
              <p className="mt-2 text-sm font-black text-[#2d5f1f]">Menyimpan hasil...</p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}
            <div className="mt-5 flex items-end justify-center gap-4">
              <Image
                src="/assets/characters/boy-correct.png"
                alt="Karakter"
                width={717}
                height={1076}
                className="h-auto w-[96px] sm:w-[120px]"
              />
              <Image
                src="/assets/ui/trophy.png"
                alt="Hasil"
                width={1211}
                height={1139}
                className="h-auto w-[90px] sm:w-[115px]"
              />
            </div>
            <p className="mt-4 text-sm font-black leading-[1.35] sm:text-base">
              Terus berlatih setiap hari supaya makin hebat!
            </p>
            <Link
              href="/dashboard"
              className="pdf-button-green mt-6 inline-flex rounded-[1rem] px-6 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali Ke Menu
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
