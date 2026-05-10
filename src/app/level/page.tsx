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

const LEVEL_CLONE_SLOTS = [
  { number: 1, title: "Huruf Dasar" },
  { number: 2, title: "Gabungan Huruf" },
  { number: 3, title: "Kata Sederhana" },
  { number: 4, title: "Kalimat Pendek" },
] as const;

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

  const levelByNumber = new Map((levels ?? []).map((level) => [level.level_number, level]));

  const levelCards = LEVEL_CLONE_SLOTS.map((slot) => {
    const level = levelByNumber.get(slot.number);
    const progress = level ? progressMap.get(level.id) : undefined;
    const unlocked = progress?.is_unlocked ?? slot.number === 1;

    return {
      id: level?.id ?? `mock-level-${slot.number}`,
      number: slot.number,
      title: level?.title || slot.title,
      unlocked,
      href: unlocked && slot.number === 1 ? "/belajar/level-1" : "/level",
      isAvailable: Boolean(level),
    };
  });

  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[760px] flex-col items-center justify-start px-4 py-4 sm:px-6 sm:py-5">
        <div className="w-full max-w-[430px]">
          <div className="pdf-panel-cream rounded-[1.6rem] border-2 border-[rgba(35,28,15,0.45)] px-8 py-8 shadow-[0_18px_30px_rgba(35,28,15,0.2)]">
            <h1 className="mockup-title text-center text-[2rem] sm:text-[2.12rem]">
              PILIH LEVEL
            </h1>

            <div className="mt-8 grid grid-cols-2 gap-4">
            {levelCards.map((card) =>
              card.unlocked ? (
                <Link
                  key={card.id}
                  href={card.href}
                  className="flex min-h-[150px] flex-col items-center rounded-[1rem] border-2 border-[#2f8b34] bg-[#fffaf0] px-3 py-4 text-center text-black shadow-[0_6px_14px_rgba(35,28,15,0.08)] transition hover:-translate-y-1"
                >
                  <p className="mockup-button-label text-[0.96rem] text-[#2e2415] sm:text-[1rem]">Level {card.number}</p>
                  <p className="mockup-copy mt-2 min-h-[32px] text-[0.72rem] text-[#7a6842] sm:text-[0.76rem]">
                    {card.title}
                  </p>
                  <Image
                    src="/assets/icons/star-gold.png"
                    alt=""
                    width={259}
                    height={246}
                    className="mt-4 h-11 w-11 flex-none"
                  />
                  <span className="mt-3 text-[0.8rem] font-bold text-black">
                    0/30
                  </span>
                </Link>
              ) : (
                <div
                  key={card.id}
                  className="flex min-h-[150px] flex-col items-center rounded-[1rem] border-2 border-[rgba(200,186,145,0.45)] bg-[#f5e8c4]/45 px-3 py-4 text-center text-black shadow-[0_6px_14px_rgba(35,28,15,0.05)]"
                >
                  <p className="mockup-button-label text-[0.96rem] text-[#5d5d4f] sm:text-[1rem]">Level {card.number}</p>
                  <p className="mockup-copy mt-2 min-h-[32px] text-[0.72rem] text-[#94886a] sm:text-[0.76rem]">
                    {card.title}
                  </p>
                  <Image
                    src="/assets/icons/lock-icon.png"
                    alt=""
                    width={512}
                    height={512}
                    className="mt-4 h-11 w-11 flex-none opacity-60"
                  />
                  <span className="mt-3 text-[0.8rem] font-medium text-[#6b654f]">
                    Terkunci
                  </span>
                </div>
              ),
            )}
            </div>

            <div className="mockup-copy mt-7 text-center text-[0.82rem] text-[#5b4a2d] sm:text-[0.92rem]">
              Selesaikan level sebelumnya terlebih dahulu agar level berikutnya terbuka.
            </div>
          </div>

          <div className="mt-5 flex">
            <Link
              href="/dashboard"
              className="pdf-panel-cream mockup-button-label inline-flex min-h-[48px] min-w-[104px] items-center justify-center rounded-[0.95rem] border-2 border-[#2f8b34] px-4 py-3 text-[0.98rem] text-black shadow-[0_10px_20px_rgba(35,28,15,0.14)]"
            >
              &lt; Kembali
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
