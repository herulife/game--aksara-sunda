"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { quizLevelOneQuestions } from "@/lib/game-data";
import { saveQuizResultAction } from "@/app/game-actions";
import { useRewardSpeech } from "@/components/game/use-reward-speech";

type Phase =
  | "question"
  | "feedback"
  | "result"
  | "level-up"
  | "final-choice"
  | "complete";

export function QuizLevelOne() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const hasSavedResultRef = useRef(false);

  const currentQuestion = quizLevelOneQuestions[currentIndex];
  const totalQuestions = quizLevelOneQuestions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const heartsLeft = Math.max(0, 3 - wrongCount);
  const starsEarned = score >= 40 ? 3 : score >= 20 ? 2 : score > 0 ? 1 : 0;
  const passed = score >= 40;
  const rewardSpeechMessage =
    phase === "feedback"
      ? isCorrect
        ? "Hebat, jawaban hidep leres."
        : ""
      : phase === "result"
        ? passed
          ? `Alus. Nilai hidep ${score}. Hidep tiasa neraskeun ka level salajengna.`
          : `Tong hariwang. Nilai hidep ${score}. Cobian deui sangkan hasilna leuwih alus.`
        : phase === "level-up"
          ? "Wilujeng, hidep naek level."
          : phase === "complete"
            ? "Wilujeng. Hidep parantos ngarengsekeun ieu kaulinan."
            : "";

  useRewardSpeech({
    effect: phase === "feedback" && !isCorrect ? "error" : undefined,
    key: `${phase}-${currentIndex}-${selectedAnswer ?? "none"}-${score}`,
    message: rewardSpeechMessage,
    enabled: ["feedback", "result", "level-up", "complete"].includes(phase),
  });

  function handleAnswer(option: string) {
    if (phase !== "question") return;
    setSelectedAnswer(option);

    if (option === currentQuestion.answer) {
      setScore((value) => value + 10);
      setCorrectCount((value) => value + 1);
    } else {
      setWrongCount((value) => value + 1);
    }

    setPhase("feedback");
  }

  function persistQuizResult(nextScore: number, nextCorrectCount: number, nextWrongCount: number) {
    if (hasSavedResultRef.current) return;
    hasSavedResultRef.current = true;
    setSaveError(null);

    startSaving(async () => {
      const result = await saveQuizResultAction({
        levelNumber: 1,
        score: nextScore,
        correctCount: nextCorrectCount,
        wrongCount: nextWrongCount,
        totalQuestions,
      });

      if (!result.ok) {
        hasSavedResultRef.current = false;
        setSaveError(result.error ?? "Gagal menyimpan hasil kuis.");
      }
    });
  }

  function goNext() {
    if (isLastQuestion) {
      persistQuizResult(score, correctCount, wrongCount);
      setPhase("result");
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(null);
    setPhase("question");
  }

  function resetQuiz() {
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedAnswer(null);
    setSaveError(null);
    hasSavedResultRef.current = false;
    setPhase("question");
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-66px)] w-full max-w-[760px] flex-col px-3 pb-5 pt-4 sm:px-5 sm:pb-7 sm:pt-5">
      {phase === "result" ? (
        <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center text-center">
          <div className="pdf-panel-cream w-full rounded-[1.2rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="inline-flex rounded-full bg-[#d6e79f] px-5 py-2 text-base font-black text-[#2d5f1f] sm:text-xl">
              HASIL PERMAINAN
            </div>

            <h2 className="mt-4 text-7xl font-black leading-none text-[#2d5f1f] sm:text-[6.5rem]">
              {score}
            </h2>

            <div className="mt-4 text-3xl font-black leading-none tracking-[0.15em] text-[#f2c84f] sm:text-4xl">
              {"*".repeat(starsEarned)}
              <span className="text-[#d7ccb0]">{"*".repeat(3 - starsEarned)}</span>
            </div>

            <p className="mt-4 text-lg font-black sm:text-2xl">
              {passed ? "Cukup Baik!" : "Masih Bisa Ditingkatkan"}
            </p>
            {isSaving ? (
              <p className="mt-2 text-sm font-black text-[#2d5f1f]">Menyimpan hasil...</p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}

            <div className="mt-5 space-y-2 text-left text-sm font-black sm:text-base">
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Benar</span>
                <span>:{correctCount}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Salah</span>
                <span>:{wrongCount}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Total Soal</span>
                <span>:{totalQuestions}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Level</span>
                <span>:1</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid w-full max-w-[540px] gap-3">
            <button
              type="button"
              onClick={resetQuiz}
              className="rounded-[1rem] bg-[#7db5e8] px-5 py-3 text-lg font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Main Lagi
            </button>
            {passed ? (
              <button
                type="button"
                onClick={() => setPhase("level-up")}
                className="pdf-button-green rounded-[1rem] px-5 py-3 text-lg font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Lanjut Level
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="pdf-button-beige rounded-[1rem] px-5 py-3 text-center text-lg font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Menu Utama
              </Link>
            )}
          </div>
        </div>
      ) : phase === "level-up" ? (
        <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center justify-center text-center">
          <div className="pdf-panel-cream w-full rounded-[1.2rem] px-4 py-6 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-8">
            <p className="text-lg font-black sm:text-2xl">Skor Akhir</p>
            <h2 className="mt-3 text-7xl font-black leading-none text-[#2d7f33] sm:text-[6.5rem]">
              {score}
            </h2>
            <p className="mt-4 text-base font-black leading-[1.25] sm:text-xl">
              Skor memenuhi syarat untuk naik level!
            </p>
            <div className="mt-6 flex justify-center">
              <Image
                src="/assets/extracted/trophy.png"
                alt="Piala"
                width={803}
                height={810}
                className="h-auto w-[120px] sm:w-[150px]"
              />
            </div>
            <button
              type="button"
              onClick={() => setPhase("final-choice")}
              className="pdf-button-green mt-6 rounded-[1rem] px-5 py-3 text-lg font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Naik Ke Level Berikutnya
            </button>
          </div>
        </div>
      ) : phase === "final-choice" ? (
        <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center justify-center text-center">
          <div className="w-full rounded-[1.2rem] bg-[rgba(248,240,210,0.92)] px-4 py-6 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-7">
            <p className="text-3xl font-black leading-none text-[#2d5f1f] sm:text-4xl">
              PILIHAN AKHIR
            </p>

            <div className="mt-5 flex justify-center">
              <Image
                src="/assets/extracted/character-boy-full.png"
                alt="Karakter pilihan akhir"
                width={565}
                height={1335}
                className="h-auto w-[104px] sm:w-[136px]"
              />
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={resetQuiz}
                className="pdf-button-blue rounded-[1rem] px-5 py-3 text-lg font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Main Lagi
              </button>
              <button
                type="button"
                onClick={() => setPhase("complete")}
                className="pdf-button-green rounded-[1rem] px-5 py-3 text-lg font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Lanjut Level
              </button>
              <Link
                href="/progres"
                className="pdf-button-beige rounded-[1rem] px-5 py-3 text-lg font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Lihat Progres
              </Link>
              <Link
                href="/dashboard"
                className="rounded-[1rem] bg-white/78 px-5 py-3 text-lg font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Kembali ke Menu
              </Link>
            </div>
          </div>
        </div>
      ) : phase === "complete" ? (
        <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center justify-center text-center">
          <div className="w-full rounded-[1.2rem] bg-[rgba(248,240,210,0.92)] px-4 py-6 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-7">
            <p className="text-3xl font-black text-[#2d5f1f] sm:text-4xl">WILUJENG!</p>
            <p className="mt-4 text-base font-black leading-[1.35] sm:text-lg">
              Kamu telah menyelesaikan permainan ini.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Image
                src="/assets/extracted/character-boy-full.png"
                alt="Karakter laki-laki"
                width={565}
                height={1335}
                className="h-auto w-[76px] sm:w-[94px]"
              />
              <Image
                src="/assets/extracted/character-girl-full.png"
                alt="Karakter perempuan"
                width={637}
                height={1547}
                className="h-auto w-[76px] sm:w-[94px]"
              />
            </div>
            <Link
              href="/dashboard"
              className="pdf-button-green mt-6 inline-flex rounded-[1rem] px-6 py-3 text-lg font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Selesai
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-shell flex w-full flex-wrap items-start justify-between gap-3 rounded-[1.5rem] px-4 py-4 sm:px-5 sm:py-5">
            <div className="pdf-button-green max-w-full rounded-[1rem] px-4 py-2.5 text-xl font-black leading-[1.05] text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:max-w-[70%] sm:rounded-[1.2rem] sm:px-5 sm:py-3 sm:text-3xl">
              Level 1 - Huruf Dasar
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Image
                    key={index}
                    src={index < heartsLeft ? "/assets/extracted/heart-full.png" : "/assets/extracted/heart-empty.png"}
                    alt=""
                    aria-hidden="true"
                    width={421}
                    height={379}
                    className="h-7 w-auto sm:h-9"
                  />
                ))}
              </div>
              <div
                className={`rounded-[0.9rem] px-3 py-2 text-lg font-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-4 sm:py-2.5 sm:text-2xl ${
                  phase === "feedback" ? "pdf-button-green text-white" : "pdf-panel-cream text-black"
                }`}
              >
                Skor: {score}
              </div>
            </div>
          </div>

          {phase === "question" ? (
            <>
              <div className="quiz-main-panel mt-4 w-full rounded-[1.15rem] px-4 py-4 text-center text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:rounded-[1.35rem] sm:px-6 sm:py-6">
                <p className="text-xl font-black leading-[1.14] tracking-[-0.01em] sm:text-3xl">
                  {currentQuestion.prompt}
                </p>
                <div className="font-aksara mt-3 text-[3.6rem] leading-none text-[#1f1a10] drop-shadow-[0_2px_0_rgba(255,255,255,0.28)] sm:mt-4 sm:text-[5.8rem] lg:text-[6.6rem]">
                  {currentQuestion.aksara}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    className="quiz-answer-secondary rounded-[1rem] border border-[rgba(164,136,74,0.34)] px-3 py-3.5 text-2xl font-black leading-none text-[#58411a] shadow-[0_16px_28px_rgba(35,28,15,0.18)] transition hover:-translate-y-1 sm:rounded-[1.2rem] sm:py-4 sm:text-4xl"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <div className="pdf-button-green rounded-[0.9rem] px-3 py-2 text-xl font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-4 sm:py-2.5 sm:text-2xl">
                  {currentIndex + 1}/{totalQuestions}
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto mt-4 flex w-full max-w-[620px] flex-1 flex-col items-center">
              <div className="pdf-panel-cream w-full rounded-[1rem] px-4 pb-6 pt-5 text-center text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:rounded-[1.2rem] sm:px-6 sm:pb-7 sm:pt-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <Image
                    src={isCorrect ? "/assets/extracted/icon-check-circle.png" : "/assets/extracted/icon-close-circle.png"}
                    alt=""
                    width={512}
                    height={512}
                    className="h-16 w-16 sm:h-20 sm:w-20"
                  />
                  <div
                    className={`text-4xl font-black leading-none drop-shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:text-6xl ${
                      isCorrect ? "text-[#2f8b34]" : "text-[#d1000f]"
                    }`}
                  >
                    {isCorrect ? "LERES!" : "LEPAT!"}
                  </div>
                </div>

                <p className="mt-4 text-xl font-black leading-[1.15] sm:text-3xl">
                  {isCorrect ? "Jawabanmu benar!" : "Jawaban yang benar adalah:"}
                </p>

                <div className="mt-3 text-3xl font-black leading-none sm:text-5xl">
                  {currentQuestion.answer}
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="relative">
                    {isCorrect ? (
                      <>
                        <Image
                          src="/assets/extracted/character-correct.png"
                          alt="Karakter pamaen bener"
                          width={524}
                          height={1192}
                          className="h-auto w-[134px] drop-shadow-[0_14px_24px_rgba(39,30,14,0.18)] sm:w-[176px]"
                        />
                      </>
                    ) : (
                      <Image
                        src="/assets/extracted/character-wrong.png"
                        alt="Karakter pamaen mikir"
                        width={718}
                        height={1208}
                        className="h-auto w-[146px] drop-shadow-[0_14px_24px_rgba(39,30,14,0.18)] sm:w-[190px]"
                      />
                    )}
                  </div>
                </div>

                <p className="mx-auto mt-3 max-w-[500px] text-base font-black leading-[1.25] sm:text-xl">
                  {isCorrect
                    ? `${selectedAnswer} mangrupa jawaban anu leres.`
                    : `Anjeun milih ${selectedAnswer}. Jawaban anu leres nyaeta ${currentQuestion.answer}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="pdf-button-green -mt-4 rounded-[1rem] px-5 py-2.5 text-3xl font-black text-white shadow-[0_18px_28px_rgba(35,28,15,0.2)] sm:-mt-5 sm:rounded-[1.2rem] sm:px-7 sm:py-3 sm:text-4xl"
              >
                Lanjut
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
