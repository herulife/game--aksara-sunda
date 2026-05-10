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
      headerTitle="Nama Pemain"
      title="LEBETKEUN NAMI PAMAEN"
      description="Mangga lebetkeun nami sareng jieun sandi kanggo ngamimitian."
      footerText="Sudah pernah membuat nama pemain?"
      footerLinkLabel="Masuk sekarang"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
