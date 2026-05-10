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
    return "Akun tacan tiasa dipake acan. Mangga antosan heula sakedap, teras cobian deui.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Nami pamaén atanapi kecap konci tacan merenah.";
  }

  if (normalized.includes("user already registered")) {
    return "Nami pamaén ieu tos kadaptar. Mangga langsung lebet waé.";
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

function createPlayerEmail(playerKey: string) {
  return `${playerKey}@aksarasunda.local`;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const playerKey = normalizeUsername(displayName);

  if (!password || !displayName) {
    return { error: "Sadaya kolom wajib dieusian." };
  }

  if (playerKey.length < 3) {
    return { error: "Nami pamaén kedah sahenteuna 3 huruf atanapi angka." };
  }

  if (password.length < 6) {
    return { error: "Kecap konci sahenteuna 6 karakter." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: available, error: availabilityError } = await supabase.rpc("is_username_available", {
    input_username: playerKey,
  });

  if (availabilityError) {
    return { error: "Aya gangguan alit. Mangga cobian deui sawatara waktos deui." };
  }

  if (!available) {
    return { error: "Nami pamaén ieu parantos dianggo. Mangga anggo nami séjén." };
  }

  const { error } = await supabase.auth.signUp({
    email: createPlayerEmail(playerKey),
    password,
    options: {
      data: {
        username: playerKey,
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message) };
  }

  return {
    success: "Daptar parantos hasil. Ayeuna tinggal lebet waé.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const playerName = String(formData.get("playerName") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!playerName || !password) {
    return { error: "Nami pamaén sareng kecap konci wajib dieusian." };
  }

  const email = playerName.includes("@")
    ? playerName.toLowerCase()
    : createPlayerEmail(normalizeUsername(playerName));

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
