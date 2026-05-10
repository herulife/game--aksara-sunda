import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const mainMenuItems = [
  {
    href: "/level",
    title: "Mulai Belajar",
    className: "pdf-button-green text-white",
    iconSrc: "/assets/icons/book-open.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 544,
    iconHeight: 544,
  },
  {
    href: "/tracing/level-1",
    title: "Menulis",
    className: "pdf-button-yellow text-black",
    iconSrc: "/assets/icons/pencil.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 391,
    iconHeight: 489,
  },
  {
    href: "/angka",
    title: "Belajar Angka",
    className: "pdf-button-yellow text-black",
    iconSrc: "/assets/icons/star-gold.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 259,
    iconHeight: 246,
  },
  {
    href: "/quiz/level-1",
    title: "Kuis Huruf",
    className: "pdf-button-green text-white",
    iconSrc: "/assets/icons/book-open.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 544,
    iconHeight: 544,
  },
  {
    href: "/quiz/angka",
    title: "Kuis Angka",
    className: "pdf-button-yellow text-black",
    iconSrc: "/assets/icons/star-gold.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 259,
    iconHeight: 246,
  },
  {
    href: "/membaca/level-1",
    title: "Membaca",
    className: "pdf-button-purple text-black",
    iconSrc: "/assets/icons/speaker-white.png",
    iconClassName: "h-6 w-6 sm:h-8 sm:w-8",
    iconWidth: 469,
    iconHeight: 396,
    iconWrapClassName: "rounded-full bg-[#8d5bb9] p-2",
  },
  {
    href: "/progres",
    title: "Progres",
    className: "pdf-button-blue text-black",
    iconSrc: "/assets/icons/progress-bars.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
    iconWidth: 448,
    iconHeight: 375,
  },
  {
    href: "/pengaturan",
    title: "Pengaturan",
    className: "pdf-button-beige text-black",
    iconSrc: "/assets/icons/star-gray.png",
    iconClassName: "h-7 w-7 sm:h-9 sm:w-9",
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
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Menu Utama
      </header>

      <section className="screen-stage-compact relative z-10 mx-auto flex w-full max-w-[430px] flex-col px-4 pt-1 sm:max-w-[480px] sm:px-5 sm:pt-2">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mt-[15px] flex w-full items-center justify-center">
              <div className="relative flex w-full max-w-[312px] items-center pl-9 sm:max-w-[350px] sm:pl-14">
                <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border-4 border-white bg-[#e8f0b7] p-1 shadow-[0_12px_20px_rgba(33,29,20,0.2)]">
                  <Image
                    src="/assets/characters/avatar-boy.png"
                    alt="Avatar pemain"
                    width={377}
                    height={377}
                    className="h-[40px] w-[40px] rounded-full object-cover sm:h-[58px] sm:w-[58px]"
                  />
                </div>
                <div className="mockup-card flex min-h-[50px] w-full items-center justify-center rounded-[0.95rem] px-3 py-2 pl-6 text-center text-[0.95rem] font-black text-black sm:min-h-[66px] sm:px-4 sm:py-3 sm:pl-9 sm:text-xl">
                  Halo, {profile?.display_name ?? "Pamaen"}!
                </div>
              </div>
            </div>

            <div className="mt-2.5 grid w-full grid-cols-2 gap-2 sm:mt-3 sm:gap-2.5">
              <div className="pdf-panel-cream rounded-[0.95rem] px-3 py-2.5 text-center text-black shadow-[0_12px_22px_rgba(35,28,15,0.16)] sm:py-3.5">
                <div className="text-base font-black leading-none sm:text-2xl">Level</div>
                <div className="mt-1 flex justify-center sm:mt-2">
                  <Image
                    src="/assets/icons/star-gold.png"
                    alt=""
                    width={259}
                    height={246}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </div>
                <div className="mt-1 text-lg font-black leading-none sm:text-3xl">
                  {profile?.current_level ?? 1}
                </div>
              </div>
              <div className="pdf-panel-cream rounded-[0.95rem] px-3 py-2.5 text-center text-black shadow-[0_12px_22px_rgba(35,28,15,0.16)] sm:py-3.5">
                <div className="text-base font-black leading-none sm:text-2xl">Skor</div>
                <div className="mt-1 flex justify-center sm:mt-2">
                  <Image
                    src="/assets/icons/star-gold.png"
                    alt=""
                    width={259}
                    height={246}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </div>
                <div className="mt-1 text-lg font-black leading-none sm:text-3xl">
                  {profile?.total_score ?? 0}
                </div>
              </div>
            </div>

            <h1 className="mockup-title mt-3 text-center text-[1.95rem] font-black leading-[0.92] sm:mt-4 sm:text-[2.85rem]">
              SUNDA GAME
            </h1>
            <p className="mt-0.5 text-center text-[0.76rem] font-black text-black sm:text-[0.98rem]">
              Sundanese Educational Game
            </p>
          </div>

          <div className="mt-4">
            <div className="grid w-full grid-cols-2 gap-3 sm:gap-3.5">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${item.className} flex min-h-[49px] items-center justify-center gap-1.5 rounded-[0.92rem] px-2.5 py-2 text-[0.74rem] font-black leading-none shadow-[0_5px_0_rgba(35,28,15,0.22),0_14px_20px_rgba(35,28,15,0.12)] sm:min-h-[57px] sm:gap-2 sm:px-3 sm:text-[0.96rem]`}
                >
                  <span className={item.iconWrapClassName ?? ""}>
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={item.iconWidth}
                      height={item.iconHeight}
                      className={item.iconClassName.replace("h-7 w-7 sm:h-9 sm:w-9", "h-4 w-4 sm:h-6 sm:w-6").replace("h-6 w-6 sm:h-8 sm:w-8", "h-4 w-4 sm:h-5.5 sm:w-5.5")}
                    />
                  </span>
                  <span className="truncate text-center">{item.title}</span>
                </Link>
              ))}
            </div>

            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="pdf-button-red flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-[0.92rem] px-3 py-2 text-[0.84rem] font-black leading-none shadow-[0_5px_0_rgba(110,48,55,0.26),0_14px_20px_rgba(35,28,15,0.12)] sm:min-h-[54px] sm:gap-2.5 sm:px-4 sm:text-[0.98rem]"
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
