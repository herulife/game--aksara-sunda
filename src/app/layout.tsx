import type { Metadata } from "next";
import { Baloo_2, Geist_Mono, Noto_Sans_Sundanese } from "next/font/google";
import { BackgroundMusicProvider } from "@/components/game/background-music-provider";
import { UiSoundProvider } from "@/components/game/ui-sound-provider";
import "./globals.css";

const balooSans = Baloo_2({
  variable: "--font-baloo-sans",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${balooSans.variable} ${geistMono.variable} ${notoSansSundanese.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundMusicProvider>
          <UiSoundProvider />
          {children}
        </BackgroundMusicProvider>
      </body>
    </html>
  );
}
