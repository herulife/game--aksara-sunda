"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveQuizResultAction } from "@/app/game-actions";
import { useRewardSpeech } from "@/components/game/use-reward-speech";

type QuizQuestion = {
  id: string;
  aksara: string;
  prompt: string;
  options: readonly string[];
  answer: string;
};

type QuizLevelOneProps = {
  questions: readonly QuizQuestion[];
  title: string;
  levelLabel?: string;
  finalPrimaryHref?: string;
  finalPrimaryLabel?: string;
  finalSecondaryHref?: string;
  finalSecondaryLabel?: string;
};

type Phase =
  | "question"
  | "feedback"
  | "game-over"
  | "result"
  | "level-up"
  | "final-choice"
  | "complete";

function shuffleArray<T>(items: T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function createSessionQuestions(questions: readonly QuizQuestion[]) {
  return shuffleArray([...questions]).map((question) => ({
    ...question,
    options: shuffleArray([...question.options]),
  }));
}

export function QuizLevelOne({
  questions,
  title,
  levelLabel = "Level 1",
  finalPrimaryHref = "/membaca/level-1",
  finalPrimaryLabel = "Teraskeun ka Maca",
  finalSecondaryHref = "/tracing/level-1",
  finalSecondaryLabel = "Teraskeun ka Nulis",
}: QuizLevelOneProps) {
  const [sessionQuestions, setSessionQuestions] = useState(() => createSessionQuestions(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const hasSavedResultRef = useRef(false);

  const currentQuestion = sessionQuestions[currentIndex];
  const totalQuestions = sessionQuestions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const heartsLeft = Math.max(0, 3 - wrongCount);
  const starsEarned = score >= 40 ? 3 : score >= 20 ? 2 : score > 0 ? 1 : 0;
  const passed = score >= 40;
  const rewardSpeechMessage =
    phase === "feedback"
      ? ""
      : phase === "result"
        ? passed
          ? `Alus. Nilai hidep ${score}. Hidep tiasa neraskeun ka level salajengna.`
          : `Tong hariwang. Nilai hidep ${score}. Cobian deui sangkan hasilna leuwih alus.`
        : phase === "game-over"
          ? `Nyawa hidep parantos beak. Skor ahirna ${score}. Cobian deui, nya.`
        : phase === "level-up"
          ? "Wilujeng, hidep naek level."
          : phase === "complete"
            ? "Wilujeng. Hidep parantos ngarengsekeun ieu kaulinan."
            : "";

  useRewardSpeech({
    effect: phase === "feedback" ? (isCorrect ? "success" : "error") : undefined,
    key: `${phase}-${currentIndex}-${selectedAnswer ?? "none"}-${score}`,
    message: rewardSpeechMessage,
    enabled: ["feedback", "game-over", "result", "level-up", "complete"].includes(phase),
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
        setSaveError(result.error ?? "Hasil kuis teu tiasa kasimpen.");
      }
    });
  }

  function goNext() {
    if (phase === "feedback" && !isCorrect && heartsLeft === 0) {
      persistQuizResult(score, correctCount, wrongCount);
      setPhase("game-over");
      return;
    }

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
    setSessionQuestions(createSessionQuestions(questions));
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
    <div className="screen-stage relative z-10 mx-auto flex w-full max-w-[760px] flex-col px-3 sm:px-5">
      {phase === "game-over" ? (
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center text-center">
          <div className="feedback-panel-error pdf-panel-cream relative w-full overflow-hidden rounded-[1.1rem] px-4 py-4 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,219,214,0.72),rgba(255,219,214,0))]" />

            <div className="relative z-10 inline-flex rounded-full bg-[#ffe1dd] px-5 py-2 text-base font-black text-[#d1000f] ring-2 ring-[#ee8a84] sm:text-xl">
              NYAWA BEAK
            </div>

            <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Image
                  key={index}
                  src="/assets/extracted/heart-empty.png"
                  alt=""
                  width={512}
                  height={512}
                    className="h-8 w-8 opacity-90 sm:h-10 sm:w-10"
                />
              ))}
            </div>

            <div className="relative z-10 mt-3 flex justify-center">
              <Image
                src="/assets/extracted/character-wrong.png"
                alt="Karakter game over"
                width={718}
                height={1208}
                className="feedback-figure h-auto w-[108px] sm:w-[176px]"
              />
            </div>

            <p className="relative z-10 mt-3 text-base font-black sm:text-2xl">
              Kasempetan hidep di ieu level parantos béak.
            </p>
            <p className="relative z-10 mt-1.5 text-xs font-black text-[#5a4521] sm:text-base">
              Teu kunanaon, mangga kumpulkeun deui peunteun panghadéna ti mimiti.
            </p>

            {isSaving ? (
              <p className="relative z-10 mt-2 text-sm font-black text-[#2d5f1f]">Nuju nyimpen hasil...</p>
            ) : null}
            {saveError ? (
              <p className="relative z-10 mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}

            <div className="relative z-10 mt-4 space-y-1.5 text-left text-xs font-black sm:text-base">
              <div className="game-over-stat flex justify-between rounded-[0.9rem] px-4 py-2.5">
                <span>Peunteun</span>
                <span>:{score}</span>
              </div>
              <div className="game-over-stat flex justify-between rounded-[0.9rem] px-4 py-2.5">
                <span>Leres</span>
                <span>:{correctCount}</span>
              </div>
              <div className="game-over-stat flex justify-between rounded-[0.9rem] px-4 py-2.5">
                <span>Lepat</span>
                <span>:{wrongCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid w-full max-w-[520px] gap-2.5">
            <button
              type="button"
              onClick={resetQuiz}
              className="pdf-button-sky rounded-[0.95rem] px-5 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Cobian Deui
            </button>
            <Link
              href="/dashboard"
              className="pdf-button-beige rounded-[0.95rem] px-5 py-2.5 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Balik ka Ménu
            </Link>
          </div>
        </div>
      ) : phase === "result" ? (
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center text-center">
          <div className="pdf-panel-cream w-full rounded-[1.1rem] px-4 py-4 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-6">
            <div className="inline-flex rounded-full bg-[#d6e79f] px-5 py-2 text-base font-black text-[#2d5f1f] sm:text-xl">
              HASIL KAULINAN
            </div>

            <h2 className="mt-3 text-6xl font-black leading-none text-[#2d5f1f] sm:text-[6.5rem]">
              {score}
            </h2>

            <div className="mt-3 text-[1.7rem] font-black leading-none tracking-[0.15em] text-[#f2c84f] sm:text-4xl">
              {"*".repeat(starsEarned)}
              <span className="text-[#d7ccb0]">{"*".repeat(3 - starsEarned)}</span>
            </div>

            <p className="mt-3 text-base font-black sm:text-2xl">
              {passed ? "Saé Kacida!" : "Tiasa Ditingkatkeun Deui"}
            </p>
            {isSaving ? (
              <p className="mt-2 text-sm font-black text-[#2d5f1f]">Nuju nyimpen hasil...</p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm font-black text-[#bb4c35]">{saveError}</p>
            ) : null}

            <div className="mt-4 space-y-1.5 text-left text-xs font-black sm:text-base">
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Leres</span>
                <span>:{correctCount}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Lepat</span>
                <span>:{wrongCount}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Jumlah Soal</span>
                <span>:{totalQuestions}</span>
              </div>
              <div className="flex justify-between rounded-[0.9rem] bg-white/82 px-4 py-2.5">
                <span>Level</span>
                <span>:{levelLabel}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid w-full max-w-[520px] gap-2.5">
            <button
              type="button"
              onClick={resetQuiz}
              className="rounded-[0.95rem] bg-[#7db5e8] px-5 py-2.5 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Maén Deui
            </button>
            {passed ? (
              <button
                type="button"
                onClick={() => setPhase("level-up")}
                className="pdf-button-green rounded-[0.95rem] px-5 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Teraskeun Diajar
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="pdf-button-beige rounded-[0.95rem] px-5 py-2.5 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Ménu Utama
              </Link>
            )}
          </div>
        </div>
      ) : phase === "level-up" ? (
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center text-center">
          <div className="pdf-panel-cream w-full rounded-[1.1rem] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-8">
            <p className="text-base font-black sm:text-2xl">Peunteun Ahir</p>
            <h2 className="mt-2.5 text-6xl font-black leading-none text-[#2d7f33] sm:text-[6.5rem]">
              {score}
            </h2>
            <p className="mt-3 text-sm font-black leading-[1.25] sm:text-xl">
              Peunteun parantos nyumponan sarat kanggo naék level!
            </p>
            <div className="mt-4 flex justify-center">
              <Image
                src="/assets/extracted/trophy.png"
                alt="Piala"
                width={803}
                height={810}
                className="h-auto w-[96px] sm:w-[150px]"
              />
            </div>
            <button
              type="button"
              onClick={() => setPhase("final-choice")}
              className="pdf-button-green mt-5 rounded-[0.95rem] px-5 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Teraskeun Siklus Diajar
            </button>
          </div>
        </div>
      ) : phase === "final-choice" ? (
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center text-center">
          <div className="w-full rounded-[1.1rem] bg-[rgba(248,240,210,0.92)] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-7">
            <p className="text-[1.7rem] font-black leading-none text-[#2d5f1f] sm:text-4xl">
              PILIHAN AHIR
            </p>

            <div className="mt-4 flex justify-center">
              <Image
                src="/assets/extracted/character-boy-full.png"
                alt="Karakter pilihan ahir"
                width={565}
                height={1335}
                className="h-auto w-[86px] sm:w-[136px]"
              />
            </div>

            <div className="mt-4 grid gap-2.5">
              <button
                type="button"
                onClick={resetQuiz}
                className="pdf-button-blue rounded-[0.95rem] px-5 py-2.5 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
              Maén Deui
              </button>
              <button
                type="button"
                onClick={() => setPhase("complete")}
                className="pdf-button-green rounded-[0.95rem] px-5 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Réngsékeun Heula
              </button>
              <Link
                href={finalPrimaryHref}
                className="pdf-button-green rounded-[0.95rem] px-5 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                {finalPrimaryLabel}
              </Link>
              <Link
                href={finalSecondaryHref}
                className="pdf-button-yellow rounded-[0.95rem] px-5 py-2.5 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                {finalSecondaryLabel}
              </Link>
              <Link
                href="/progres"
                className="pdf-button-beige rounded-[0.95rem] px-5 py-2.5 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Tingali Kamajuan
              </Link>
              <Link
                href="/dashboard"
                className="rounded-[0.95rem] bg-white/78 px-5 py-2.5 text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
              >
                Balik ka Ménu
              </Link>
            </div>
          </div>
        </div>
      ) : phase === "complete" ? (
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center text-center">
          <div className="w-full rounded-[1.1rem] bg-[rgba(248,240,210,0.92)] px-4 py-5 text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:px-5 sm:py-7">
            <p className="text-[1.7rem] font-black text-[#2d5f1f] sm:text-4xl">WILUJENG!</p>
            <p className="mt-3 text-sm font-black leading-[1.35] sm:text-lg">
              Hidep parantos ngaréngsékeun ieu kaulinan.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Image
                src="/assets/extracted/character-boy-full.png"
                alt="Karakter lalaki"
                width={565}
                height={1335}
                className="h-auto w-[64px] sm:w-[94px]"
              />
              <Image
                src="/assets/extracted/character-girl-full.png"
                alt="Karakter awéwé"
                width={637}
                height={1547}
                className="h-auto w-[64px] sm:w-[94px]"
              />
            </div>
            <Link
              href="/dashboard"
              className="pdf-button-green mt-5 inline-flex rounded-[0.95rem] px-6 py-2.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl"
            >
              Réngsé
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-shell flex w-full flex-wrap items-start justify-between gap-2 rounded-[1.15rem] px-3 py-3 sm:px-5 sm:py-4.5">
            <div className="pdf-button-green max-w-full rounded-[0.95rem] px-3.5 py-2 text-base font-black leading-[1.05] text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:max-w-[70%] sm:rounded-[1.2rem] sm:px-5 sm:py-3 sm:text-3xl">
              {title}
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Image
                    key={index}
                    src={index < heartsLeft ? "/assets/extracted/heart-full.png" : "/assets/extracted/heart-empty.png"}
                    alt=""
                    aria-hidden="true"
                    width={421}
                    height={379}
                    className="h-6 w-auto sm:h-9"
                  />
                ))}
              </div>
              <div
                className={`rounded-[0.85rem] px-3 py-1.5 text-base font-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-4 sm:py-2.5 sm:text-2xl ${
                  phase === "feedback" ? "pdf-button-green text-white" : "pdf-panel-cream text-black"
                }`}
              >
                Skor: {score}
              </div>
            </div>
          </div>

          {phase === "question" ? (
            <>
              <div className="quiz-main-panel mt-3 w-full rounded-[1rem] px-4 py-3 text-center text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:rounded-[1.25rem] sm:px-6 sm:py-5">
                <p className="text-lg font-black leading-[1.14] tracking-[-0.01em] sm:text-3xl">
                  {currentQuestion.prompt}
                </p>
                <div className="font-aksara mt-2 text-[2.9rem] leading-none text-[#1f1a10] drop-shadow-[0_2px_0_rgba(255,255,255,0.28)] sm:mt-3 sm:text-[5.3rem] lg:text-[6rem]">
                  {currentQuestion.aksara}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    className="quiz-answer-secondary quiz-answer-primary-hover rounded-[0.9rem] border border-[rgba(164,136,74,0.34)] px-3 py-2.5 text-[1.3rem] font-black leading-none text-[#58411a] shadow-[0_16px_28px_rgba(35,28,15,0.18)] transition sm:rounded-[1.1rem] sm:py-3.5 sm:text-[2.35rem]"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <Link
                  href="/dashboard"
                  className="pdf-button-beige rounded-[0.85rem] px-3 py-1.5 text-sm font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-4 sm:py-2 sm:rounded-[0.95rem] sm:text-base"
                >
                  Ménu Utama
                </Link>
                <div className="pdf-button-green rounded-[0.85rem] px-3 py-1.5 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-4 sm:py-2.5 sm:text-2xl">
                  {currentIndex + 1}/{totalQuestions}
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto mt-3 flex w-full max-w-[560px] flex-1 flex-col items-center">
              <div className={`${isCorrect ? "feedback-panel-success" : "feedback-panel-error"} pdf-panel-cream w-full rounded-[0.95rem] px-4 pb-4 pt-4 text-center text-black shadow-[0_18px_34px_rgba(35,28,15,0.2)] sm:rounded-[1.2rem] sm:px-6 sm:pb-6 sm:pt-5`}>
                <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                  <Image
                    src={isCorrect ? "/assets/extracted/icon-check-circle.png" : "/assets/extracted/icon-close-circle.png"}
                    alt=""
                    width={512}
                    height={512}
                    className="feedback-badge h-12 w-12 sm:h-20 sm:w-20"
                  />
                  <div
                    className={`feedback-badge text-[2rem] font-black leading-none drop-shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:text-6xl ${
                      isCorrect ? "text-[#2f8b34]" : "text-[#d1000f]"
                    }`}
                  >
                    {isCorrect ? "LERES!" : "LEPAT!"}
                  </div>
                </div>

                <p className="mt-3 text-lg font-black leading-[1.15] sm:text-3xl">
                  {isCorrect ? "Waleran hidep leres!" : "Waleran anu leres nyaéta:"}
                </p>

                <div className="mt-2.5 text-[1.9rem] font-black leading-none sm:text-5xl">
                  {currentQuestion.answer}
                </div>

                <div className="mt-4 flex justify-center">
                  <div className={`relative ${isCorrect ? "feedback-celebrate" : ""}`}>
                    {isCorrect ? (
                      <>
                        <Image
                          src="/assets/extracted/character-correct.png"
                          alt="Karakter pamaén leres"
                          width={524}
                          height={1192}
                          className="feedback-figure h-auto w-[104px] drop-shadow-[0_14px_24px_rgba(39,30,14,0.18)] sm:w-[176px]"
                        />
                      </>
                    ) : (
                        <Image
                          src="/assets/extracted/character-wrong.png"
                          alt="Karakter pamaén nuju mikir"
                          width={718}
                          height={1208}
                          className="feedback-figure h-auto w-[112px] drop-shadow-[0_14px_24px_rgba(39,30,14,0.18)] sm:w-[190px]"
                        />
                    )}
                  </div>
                </div>

                <p className="mx-auto mt-2.5 max-w-[500px] text-sm font-black leading-[1.25] sm:text-xl">
                  {isCorrect
                    ? `${selectedAnswer} mangrupa jawaban anu leres.`
                    : `Anjeun milih ${selectedAnswer}. Jawaban anu leres nyaeta ${currentQuestion.answer}.`}
                </p>
              </div>

              <div className="-mt-3 flex items-center gap-3 sm:-mt-5">
                <Link
                  href="/dashboard"
                  className="pdf-button-beige rounded-[0.95rem] px-4 py-2 text-sm font-black text-black shadow-[0_18px_28px_rgba(35,28,15,0.2)] sm:rounded-[1.1rem] sm:px-5 sm:py-2.5 sm:text-base"
                >
                  Ménu Utama
                </Link>
                <button
                  type="button"
                  onClick={goNext}
                  className="pdf-button-green rounded-[0.95rem] px-5 py-2 text-[1.45rem] font-black text-white shadow-[0_18px_28px_rgba(35,28,15,0.2)] sm:rounded-[1.2rem] sm:px-7 sm:py-3 sm:text-[2.35rem]"
                >
                  Teras
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
