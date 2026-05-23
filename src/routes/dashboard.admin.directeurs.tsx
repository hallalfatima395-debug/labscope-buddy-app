import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { sendEmailInBackground, buildDirecteurAcceptedEmail } from "@/lib/send-email";

export const Route = createFileRoute("/dashboard/admin/directeurs")({
  component: AdminDirecteursPage,
});

interface PendingDirecteur {
  id: string;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  role: string | null;
  statut: string | null;
  created_at: string;
  laboratoire: string | null;
  faculte: string | null;
}

function AdminDirecteursPage() {
  const [items, setItems] = useState<PendingDirecteur[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("pending_directeurs_for_admin");
    if (error) {
      toast.error(error.message);
      setItems([]);
    } else {
      setItems((data as PendingDirecteur[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("profiles_pending_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          void load();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const decide = async (p: PendingDirecteur, statut: "accepte" | "refuse") => {
    const { error } = await supabase.from("profiles").update({ statut }).eq("id", p.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    if (statut === "accepte" && p.email) {
      const name = `${p.prenom ?? ""} ${p.nom ?? ""}`.trim();
      const { subject, html } = buildDirecteurAcceptedEmail(name);
      sendEmailInBackground({ to: p.email, subject, html });
    }
    toast.success(
      statut === "accepte"
        ? `Directeur validé · ${p.email}`
        : `Demande refusée · ${p.email}`,
    );
  };

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Demandes de Directeurs</h2>
          <p className="text-sm text-muted-foreground">
            Validation des comptes Directeurs de laboratoire (Admin Central)
          </p>
        </div>
        {items.length > 0 && <Badge variant="default">{items.length} en attente</Badge>}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <UserPlus className="mx-auto mb-3 h-8 w-8 opacity-50" />
            Aucune demande de directeur en attente.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="border-l-4 border-l-[color:var(--teal,#0D9488)]">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">
                    {p.prenom} {p.nom}
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{p.email}</span>
                    <Badge variant="outline">Directeur</Badge>
                    {p.laboratoire && <Badge variant="secondary">{p.laboratoire}</Badge>}
                    {p.faculte && <span className="opacity-80">· {p.faculte}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString("fr-FR")}
                </span>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => void decide(p, "accepte")}
                  className="gap-1"
                  style={{ backgroundColor: "#0D9488", color: "#fff" }}
                >
                  <Check className="h-4 w-4" /> Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void decide(p, "refuse")}
                  className="gap-1 text-destructive"
                >
                  <X className="h-4 w-4" /> Refuser
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}