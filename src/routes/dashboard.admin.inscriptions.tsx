import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/admin/inscriptions")({
  component: AdminInscriptionsPage,
});

interface PendingProfile {
  id: string;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  role: string | null;
  statut: string | null;
  created_at: string;
}

function AdminInscriptionsPage() {
  const [items, setItems] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, nom, prenom, email, role, statut, created_at")
      .eq("statut", "en_attente")
      .order("created_at", { ascending: false });
    setItems((data as PendingProfile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("profiles_pending_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const p = payload.new as PendingProfile;
            if (p.statut === "en_attente") {
              setItems((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
              toast.info(`Nouvelle demande : ${p.prenom ?? ""} ${p.nom ?? ""}`);
            }
          } else if (payload.eventType === "UPDATE") {
            const p = payload.new as PendingProfile;
            setItems((prev) =>
              p.statut === "en_attente"
                ? prev.map((x) => (x.id === p.id ? p : x))
                : prev.filter((x) => x.id !== p.id),
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((x) => x.id !== (payload.old as { id: string }).id));
          }
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const decide = async (id: string, statut: "accepte" | "refuse") => {
    const { error } = await supabase.from("profiles").update({ statut }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(statut === "accepte" ? "Compte validé" : "Compte refusé");
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Demandes d'inscription</h2>
          <p className="text-sm text-muted-foreground">
            Comptes en attente de validation par l'administrateur
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
            Aucune demande en attente.
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
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{p.email}</span>
                    {p.role && <Badge variant="outline" className="capitalize">{p.role}</Badge>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString("fr-FR")}
                </span>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => void decide(p.id, "accepte")}
                  className="gap-1"
                  style={{ backgroundColor: "#0D9488", color: "#fff" }}
                >
                  <Check className="h-4 w-4" /> Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void decide(p.id, "refuse")}
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