import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const mainMenuItems = [
  {
    href: "/level",
    title: "Mulai Belajar",
    className: "bg-[#3f8e41] text-white",
    iconSrc: "/assets/extracted/icon-book.png",
    iconClassName: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    iconWidth: 512,
    iconHeight: 512,
  },
  {
    href: "/tracing/level-1",
    title: "Latihan Menulis",
    className: "bg-[#f0c431] text-black",
    iconSrc: "/assets/extracted/icon-pencil.png",
    iconClassName: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    iconWidth: 512,
    iconHeight: 512,
  },
  {
    href: "/membaca/level-1",
    title: "Membaca",
    className: "bg-[#c96de6] text-black",
    iconSrc: "/assets/extracted/icon-speaker.png",
    iconClassName: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    iconWidth: 512,
    iconHeight: 512,
  },
  {
    href: "/progres",
    title: "Lihat Progres",
    className: "bg-[#79bdf1] text-black",
    iconSrc: "/assets/extracted/icon-bars.png",
    iconClassName: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    iconWidth: 512,
    iconHeight: 512,
  },
  {
    href: "/pengaturan",
    title: "Pengaturan",
    className: "bg-[#f2e6b8] text-black",
    iconSrc: "/assets/extracted/icon-gear.png",
    iconClassName: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    iconWidth: 512,
    iconHeight: 512,
  },
];

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, highest_score, total_score, current_level")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[980px] flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="relative flex min-h-[100svh] flex-col">
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3">
            <div className="relative flex w-full max-w-[292px] items-center pl-9 sm:max-w-[368px] sm:pl-13">
              <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border-4 border-white bg-[#e8f0b7] p-1 shadow-[0_12px_20px_rgba(33,29,20,0.2)]">
                <Image
                  src="/assets/characters/avatar-boy.png"
                  alt="Avatar pemain"
                  width={377}
                  height={377}
                  className="h-[44px] w-[44px] rounded-full object-cover sm:h-[57px] sm:w-[57px]"
                />
              </div>
              <div className="mockup-avatar-card mockup-button-label flex min-h-[54px] w-full items-center justify-center rounded-[1rem] px-3 py-2 pl-7 text-center text-[0.96rem] text-black sm:min-h-[66px] sm:px-4 sm:py-3 sm:pl-9 sm:text-[1.06rem]">
                Halo, {profile?.display_name ?? "Pemain"}!
              </div>
            </div>

            <div className="flex gap-2">
              <div className="mockup-stat-card flex min-h-[54px] w-[90px] items-center justify-center gap-2 rounded-[1rem] px-3 py-2 text-center text-black sm:min-h-[66px] sm:w-[98px]">
                <Image
                  src="/assets/icons/star-gold.png"
                  alt=""
                  width={259}
                  height={246}
                  className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
                />
                <div className="text-left text-[0.72rem] font-black leading-none sm:text-[0.8rem]">
                  Level
                  <div className="mt-1 text-[1.12rem] font-black leading-none sm:text-[1.38rem]">
                    {profile?.current_level ?? 1}
                  </div>
                </div>
              </div>
              <div className="mockup-stat-card flex min-h-[54px] w-[90px] items-center justify-center gap-2 rounded-[1rem] px-3 py-2 text-center text-black sm:min-h-[66px] sm:w-[98px]">
                <Image
                  src="/assets/icons/star-gold.png"
                  alt=""
                  width={259}
                  height={246}
                  className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
                />
                <div className="text-left text-[0.72rem] font-black leading-none sm:text-[0.8rem]">
                  Skor
                  <div className="mt-1 text-[1.12rem] font-black leading-none sm:text-[1.38rem]">
                    {profile?.total_score ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center pt-12 text-center sm:pt-8">
            <h1 className="mockup-hero-title text-[3.32rem] sm:text-[5.08rem]">
              SUNDA GAME
            </h1>
            <p className="mockup-copy mt-3 text-[0.86rem] text-[#fff8ec] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-[0.98rem]">
              Sundanese Educational Game
            </p>

            <div className="mt-8 flex w-full max-w-[332px] flex-col gap-3 sm:max-w-[362px]">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${item.className} mockup-button-label flex min-h-[56px] items-center justify-start gap-3 rounded-[999px] border border-[rgba(35,28,15,0.14)] px-5 py-3 text-[1rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_0_rgba(35,28,15,0.16),0_12px_18px_rgba(35,28,15,0.14)] sm:min-h-[60px] sm:text-[1.02rem]`}
                >
                  {item.iconSrc ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center sm:h-7 sm:w-7">
                      <Image
                        src={item.iconSrc}
                        alt=""
                        width={item.iconWidth ?? 0}
                        height={item.iconHeight ?? 0}
                        className={item.iconClassName ?? ""}
                      />
                    </span>
                  ) : null}
                  <span className="text-left">{item.title}</span>
                </Link>
              ))}
            </div>

            <form action={signOutAction} className="mt-3 w-full max-w-[332px] sm:max-w-[362px]">
              <button
                type="submit"
                className="mockup-button-label flex min-h-[56px] w-full items-center justify-start gap-3 rounded-[999px] border border-[rgba(35,28,15,0.14)] bg-[#e6959d] px-5 py-3 text-[1rem] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_0_rgba(139,86,95,0.28),0_12px_18px_rgba(35,28,15,0.14)] sm:min-h-[60px] sm:text-[1.02rem]"
              >
                <Image
                  src="/assets/icons/cross-red.png"
                  alt=""
                  width={425}
                  height={425}
                  className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
