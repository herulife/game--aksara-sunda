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
      headerTitle="Daptar Pamaen Anyar"
      title="Jieun Akun Aksara Sunda"
      description="Eusian ngaran, email, jeung kata sandi pikeun ngamimitian diajar."
      footerText="Geus boga akun?"
      footerLinkLabel="Asup di dieu"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
