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
    <form action={formAction} className="space-y-3.5 sm:space-y-4.5">
      <label className="block">
        <input
          name="displayName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Ketik nami pamaén"
          className="mockup-input text-base sm:text-xl"
          autoComplete="username"
          required
        />
      </label>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Ketik kecap konci (sahenteuna 6)"
          className="mockup-input text-base sm:text-xl"
          autoComplete="new-password"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-[1.4rem] bg-[#f7d7cf] px-5 py-4 text-left text-base font-semibold text-danger shadow-[0_12px_22px_rgba(90,45,32,0.12)]">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-[1.4rem] bg-[#dcefd3] px-5 py-4 text-left text-base font-semibold text-primary-strong shadow-[0_12px_22px_rgba(39,79,42,0.12)]">
          {state.success} Nami pamaén hidep langsung kasimpen, sakedap deui bade dipindahkeun ka kaca lebet.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pdf-button-green mx-auto block min-h-[54px] w-full max-w-[210px] rounded-[0.9rem] px-5 text-[1.35rem] font-black tracking-[0.04em] transition disabled:opacity-60 sm:min-h-[62px] sm:max-w-[240px] sm:text-[1.55rem]"
      >
        {pending ? "NUJU MUKA..." : "DAPTAR"}
      </button>
    </form>
  );
}
