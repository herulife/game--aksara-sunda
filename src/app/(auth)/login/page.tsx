import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      headerTitle="Masuk Permainan"
      title="Masuk ke Aksara Sunda"
      description="Masukkan nama pemain dan kata sandi agar bisa langsung melanjutkan permainan."
      footerText="Belum punya akun?"
      footerLinkLabel="Daftar di sini"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
