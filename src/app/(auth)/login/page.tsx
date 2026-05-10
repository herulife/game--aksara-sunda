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
      title="LEBETKEUN NAMI PAMAEN"
      description="Mangga lebetkeun nami sareng sandi kanggo neraskeun kaulinan."
      footerText="Belum punya nama pemain?"
      footerLinkLabel="Buat sekarang"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
