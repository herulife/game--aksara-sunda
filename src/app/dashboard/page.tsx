import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const mainMenuItems = [
  {
    href: "/level",
    title: "Belajar Aksara Sunda",
    className: "pdf-button-green text-white",
    iconSrc: "/assets/icons/book-open.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 544,
    iconHeight: 544,
  },
  {
    href: "/tracing/level-1",
    title: "Latihan Menulis",
    className: "pdf-button-yellow text-black",
    iconSrc: "/assets/icons/pencil.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 391,
    iconHeight: 489,
  },
  {
    href: "/membaca/level-1",
    title: "Latihan Membaca",
    className: "pdf-button-purple text-black",
    iconSrc: "/assets/icons/speaker-white.png",
    iconClassName: "h-5 w-5 sm:h-6 sm:w-6",
    iconWidth: 469,
    iconHeight: 396,
    iconWrapClassName: "rounded-full bg-[#8d5bb9] p-2",
  },
  {
    href: "/quiz/level-1",
    title: "Kuis Huruf",
    className: "pdf-button-yellow text-black",
    iconSrc: "/assets/icons/star-gold.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 259,
    iconHeight: 246,
  },
  {
    href: "/angka",
    title: "Belajar Angka",
    className: "pdf-button-green text-white",
    iconSrc: "/assets/icons/book-open.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 544,
    iconHeight: 544,
  },
  {
    href: "/quiz/angka",
    title: "Kuis Angka",
    className: "pdf-button-blue text-black",
    iconSrc: "/assets/icons/progress-bars.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 448,
    iconHeight: 375,
  },
  {
    href: "/progres",
    title: "Lihat Progres",
    className: "pdf-button-beige text-black",
    iconSrc: "/assets/icons/star-gray.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 259,
    iconHeight: 246,
  },
  {
    href: "/pengaturan",
    title: "Pengaturan",
    className: "pdf-button-beige text-black",
    iconSrc: "/assets/icons/star-gray.png",
    iconClassName: "h-6 w-6 sm:h-7 sm:w-7",
    iconWidth: 259,
    iconHeight: 246,
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
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[470px] flex-col px-4 py-6 sm:max-w-[560px] sm:px-6 sm:py-8">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="relative flex w-full max-w-[290px] items-center pl-10 sm:max-w-[340px] sm:pl-14">
              <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border-4 border-white bg-[#e8f0b7] p-1 shadow-[0_12px_20px_rgba(33,29,20,0.2)]">
                <Image
                  src="/assets/characters/avatar-boy.png"
                  alt="Avatar pemain"
                  width={377}
                  height={377}
                  className="h-[46px] w-[46px] rounded-full object-cover sm:h-[58px] sm:w-[58px]"
                />
              </div>
              <div className="mockup-card flex min-h-[56px] w-full items-center justify-center rounded-[1rem] px-3 py-2 pl-7 text-center text-[1rem] font-black text-black sm:min-h-[66px] sm:px-4 sm:py-3 sm:pl-9 sm:text-[1.1rem]">
                Halo, {profile?.display_name ?? "Pemain"}!
              </div>
            </div>

            <div className="grid w-[118px] gap-2 sm:w-[132px]">
              <div className="pdf-panel-cream rounded-[0.95rem] px-3 py-2 text-center text-black shadow-[0_12px_22px_rgba(35,28,15,0.16)]">
                <div className="text-xs font-black leading-none sm:text-sm">Level</div>
                <div className="mt-1 text-xl font-black leading-none sm:text-2xl">
                  {profile?.current_level ?? 1}
                </div>
              </div>
              <div className="pdf-panel-cream rounded-[0.95rem] px-3 py-2 text-center text-black shadow-[0_12px_22px_rgba(35,28,15,0.16)]">
                <div className="text-xs font-black leading-none sm:text-sm">Skor</div>
                <div className="mt-1 text-xl font-black leading-none sm:text-2xl">
                  {profile?.total_score ?? 0}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-1 flex-col items-center text-center">
            <h1 className="text-[2.8rem] font-black leading-[0.84] tracking-[0.02em] text-[#f5e7ae] drop-shadow-[0_4px_12px_rgba(46,38,18,0.26)] sm:text-[4.25rem]">
              SUNDA GAME
            </h1>
            <p className="mt-2 text-[0.86rem] font-bold text-[#fff8ec] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-[0.98rem]">
              Permainan Edukasi Bahasa Sunda
            </p>

            <div className="mt-7 flex w-full max-w-[370px] flex-col gap-4 sm:max-w-[440px]">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${item.className} flex min-h-[60px] items-center justify-center gap-3 rounded-[1rem] px-4 py-3 text-[1rem] font-black leading-none shadow-[0_5px_0_rgba(35,28,15,0.22),0_14px_20px_rgba(35,28,15,0.12)] sm:min-h-[66px] sm:text-[1.08rem]`}
                >
                  <span className={item.iconWrapClassName ?? ""}>
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={item.iconWidth}
                      height={item.iconHeight}
                      className={item.iconClassName}
                    />
                  </span>
                  <span className="text-center">{item.title}</span>
                </Link>
              ))}
            </div>

            <form action={signOutAction} className="mt-5 w-full max-w-[370px] sm:max-w-[440px]">
              <button
                type="submit"
                className="pdf-button-red flex min-h-[56px] w-full items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-[1rem] font-black leading-none shadow-[0_5px_0_rgba(110,48,55,0.26),0_14px_20px_rgba(35,28,15,0.12)] sm:min-h-[62px] sm:text-[1.05rem]"
              >
                <Image
                  src="/assets/icons/cross-red.png"
                  alt=""
                  width={425}
                  height={425}
                  className="h-5 w-5 sm:h-6 sm:w-6"
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
