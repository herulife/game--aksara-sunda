"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { SpeakButton } from "@/components/game/speak-button";
import { saveReadingResultAction } from "@/app/game-actions";
import { useRewardSpeech } from "@/components/game/use-reward-speech";

type Phase = "question" | "correct" | "wrong" | "saved";

const targetLetter = "\u1B8A";
const expected = "ka";

export default function MembacaLevelOnePage() {
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>("question");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  useRewardSpeech({
    effect:
      phase === "correct" ? "success" : phase === "wrong" ? "error" : undefined,
    key: `membaca-${phase}-${answer.trim().toLowerCase() || "kosong"}`,
    enabled: phase !== "question",
    message:
      phase === "correct" || phase === "wrong"
        ? ""
        : phase === "saved"
            ? "Alus. Hasil latihan maca parantos kasimpen."
            : "",
  });

  function submitAnswer() {
    if (answer.trim().toLowerCase() === expected) {
      setPhase("correct");
      return;
    }

    setPhase("wrong");
  }

  function persistReading(correctAnswer: string) {
    setSaveError(null);
    startSaving(async () => {
      const result = await saveReadingResultAction({
        levelNumber: 1,
        promptText: targetLetter,
        expectedText: expected,
        answerText: correctAnswer,
        isCorrect: true,
      });

      if (!result.ok) {
        setSaveError(result.error ?? "Gagal menyimpan latihan membaca.");
      }
    });
  }

  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Membaca Kata
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-66px)] w-full max-w-[760px] flex-col items-center px-3 pb-5 pt-4 text-center sm:px-5 sm:pb-8 sm:pt-5">
        {phase === "question" ? (
          <>
            <div className="flex w-full max-w-[540px] items-start justify-between gap-3">
              <div className="pdf-button-green rounded-[1rem] px-4 py-2.5 text-lg font-black text-white sm:text-2xl">
                Membaca Kata
              </div>
              <div className="pdf-button-green rounded-[0.9rem] px-3 py-2 text-lg font-black text-white sm:text-2xl">
                1/5
              </div>
            </div>

            <div className="pdf-panel-cream mt-4 w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:px-5">
              <p className="text-lg font-black leading-[1.2] sm:text-[1.9rem]">
                Baca kata aksara Sunda berikut!
              </p>

              <div className="mt-5 rounded-[1rem] bg-white/82 px-4 py-6 shadow-inner">
                <div className="mx-auto flex h-[150px] max-w-[240px] items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                  <div className="font-aksara text-[3.6rem] leading-none sm:text-[4.8rem]">{targetLetter}</div>
                </div>
              </div>
            </div>

            <div className="pdf-panel-cream mt-4 w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] sm:px-5">
              <p className="text-base font-black sm:text-xl">Tulis bacaan latin dibawah ini</p>
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
            <p className="mt-4 text-lg font-black sm:text-2xl">Jawabanmu benar!</p>

            <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner">
              <div className="mx-auto flex h-[165px] max-w-[230px] flex-col items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[4.4rem] leading-none sm:text-[5.6rem]">{targetLetter}</div>
                <div className="mt-2 text-3xl font-black sm:text-4xl">{expected}</div>
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
                membaca dengan benar.
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SpeakButton
                text={expected}
                audioSrc="/assets/audio/ka.wav"
                label="Dengar Lagi"
                className="pdf-button-sky flex items-center justify-center gap-2.5 rounded-[0.9rem] px-4 py-3 text-base font-black text-white sm:text-lg"
              />
              <button
                type="button"
                onClick={() => {
                  persistReading(answer.trim().toLowerCase());
                  setPhase("saved");
                }}
                className="pdf-button-green rounded-[1rem] px-4 py-3 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        ) : phase === "wrong" ? (
          <div className="pdf-panel-cream w-full max-w-[540px] rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="mx-auto inline-flex rounded-full bg-[#ffe1dd] px-5 py-2 text-xl font-black text-[#d1000f] ring-2 ring-[#ee8a84] sm:text-3xl">
              SALAH!
            </div>
            <p className="mt-4 text-lg font-black sm:text-2xl">Yuk coba lagi!</p>

            <div className="mt-4 rounded-[1rem] bg-white/82 px-4 py-5 shadow-inner">
              <div className="mx-auto flex h-[165px] max-w-[230px] flex-col items-center justify-center rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0]">
                <div className="font-aksara text-[4.4rem] leading-none sm:text-[5.6rem]">{targetLetter}</div>
                <div className="mt-2 text-3xl font-black sm:text-4xl">{expected}</div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-center gap-4">
              <Image
                src="/assets/characters/boy-thinking.png"
                alt="Karakter salah"
                width={717}
                height={1076}
                className="h-auto w-[105px] sm:w-[140px]"
              />
              <div className="rounded-[1rem] bg-[#efe5b9] px-4 py-3 text-left text-sm font-black text-[#3d351e] shadow-[0_10px_18px_rgba(35,28,15,0.15)] sm:text-base">
                Perhatikan bentuk aksara
                <br />
                dan dengarkan suaranya ya.
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SpeakButton
                text={expected}
                audioSrc="/assets/audio/ka.wav"
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
            <p className="mt-3 text-base font-black sm:text-xl">
              Latihan membacamu berhasil disimpan.
            </p>
            {isSaving ? (
              <p className="mt-2 text-sm font-black text-[#2d5f1f]">Menyimpan hasil...</p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}
            <div className="mt-5 flex items-end justify-center gap-4">
              <Image
                src="/assets/characters/avatar-girl.png"
                alt="Karakter"
                width={377}
                height={377}
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
              Membaca setiap hari membuatmu semakin pintar!
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
