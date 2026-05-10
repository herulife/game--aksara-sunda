import Image from "next/image";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/game/bottom-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  display_name: string;
  current_level: number;
  highest_score: number;
  total_score: number;
};

type QuizSessionRow = {
  score: number;
  created_at?: string;
  finished_at?: string | null;
};

type ProgressRow = {
  mode: string;
  is_completed: boolean;
};

export default async function ProgresPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: quizSessions }, { data: progressRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, current_level, highest_score, total_score")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>(),
    supabase
      .from("quiz_sessions")
      .select("score, created_at, finished_at")
      .eq("player_id", user.id)
      .eq("status", "completed")
      .order("finished_at", { ascending: false })
      .limit(3)
      .returns<QuizSessionRow[]>(),
    supabase
      .from("player_progress")
      .select("mode, is_completed")
      .eq("player_id", user.id)
      .returns<ProgressRow[]>(),
  ]);

  const totalGames = (quizSessions?.length ?? 0) || 1;
  const averageScore =
    quizSessions && quizSessions.length > 0
      ? Math.round(quizSessions.reduce((sum, row) => sum + (row.score ?? 0), 0) / quizSessions.length)
      : 0;

  const summaryRows = [
    { label: "Jumlah Peunteun", value: String(profile?.total_score ?? 0) },
    { label: "Level Pangluhurna", value: String(profile?.current_level ?? 1) },
    { label: "Sabaraha Kali Maén", value: `${totalGames} Kali` },
    { label: "Peunteun Rata-rata", value: String(averageScore) },
  ];

  const historyRows =
    quizSessions?.map((row, index) => ({
      index: index + 1,
      date: new Date(row.finished_at ?? row.created_at ?? "2026-01-01T00:00:00.000Z").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      level: "Level 1",
      score: String(row.score ?? 0),
    })) ?? [];

  const completedModes = new Set(
    (progressRows ?? []).filter((row) => row.is_completed).map((row) => row.mode),
  );

  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Kamajuan Diajar
      </header>

      <section className="screen-stage-compact relative z-10 mx-auto flex w-full max-w-[500px] flex-col items-center px-4 text-center sm:px-5">
        <div className="pdf-panel-cream w-full rounded-[0.95rem] px-4 py-3 text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full border-4 border-white bg-[#e8f0b7] p-1 shadow-[0_12px_20px_rgba(33,29,20,0.2)]">
                <Image
                  src="/assets/characters/avatar-boy.png"
                  alt="Avatar pemain"
                  width={377}
                  height={377}
                className="h-[46px] w-[46px] rounded-full object-cover"
              />
            </div>
              <p className="text-lg font-black sm:text-xl">{profile?.display_name ?? "Pamaén"}</p>
            </div>
            <div className="rounded-[0.8rem] bg-[#dce7a0] px-3 py-1 text-sm font-black text-[#30461d] sm:text-base">
              Level {profile?.current_level ?? 1}
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-4 py-2 text-left shadow-[0_8px_16px_rgba(35,28,15,0.1)]"
              >
                <span className="text-xs font-black sm:text-sm">{row.label}</span>
                <span className="text-sm font-black text-[#2d5f1f] sm:text-base">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[0.9rem] bg-[#efe4b9] px-4 py-3 text-left shadow-[0_8px_16px_rgba(35,28,15,0.1)]">
            <p className="text-sm font-black sm:text-base">Kaayaan Mode</p>
            <div className="mt-2.5 grid gap-1.5 text-xs font-black sm:text-sm">
              <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                <span>Kuis</span>
                <span>{completedModes.has("quiz") ? "Réngsé" : "Acan"}</span>
              </div>
              <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                <span>Nulis</span>
                <span>{completedModes.has("tracing") ? "Réngsé" : "Acan"}</span>
              </div>
              <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                <span>Maca</span>
                <span>{completedModes.has("reading") ? "Réngsé" : "Acan"}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[0.9rem] bg-[#efe4b9] px-4 py-3 text-left shadow-[0_8px_16px_rgba(35,28,15,0.1)]">
            <p className="text-sm font-black sm:text-base">Runtuyan Peunteun</p>
            <div className="mt-2.5 space-y-1.5">
              {historyRows.length > 0 ? (
                historyRows.map((row) => (
                  <div
                    key={`${row.date}-${row.index}`}
                    className="grid grid-cols-[22px_1fr_auto_auto] items-center gap-2 rounded-[0.8rem] bg-white/82 px-3 py-1.5 text-xs font-black shadow-[0_6px_12px_rgba(35,28,15,0.08)] sm:text-sm"
                  >
                    <span>{row.index}.</span>
                    <span>{row.date}</span>
                    <span>{row.level}</span>
                    <span>{row.score}</span>
                  </div>
                ))
              ) : (
                  <div className="rounded-[0.8rem] bg-white/82 px-3 py-2.5 text-xs font-black shadow-[0_6px_12px_rgba(35,28,15,0.08)] sm:text-sm">
                    Tacan aya runtuyan peunteun nu kasimpen.
                  </div>
                )}
            </div>
          </div>
        </div>

        <BottomNav active="/progres" className="mt-3" />
      </section>
    </main>
  );
}
