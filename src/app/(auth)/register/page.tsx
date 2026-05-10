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
      headerTitle="Daptar Pamaén Anyar"
      title="Damel Akun Aksara Sunda"
      description="Eusian nami pamaén sareng kecap konci kanggo ngamimitian maén."
      footerText="Parantos gaduh akun?"
      footerLinkLabel="Lebet di dieu"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
