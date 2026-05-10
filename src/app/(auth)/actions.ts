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
    return "Akun tacan tiasa dipake. Mangga parios email heula, teras cobian deui.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email atanapi kecap konci tacan merenah.";
  }

  if (normalized.includes("user already registered")) {
    return "Email ieu tos kadaptar. Mangga langsung lebet wae.";
  }

  if (normalized.includes("email rate limit exceeded") || normalized.includes("rate limit")) {
    return "Kacida seringna ngadaptar dina waktos caket. Antosan heula sawatara menit, teras cobian deui.";
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
    return { error: "Sadaya kolom wajib dieusian." };
  }

  if (password.length < 6) {
    return { error: "Kecap konci sahenteuna 6 karakter." };
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
    success: "Daptar parantos hasil. Ayeuna kantun lebet wae.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email sareng kecap konci wajib dieusian." };
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
