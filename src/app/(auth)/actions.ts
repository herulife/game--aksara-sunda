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
    return "Akun belum bisa digunakan. Coba lagi sebentar lagi.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Nama pemain atau kata sandi belum sesuai.";
  }

  if (normalized.includes("user already registered")) {
    return "Nama pemain ini sudah terdaftar. Silakan langsung masuk.";
  }

  if (normalized.includes("email rate limit exceeded") || normalized.includes("rate limit")) {
    return "Terlalu sering mendaftar dalam waktu dekat. Tunggu beberapa menit, lalu coba lagi.";
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
    return { error: "Semua kolom wajib diisi." };
  }

  if (playerKey.length < 3) {
    return { error: "Nama pemain minimal 3 huruf atau angka." };
  }

  if (password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: available, error: availabilityError } = await supabase.rpc("is_username_available", {
    input_username: playerKey,
  });

  if (availabilityError) {
    return { error: "Sedang ada gangguan kecil. Coba lagi beberapa saat lagi." };
  }

  if (!available) {
    return { error: "Nama pemain ini sudah dipakai. Silakan gunakan nama lain." };
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
    success: "Pendaftaran berhasil. Sekarang tinggal masuk saja.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const playerName = String(formData.get("playerName") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!playerName || !password) {
    return { error: "Nama pemain dan kata sandi wajib diisi." };
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
  redirect("/");
}
