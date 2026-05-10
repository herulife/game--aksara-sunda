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

      <section className="screen-stage-scroll relative z-10 mx-auto flex w-full max-w-[500px] flex-col items-center px-4 text-center sm:px-5">
        <h1 className="responsive-title mockup-title">PENGATURAN</h1>
        <p className="responsive-subtitle mockup-white-title mt-1">
          Atur musik dan suara agar pengalaman bermain terasa lebih nyaman.
        </p>

        <SettingsPanel
          soundEnabled={profile?.sound_enabled ?? true}
          musicEnabled={profile?.music_enabled ?? true}
        />

        <BottomNav active="/pengaturan" className="mt-3" />
      </section>
    </main>
  );
}
