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
      headerTitle="Input Nama Pemaen Dan Kata Sandi"
      title="Lebetkeun Nami Pamaen Sareng Kata Sandi"
      description="Mangga lebetkeun email sareng kata sandi kanggo neraskeun ka kaulinan."
      footerText="Can boga akun?"
      footerLinkLabel="Daptar di dieu"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
