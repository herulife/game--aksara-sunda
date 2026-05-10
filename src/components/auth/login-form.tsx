"use client";

import { useActionState, useState } from "react";
import { signInAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};
const LAST_PLAYER_NAME_KEY = "aksara-sunda-last-player-name";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const [playerName, setPlayerName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(LAST_PLAYER_NAME_KEY) ?? "",
  );

  return (
    <form
      action={formAction}
      className="space-y-3.5 sm:space-y-5"
      onSubmit={() => {
        if (typeof window !== "undefined" && playerName.trim()) {
          window.localStorage.setItem(LAST_PLAYER_NAME_KEY, playerName.trim());
        }
      }}
    >
      <label className="block">
        <input
          name="playerName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Ketik nama pemain"
          className="mockup-input text-base sm:text-xl"
          autoComplete="username"
          required
        />
      </label>

      <p className="-mt-1 text-left text-xs font-bold text-[#fff8ec] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-sm">
        Gunakan nama pemain yang dibuat saat daftar.
      </p>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Ketik kata sandi"
          className="mockup-input text-base sm:text-xl"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-[1.4rem] bg-[#f7d7cf] px-5 py-4 text-left text-base font-semibold text-danger shadow-[0_12px_22px_rgba(90,45,32,0.12)]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pdf-button-green mx-auto block min-h-[54px] w-full max-w-[210px] rounded-[0.9rem] px-5 text-[1.3rem] font-black tracking-[0.04em] transition disabled:opacity-60 sm:min-h-[60px] sm:max-w-[234px] sm:text-[1.5rem]"
      >
        {pending ? "MEMPROSES..." : "MASUK"}
      </button>
    </form>
  );
}
