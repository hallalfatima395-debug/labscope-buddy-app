import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FlaskConical, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminDashboardHome,
});

function AdminDashboardHome() {
  const [labs, setLabs] = useState<number | null>(null);
  const [projets, setProjets] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      const [labsRes, { count: p }] = await Promise.all([
        supabase.from("laboratoires").select("id, directeur:directeur_id(statut)"),
        supabase.from("projets").select("*", { count: "exact", head: true }),
      ]);
      const accepted = (((labsRes.data as any[]) ?? []).filter((l) => l.directeur?.statut === "accepte")).length;
      setLabs(accepted);
      setProjets(p ?? 0);
    })();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de laboratoires</CardTitle>
          <FlaskConical className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{labs ?? "—"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de projets</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{projets ?? "—"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
