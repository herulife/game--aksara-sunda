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
    return "Email belum dikonfirmasi. Cek inbox Gmail kamu atau matikan email confirmation di Supabase saat testing.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email atau password tidak cocok.";
  }

  if (normalized.includes("user already registered")) {
    return "Email ini sudah terdaftar. Silakan login saja.";
  }

  return message;
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password || !username || !displayName) {
    return { error: "Semua field wajib diisi." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: usernameAvailable, error: usernameCheckError } = await supabase.rpc(
    "is_username_available",
    { input_username: username },
  );

  if (usernameCheckError) {
    return { error: "Gagal memeriksa username. Coba lagi." };
  }

  if (!usernameAvailable) {
    return { error: "Username sudah dipakai. Pilih username lain." };
  }

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
    success:
      "Akun berhasil dibuat. Kalau login masih ditolak, kemungkinan email confirmation di Supabase masih aktif dan kamu perlu cek inbox Gmail dulu.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
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
