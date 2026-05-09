"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
  success?: string;
};

function mapSupabaseAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Akun can siap dipake. Pariksa email heula, tuluy cobian deui.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email atawa kata sandi can luyu.";
  }

  if (normalized.includes("user already registered")) {
    return "Email ieu geus kadaptar. Mangga langsung asup wae.";
  }

  return message;
}

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
}

async function findAvailableUsername(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseValue: string,
) {
  const fallbackBase = normalizeUsername(baseValue) || "pamaen";

  for (let index = 0; index < 8; index += 1) {
    const candidate = index === 0 ? fallbackBase : `${fallbackBase}${Math.floor(100 + Math.random() * 900)}`;
    const { data: available, error } = await supabase.rpc("is_username_available", {
      input_username: candidate,
    });

    if (!error && available) {
      return candidate;
    }
  }

  return `${fallbackBase}${Date.now().toString().slice(-4)}`;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password || !displayName) {
    return { error: "Semua field wajib diisi." };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const supabase = await createSupabaseServerClient();
  const username = await findAvailableUsername(supabase, displayName || email.split("@")[0] || "pamaen");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message) };
  }

  return {
    success: "Akun hasil dijieun. Ayeuna mangga asup nganggo email jeung kata sandi.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email jeung kata sandi wajib dieusian." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message) };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
