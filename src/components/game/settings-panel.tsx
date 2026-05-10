"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { updateSettingsAction } from "@/app/game-actions";

const SOUND_PREF_KEY = "aksara-sunda-sound-enabled";

type SettingsPanelProps = {
  soundEnabled: boolean;
  musicEnabled: boolean;
};

function SettingToggleCard({
  title,
  value,
  icon,
  width,
  height,
  onToggle,
  disabled,
}: {
  title: string;
  value: boolean;
  icon: string;
  width: number;
  height: number;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="pdf-panel-cream rounded-[0.95rem] px-4 py-4 text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)] transition hover:-translate-y-0.5 disabled:opacity-70"
    >
      <div className="flex justify-center">
        <span className="rounded-full bg-[#3f8e41] p-2.5">
          <Image src={icon} alt="" width={width} height={height} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
      </div>
      <p className="mt-2.5 text-base font-black sm:text-lg">{title}</p>
      <p className={`mt-1.5 text-xl font-black sm:text-2xl ${value ? "text-[#2f8b34]" : "text-[#bb4c35]"}`}>
        {value ? "Aktif" : "Mati"}
      </p>
      <p className="mt-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#5e4d31] sm:text-xs">
        Tekan untuk mengubah
      </p>
    </button>
  );
}

export function SettingsPanel({ soundEnabled, musicEnabled }: SettingsPanelProps) {
  const [sound, setSound] = useState(soundEnabled);
  const [music, setMusic] = useState(musicEnabled);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    window.localStorage.setItem(SOUND_PREF_KEY, String(soundEnabled));
  }, [soundEnabled]);

  function persist(nextSound: boolean, nextMusic: boolean) {
    setSound(nextSound);
    setMusic(nextMusic);
    window.localStorage.setItem(SOUND_PREF_KEY, String(nextSound));
    setMessage("Menyimpan...");

    startTransition(async () => {
      const result = await updateSettingsAction({
        soundEnabled: nextSound,
        musicEnabled: nextMusic,
      });

      if (!result.ok) {
        setSound(sound);
        setMusic(music);
        setMessage(result.error ?? "Belum berhasil menyimpan.");
        return;
      }

      setMessage("Perubahan berhasil disimpan.");
    });
  }

  return (
    <>
      <div className="mt-5 grid w-full max-w-[620px] gap-3 sm:grid-cols-3">
        <SettingToggleCard
          title="Musik"
          value={music}
          icon="/assets/icons/speaker-white.png"
          width={469}
          height={396}
          onToggle={() => persist(sound, !music)}
          disabled={isPending}
        />
        <SettingToggleCard
          title="Suara"
          value={sound}
          icon="/assets/icons/speaker-white.png"
          width={469}
          height={396}
          onToggle={() => persist(!sound, music)}
          disabled={isPending}
        />
        <div className="pdf-panel-cream rounded-[0.95rem] px-4 py-4 text-black shadow-[0_14px_24px_rgba(35,28,15,0.18)]">
          <div className="flex justify-center">
            <span className="rounded-full bg-[#3f8e41] p-2.5">
              <Image src="/assets/icons/star-gold.png" alt="" width={259} height={246} className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </div>
          <p className="mt-2.5 text-base font-black sm:text-lg">Mode Belajar</p>
          <p className="mt-1.5 text-xl font-black sm:text-2xl">Aktif</p>
          <p className="mt-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#5e4d31] sm:text-xs">
            Siap digunakan
          </p>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[620px] rounded-[0.95rem] bg-white/80 px-4 py-3 text-sm font-black text-[#2d5f1f] shadow-[0_12px_20px_rgba(35,28,15,0.1)] sm:text-base">
        {message ?? "Atur musik dan suara agar permainan terasa nyaman."}
      </div>
    </>
  );
}
