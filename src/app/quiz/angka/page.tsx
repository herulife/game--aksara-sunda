import { QuizLevelOne } from "@/components/game/quiz-level-one";
import { quizNumberLevelOneQuestions } from "@/lib/game-data";

export default function QuizAngkaPage() {
  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Tampilan Kuis Angka
      </header>

      <QuizLevelOne
        questions={quizNumberLevelOneQuestions}
        title="Level 1 - Angka Sunda"
        levelLabel="1 Angka"
        finalPrimaryHref="/angka"
        finalPrimaryLabel="Balik Belajar Angka"
        finalSecondaryHref="/progres"
        finalSecondaryLabel="Lihat Progres"
      />
    </main>
  );
}
