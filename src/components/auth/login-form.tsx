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
      className="space-y-3 sm:space-y-4"
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
          className="mockup-input text-[1rem] sm:text-[1.08rem]"
          autoComplete="username"
          required
        />
      </label>

      <p className="-mt-1 text-left text-[0.78rem] font-bold text-[#6a5736] sm:text-[0.82rem]">
        Gunakan nama pemain yang sudah pernah dibuat.
      </p>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Ketik sandi pemain"
          className="mockup-input text-[1rem] sm:text-[1.08rem]"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-[1.2rem] bg-[#f7d7cf] px-4 py-3 text-left text-sm font-semibold text-danger shadow-[0_12px_22px_rgba(90,45,32,0.12)] sm:text-base">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pdf-button-green mockup-button-label mx-auto block min-h-[56px] w-full rounded-[0.95rem] px-5 text-[1.32rem] transition disabled:opacity-60 sm:min-h-[60px] sm:text-[1.42rem]"
      >
        {pending ? "MEMPROSES..." : "MULAI"}
      </button>
    </form>
  );
}
