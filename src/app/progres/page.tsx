import Image from "next/image";
import Link from "next/link";
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
    { label: "Total Skor", value: String(profile?.total_score ?? 0) },
    { label: "Level Tertinggi", value: String(profile?.current_level ?? 1) },
    { label: "Jumlah Bermain", value: `${totalGames} Kali` },
    { label: "Rata-rata Skor", value: String(averageScore) },
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
      <section className="screen-stage-scroll relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center px-4 py-6 text-center sm:px-6 sm:py-8">
        <div className="w-full max-w-[620px]">
          <div className="mx-auto w-fit rounded-[0.95rem] bg-[#2f7f33] px-5 py-2 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl">
            PROGRES BELAJAR
          </div>

          <div className="pdf-panel-cream mt-5 rounded-[1.1rem] px-4 py-5 text-black shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-6 sm:py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full border-4 border-white bg-[#e8f0b7] p-1 shadow-[0_12px_20px_rgba(33,29,20,0.2)]">
                  <Image
                    src="/assets/characters/avatar-boy.png"
                    alt="Avatar pemain"
                    width={377}
                    height={377}
                    className="h-[52px] w-[52px] rounded-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#5e4a2c] sm:text-base">Pemain</p>
                  <p className="text-lg font-black sm:text-2xl">{profile?.display_name ?? "Pemain"}</p>
                </div>
              </div>
              <div className="rounded-[0.8rem] bg-[#dce7a0] px-3 py-1 text-sm font-black text-[#30461d] sm:text-base">
                Level {profile?.current_level ?? 1}
              </div>
            </div>

            <div className="mt-4 space-y-2">
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

            <div className="mt-4 rounded-[0.95rem] bg-[#efe4b9] px-4 py-3 text-left shadow-[0_8px_16px_rgba(35,28,15,0.1)]">
              <p className="text-sm font-black sm:text-base">Status Mode</p>
              <div className="mt-2.5 grid gap-1.5 text-xs font-black sm:text-sm">
                <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                  <span>Kuis</span>
                  <span>{completedModes.has("quiz") ? "Selesai" : "Belum"}</span>
                </div>
                <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                  <span>Menulis</span>
                  <span>{completedModes.has("tracing") ? "Selesai" : "Belum"}</span>
                </div>
                <div className="flex items-center justify-between rounded-[0.8rem] bg-white/82 px-3 py-2">
                  <span>Membaca</span>
                  <span>{completedModes.has("reading") ? "Selesai" : "Belum"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[0.95rem] bg-[#efe4b9] px-4 py-3 text-left shadow-[0_8px_16px_rgba(35,28,15,0.1)]">
              <p className="text-sm font-black sm:text-base">Riwayat Skor</p>
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
                    Belum ada riwayat skor yang tersimpan.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="pdf-button-beige rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali ke Menu
            </Link>
            <Link
              href="/level"
              className="pdf-button-green rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Pilih Level
            </Link>
          </div>

          <BottomNav active="/progres" className="mt-4" />
        </div>
      </section>
    </main>
  );
}
