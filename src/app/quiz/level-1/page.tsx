import { QuizLevelOne } from "@/components/game/quiz-level-one";
import { quizLetterLevelOneQuestions } from "@/lib/game-data";

export default function QuizLevelOnePage() {
  return (
    <main className="mockup-screen">
      <QuizLevelOne
        questions={quizLetterLevelOneQuestions}
        title="Level 1 - Huruf Dasar"
        levelLabel="1 Huruf"
        finalPrimaryHref="/membaca/level-1"
        finalPrimaryLabel="Lanjut Membaca"
        finalSecondaryHref="/tracing/level-1"
        finalSecondaryLabel="Lanjut Menulis"
      />
    </main>
  );
}
