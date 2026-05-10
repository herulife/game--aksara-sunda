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
      headerTitle="Lebet Kaulinan"
      title="Lebet Ka Aksara Sunda"
      description="Lebetkeun nami pamaén sareng kecap konci sangkan tiasa langsung neraskeun maén."
      footerText="Tacan gaduh akun?"
      footerLinkLabel="Daptar di dieu"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
