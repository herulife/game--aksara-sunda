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
      <header className="mockup-header px-4 py-3 text-lg sm:py-4 sm:text-2xl">
        Pengaturan
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-66px)] w-full max-w-[500px] flex-col items-center px-4 pb-6 pt-5 text-center sm:px-5 sm:pb-7 sm:pt-6">
        <h1 className="responsive-title mockup-title">PENGATURAN</h1>
        <p className="responsive-subtitle mockup-white-title mt-2">
          Atur sora jeung pangalaman maen supaya leuwih merenah.
        </p>

        <SettingsPanel
          soundEnabled={profile?.sound_enabled ?? true}
          musicEnabled={profile?.music_enabled ?? true}
        />

        <BottomNav active="/pengaturan" className="mt-5" />
      </section>
    </main>
  );
}
