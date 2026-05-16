import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, FolderKanban, BookOpen } from "lucide-react";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";

export const Route = createFileRoute("/dashboard/directeur/")({
  component: DirecteurHome,
});

function DirecteurHome() {
  const { lab, loading } = useDirecteurLab();
  const [equipes, setEquipes] = useState<number | null>(null);
  const [chercheurs, setChercheurs] = useState<number | null>(null);
  const [projets, setProjets] = useState<number | null>(null);
  const [publications, setPublications] = useState<number | null>(null);

  useEffect(() => {
    if (!lab) return;
    void (async () => {
      const [{ count: e }, { count: m }, { count: p }, { count: pb }] = await Promise.all([
        supabase.from("equipes").select("*", { count: "exact", head: true }).eq("laboratoire_id", lab.id),
        supabase.from("membres").select("*", { count: "exact", head: true }).eq("laboratoire_id", lab.id),
        supabase.from("projets").select("*", { count: "exact", head: true }).eq("laboratoire_id", lab.id),
        supabase.from("publications").select("*", { count: "exact", head: true }).eq("laboratoire_id", lab.id),
      ]);
      setEquipes(e ?? 0);
      setChercheurs(m ?? 0);
      setProjets(p ?? 0);
      setPublications(pb ?? 0);
    })();
  }, [lab]);

  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!lab) return <p className="text-sm text-muted-foreground">Aucun laboratoire associé à votre compte.</p>;

  const cards = [
    { title: "Équipes", value: equipes, icon: Users },
    { title: "Chercheurs", value: chercheurs, icon: GraduationCap },
    { title: "Projets", value: projets, icon: FolderKanban },
    { title: "Publications", value: publications, icon: BookOpen },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{lab.nom_fr}</h2>
        {lab.faculte && <p className="text-sm text-muted-foreground">{lab.faculte}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value ?? "—"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}