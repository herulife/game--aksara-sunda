import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/game/bottom-nav";
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
      const href = unlocked && level.level_number === 1 ? "/belajar/level-1" : "/level";

      return {
        id: level.id,
        title: `Level ${level.level_number}`,
        desc: level.title,
        meta: `${Math.min(10, progress?.best_score ?? 0)}/10`,
        href,
        unlocked,
      };
    }) ?? [];

  return (
    <main className="mockup-screen">
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Pilih Level
      </header>

      <section className="screen-stage-compact relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center px-4 text-center sm:px-5">
        <h1 className="responsive-title mockup-title">PILIH LEVEL</h1>

        <div className="mt-2.5 grid w-full gap-2">
          {levelCards.map((card) =>
            card.unlocked ? (
              <Link
                key={card.id}
                href={card.href}
                className="pdf-button-green block rounded-[0.9rem] px-4 py-2 text-black shadow-[0_12px_20px_rgba(35,28,15,0.16)]"
              >
                <div className="flex items-center gap-3 text-left">
                  <Image
                    src="/assets/icons/star-gold.png"
                    alt=""
                    width={259}
                    height={246}
                    className="h-8 w-8 flex-none"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-black leading-tight sm:text-lg">{card.title}</div>
                    <div className="mt-0.5 text-base font-black leading-tight sm:text-lg">{card.desc}</div>
                  </div>
                  <div className="flex-none self-end text-sm font-black sm:text-base">{card.meta}</div>
                </div>
              </Link>
            ) : (
              <div
                key={card.id}
                className="pdf-panel-cream block rounded-[0.9rem] px-4 py-2 text-black shadow-[0_12px_20px_rgba(35,28,15,0.16)]"
              >
                <div className="flex items-center gap-3 text-left">
                  <Image
                    src="/assets/icons/star-gray.png"
                    alt=""
                    width={259}
                    height={246}
                    className="h-8 w-8 flex-none"
                  />
                  <div className="min-w-0">
                    <div className="text-base font-black leading-tight sm:text-lg">{card.title}</div>
                    <div className="mt-0.5 text-base font-black leading-tight sm:text-lg">{card.desc}</div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="pdf-button-green mt-3 w-full rounded-[0.9rem] px-4 py-2 text-xs font-black leading-[1.25] text-white shadow-[0_12px_20px_rgba(35,28,15,0.16)] sm:text-[0.9rem]">
          Réngsékeun heula level saméméhna sangkan level satuluyna kabuka.
        </div>

        <Link
          href="/angka"
          className="pdf-button-yellow mt-2 w-full rounded-[0.9rem] px-4 py-2 text-xs font-black leading-[1.25] text-black shadow-[0_12px_20px_rgba(35,28,15,0.16)] sm:text-[0.9rem]"
        >
          Buka ménu diajar angka Sunda
        </Link>

        <BottomNav active="/level" className="mt-3" />
      </section>
    </main>
  );
}
