"use client";

import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-3.5 sm:space-y-4.5">
      <label className="block">
        <input
          name="displayName"
          type="text"
          placeholder="Ketik ngaran pamaen"
          className="mockup-input text-base sm:text-xl"
          required
        />
      </label>

      <label className="block">
        <input
          name="email"
          type="email"
          placeholder="Ketik email"
          className="mockup-input text-base sm:text-xl"
          required
        />
      </label>

      <label className="block">
        <input
          name="password"
          type="password"
          placeholder="Ketik kata sandi (minimal 6)"
          className="mockup-input text-base sm:text-xl"
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
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pdf-button-green mx-auto block min-h-[54px] w-full max-w-[210px] rounded-[0.9rem] px-5 text-[1.35rem] font-black tracking-[0.04em] transition disabled:opacity-60 sm:min-h-[62px] sm:max-w-[240px] sm:text-[1.55rem]"
      >
        {pending ? "NGAMUAT..." : "DAFTAR"}
      </button>
    </form>
  );
}
