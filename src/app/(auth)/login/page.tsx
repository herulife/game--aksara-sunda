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
      headerTitle="Pemain Lama"
      title="Masukkan Nama Pemain"
      description="Tulis nama pemain dan sandi agar permainan bisa dilanjutkan."
      footerText="Belum punya nama pemain?"
      footerLinkLabel="Buat sekarang"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
