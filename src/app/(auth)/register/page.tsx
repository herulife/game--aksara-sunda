import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      headerTitle="Daftar Pemain Baru"
      title="Buat Akun Aksara Sunda"
      description="Isi nama pemain dan kata sandi untuk mulai bermain."
      footerText="Sudah punya akun?"
      footerLinkLabel="Masuk di sini"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
