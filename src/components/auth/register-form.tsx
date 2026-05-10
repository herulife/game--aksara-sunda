"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};
const LAST_PLAYER_NAME_KEY = "aksara-sunda-last-player-name";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signUpAction, initialState);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (!state.success || !playerName) return;

    window.localStorage.setItem(LAST_PLAYER_NAME_KEY, playerName.trim());
    const timeout = window.setTimeout(() => {
      router.push("/login");
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [playerName, router, state.success]);

  return (
    <form action={formAction} className="space-y-3 sm:space-y-4">
      <label className="block">
        <input
          name="displayName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Ketik nami anjeun"
          className="mockup-input text-[1rem] sm:text-[1.08rem]"
          autoComplete="username"
          required
        />
      </label>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Buat sandi pemain (minimal 6)"
          className="mockup-input text-[1rem] sm:text-[1.08rem]"
          autoComplete="new-password"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-[1.2rem] bg-[#f7d7cf] px-4 py-3 text-left text-sm font-semibold text-danger shadow-[0_12px_22px_rgba(90,45,32,0.12)] sm:text-base">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-[1.2rem] bg-[#dcefd3] px-4 py-3 text-left text-sm font-semibold text-primary-strong shadow-[0_12px_22px_rgba(39,79,42,0.12)] sm:text-base">
          {state.success} Sebentar lagi kamu dipindahkan ke halaman masuk.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pdf-button-green mockup-button-label mx-auto block min-h-[56px] w-full rounded-[0.95rem] px-5 text-[1.32rem] transition disabled:opacity-60 sm:min-h-[60px] sm:text-[1.42rem]"
      >
        {pending ? "MEMPROSES..." : "LANJUT"}
      </button>
    </form>
  );
}
