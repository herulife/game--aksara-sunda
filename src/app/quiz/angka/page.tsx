import { QuizLevelOne } from "@/components/game/quiz-level-one";
import { quizNumberLevelOneQuestions } from "@/lib/game-data";

export default function QuizAngkaPage() {
  return (
    <main className="mockup-screen">
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
