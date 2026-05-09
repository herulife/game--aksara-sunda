"use client";

import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-3.5 sm:space-y-5">
      <label className="block">
        <input
          name="email"
          type="email"
          placeholder="Ketik email"
          className="mockup-input text-base sm:text-xl"
          required
        />
      </label>

      <p className="-mt-1 text-left text-xs font-bold text-[#fff8ec] drop-shadow-[0_3px_8px_rgba(46,38,18,0.22)] sm:text-sm">
        Pakai email nu dipake waktu daptar.
      </p>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Ketik kata sandi"
          className="mockup-input text-base sm:text-xl"
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
        className="pdf-button-green mx-auto block min-h-[54px] w-full max-w-[210px] rounded-[0.9rem] px-5 text-[1.35rem] font-black tracking-[0.04em] transition disabled:opacity-60 sm:min-h-[62px] sm:max-w-[240px] sm:text-[1.55rem]"
      >
        {pending ? "NGAMUAT..." : "MULAI"}
      </button>
    </form>
  );
}
