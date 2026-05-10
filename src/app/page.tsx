import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SplashHome } from "@/components/game/splash-home";

type ProfileSettings = {
  music_enabled: boolean;
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const startHref = user ? "/dashboard" : "/register";

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("music_enabled")
        .eq("id", user.id)
        .maybeSingle<ProfileSettings>()
    : { data: null };

  return (
    <SplashHome
      startHref={startHref}
      showRegisterLink={!user}
      initialMusicEnabled={profile?.music_enabled ?? true}
    />
  );
}
