import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, dashboardPathForRole, type Profile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import udlLogo from "@/assets/udl-logo.png";
import { useLang } from "@/hooks/use-lang";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Connexion — LabScope" },
      { name: "description", content: "Connectez-vous à votre compte LabScope." },
    ],
  }),
});

function LoginPage() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { t, dir, isAr } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const allowed = profile?.statut === "accepte" || profile?.statut === "valide";
    if (!loading && session && allowed && profile.role) {
      void navigate({ to: dashboardPathForRole(profile.role) });
    }
  }, [loading, session, profile, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        toast.error(error?.message ?? t("login.bad_credentials"));
        return;
      }

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("id, role, nom, prenom, email, statut")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profErr || !prof) {
        toast.error(t("login.profile_missing"));
        await supabase.auth.signOut();
        return;
      }

      const p = prof as Profile;

      if (p.statut === "en_attente" || p.statut === "en_attente_admin") {
        toast.warning(
          p.statut === "en_attente_admin" ? t("login.pending_admin") : t("login.pending_directeur"),
        );
        await supabase.auth.signOut();
        return;
      }
      if (p.statut === "refuse") {
        toast.error(t("login.refused"));
        await supabase.auth.signOut();
        return;
      }

      toast.success(t("login.success"));
      void navigate({ to: dashboardPathForRole(p.role) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main dir={dir} className={`flex min-h-screen items-center justify-center bg-background px-4 ${isAr ? "font-arabic" : ""}`}>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <img src={udlLogo} alt="UDL" className="mx-auto mb-3 h-16 w-auto" />
          <CardTitle className="font-display text-3xl">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              style={{ backgroundColor: "var(--teal)", color: "var(--teal-foreground)" }}
              disabled={submitting}
            >
              {submitting ? t("login.submitting") : t("login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}