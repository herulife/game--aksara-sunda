import type { Metadata } from "next";
import { Fredoka, Geist_Mono, Noto_Sans_Sundanese } from "next/font/google";
import { BackgroundMusicProvider } from "@/components/game/background-music-provider";
import { UiSoundProvider } from "@/components/game/ui-sound-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./globals.css";

const fredokaSans = Fredoka({
  variable: "--font-fredoka-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSundanese = Noto_Sans_Sundanese({
  variable: "--font-sundanese",
  weight: "400",
  subsets: ["sundanese"],
});

export const metadata: Metadata = {
  title: "Aksara Sunda",
  description: "Game edukasi untuk diajar aksara Sunda ku cara nu pikaresepeun.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("sound_enabled")
        .eq("id", user.id)
        .maybeSingle<{ sound_enabled: boolean }>()
    : { data: null };

  const soundEnabled = profile?.sound_enabled ?? true;

  return (
    <html
      lang="id"
      className={`${fredokaSans.variable} ${geistMono.variable} ${notoSansSundanese.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundMusicProvider>
          <UiSoundProvider initialSoundEnabled={soundEnabled} />
          {children}
        </BackgroundMusicProvider>
      </body>
    </html>
  );
}
