import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function DashboardShell({ title, children }: { title: string; children?: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/login" });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">LabScope</p>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="text-sm text-muted-foreground">
                {profile.prenom} {profile.nom}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-10">
        {children ?? (
          <p className="text-sm text-muted-foreground">Bienvenue sur votre espace.</p>
        )}
      </section>
    </main>
  );
}