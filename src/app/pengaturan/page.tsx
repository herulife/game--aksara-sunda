import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/game/bottom-nav";
import { SettingsPanel } from "@/components/game/settings-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileSettings = {
  sound_enabled: boolean;
  music_enabled: boolean;
};

export default async function PengaturanPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("sound_enabled, music_enabled")
    .eq("id", user.id)
    .maybeSingle<ProfileSettings>();

  return (
    <main className="mockup-screen">
      <section className="screen-stage-scroll relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center px-4 py-6 text-center sm:px-6 sm:py-8">
        <div className="w-full max-w-[620px]">
          <div className="mx-auto w-fit rounded-[0.95rem] bg-[#2f7f33] px-5 py-2 text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-xl">
            PENGATURAN
          </div>

          <SettingsPanel
            soundEnabled={profile?.sound_enabled ?? true}
            musicEnabled={profile?.music_enabled ?? true}
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="pdf-button-beige rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Menu Utama
            </Link>
            <Link
              href="/progres"
              className="pdf-button-green rounded-[0.95rem] px-4 py-3 text-center text-base font-black text-white shadow-[0_14px_24px_rgba(35,28,15,0.18)] sm:text-lg"
            >
              Lihat Progres
            </Link>
          </div>

          <BottomNav active="/pengaturan" className="mt-4" />
        </div>
      </section>
    </main>
  );
}
