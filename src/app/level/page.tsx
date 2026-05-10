import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LevelRow = {
  id: string;
  mode: string;
  level_number: number;
  title: string;
};

type ProgressRow = {
  level_id: string;
  is_unlocked: boolean;
  best_score: number;
};

export default async function LevelPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: levels }, { data: progressRows }] = await Promise.all([
    supabase
      .from("levels")
      .select("id, mode, level_number, title")
      .eq("mode", "quiz")
      .eq("is_active", true)
      .order("level_number", { ascending: true })
      .returns<LevelRow[]>(),
    supabase
      .from("player_progress")
      .select("level_id, is_unlocked, best_score")
      .eq("player_id", user.id)
      .eq("mode", "quiz")
      .returns<ProgressRow[]>(),
  ]);

  const progressMap = new Map((progressRows ?? []).map((row) => [row.level_id, row]));

  const levelCards =
    levels?.map((level) => {
      const progress = progressMap.get(level.id);
      const unlocked = progress?.is_unlocked ?? level.level_number === 1;

      return {
        id: level.id,
        number: level.level_number,
        title: level.title,
        unlocked,
        href: unlocked && level.level_number === 1 ? "/belajar/level-1" : "/level",
      };
    }) ?? [];

  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[760px] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[620px]">
          <div className="mx-auto w-fit rounded-[0.95rem] bg-[#2f7f33] px-5 py-2 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl">
            PILIH LEVEL
          </div>

          <div className="mt-5 grid gap-3">
            {levelCards.map((card) =>
              card.unlocked ? (
                <Link
                  key={card.id}
                  href={card.href}
                  className="pdf-panel-cream block rounded-[1rem] px-4 py-4 text-black shadow-[0_16px_28px_rgba(35,28,15,0.18)] transition hover:-translate-y-1 sm:px-5 sm:py-4.5"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/star-gold.png"
                      alt=""
                      width={259}
                      height={246}
                      className="h-9 w-9 flex-none sm:h-11 sm:w-11"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black leading-tight sm:text-2xl">Level {card.number}</p>
                      <p className="mt-0.5 text-sm font-bold text-[#5e4a2c] sm:text-base">{card.title}</p>
                    </div>
                    <span className="rounded-full bg-[#2f8b34] px-3 py-1 text-xs font-black text-white shadow-[0_8px_16px_rgba(44,101,36,0.18)] sm:text-sm">
                      Buka
                    </span>
                  </div>
                </Link>
              ) : (
                <div
                  key={card.id}
                  className="pdf-panel-cream rounded-[1rem] px-4 py-4 text-black opacity-75 shadow-[0_16px_28px_rgba(35,28,15,0.15)] sm:px-5 sm:py-4.5"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/star-gray.png"
                      alt=""
                      width={259}
                      height={246}
                      className="h-9 w-9 flex-none sm:h-11 sm:w-11"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black leading-tight sm:text-2xl">Level {card.number}</p>
                      <p className="mt-0.5 text-sm font-bold text-[#5e4a2c] sm:text-base">{card.title}</p>
                    </div>
                    <span className="rounded-full bg-[#c8bc95] px-3 py-1 text-xs font-black text-[#6b5b34] sm:text-sm">
                      Terkunci
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="mt-4 rounded-[1rem] bg-[rgba(248,240,210,0.9)] px-4 py-3 text-center text-sm font-bold text-[#5b4a2d] shadow-[0_16px_28px_rgba(35,28,15,0.15)] sm:text-base">
            Selesaikan level sebelumnya terlebih dahulu agar level berikutnya terbuka.
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/dashboard"
              className="pdf-button-beige flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Kembali ke Menu
            </Link>
            <Link
              href="/angka"
              className="pdf-button-yellow flex-1 rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Belajar Angka
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
