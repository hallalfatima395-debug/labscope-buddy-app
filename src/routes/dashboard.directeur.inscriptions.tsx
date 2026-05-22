import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserPlus, Mail } from "lucide-react";
import { toast } from "sonner";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/directeur/inscriptions")({
  component: DirecteurInscriptionsPage,
});

interface PendingRequest {
  id: string;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  role: string | null;
  statut: string | null;
  created_at: string;
  laboratoire: string | null;
}

function DirecteurInscriptionsPage() {
  const { lab, loading: labLoading } = useDirecteurLab();
  const [items, setItems] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentEmail, setSentEmail] = useState<{
    to: string;
    name: string;
    kind: "accepte" | "refuse";
  } | null>(null);

  const load = async () => {
    if (!lab?.nom_fr) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("pending_requests_for_lab", {
      p_lab: lab.nom_fr,
    });
    if (error) {
      toast.error(error.message);
      setItems([]);
    } else {
      setItems((data as PendingRequest[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!lab?.nom_fr) return;
    void load();
    const channel = supabase
      .channel("profiles_pending_directeur")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lab?.nom_fr]);

  const decide = async (p: PendingRequest, statut: "accepte" | "refuse") => {
    const { error } = await supabase.from("profiles").update({ statut }).eq("id", p.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    const name = `${p.prenom ?? ""} ${p.nom ?? ""}`.trim();
    if (statut === "accepte") {
      toast.success(`Compte validé · Email de confirmation envoyé à ${p.email}`);
    } else {
      toast.success(`Demande refusée · Email de notification envoyé à ${p.email}`);
    }
    if (p.email) setSentEmail({ to: p.email, name, kind: statut });
  };

  if (labLoading) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>;
  }

  if (!lab) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Aucun laboratoire n'est associé à votre compte directeur.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Demandes d'inscription</h2>
          <p className="text-sm text-muted-foreground">
            Demandes en attente pour <span className="font-medium">{lab.nom_fr}</span>
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
            Aucune demande en attente pour votre laboratoire.
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
                    {p.role && (
                      <Badge variant="outline" className="capitalize">
                        {p.role}
                      </Badge>
                    )}
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

      <Dialog open={!!sentEmail} onOpenChange={(o) => !o && setSentEmail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" style={{ color: "var(--teal, #0D9488)" }} />
              Email de confirmation envoyé
            </DialogTitle>
            <DialogDescription>
              Simulation d'envoi — aperçu du message transmis à l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 p-4 text-sm space-y-2">
            <p>
              <span className="font-semibold">À :</span> {sentEmail?.to}
            </p>
            <p>
              <span className="font-semibold">Objet :</span> Votre inscription au laboratoire a été acceptée
            </p>
            <hr className="my-2" />
            <p>Bonjour {sentEmail?.name || ""},</p>
            <p>
              Félicitations, votre demande d'inscription au laboratoire{" "}
              <span className="font-medium">{lab.nom_fr}</span> a été acceptée par le directeur. Vous
              pouvez désormais vous connecter à votre espace.
            </p>
            <p className="text-muted-foreground">— L'équipe LabScope</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSentEmail(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}