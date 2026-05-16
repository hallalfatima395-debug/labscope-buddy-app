import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/admin/equipes")({
  component: EquipesPage,
});

interface Row {
  id: string;
  nom: string;
  laboratoire: string;
  responsable: string;
}

function EquipesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    void (async () => {
      const { data: eqs } = await supabase
        .from("equipes")
        .select("id, nom, laboratoire_id, laboratoires(nom_fr, directeur_id, profiles:directeur_id(nom, prenom))");
      const mapped: Row[] = (eqs ?? []).map((e: any) => ({
        id: e.id,
        nom: e.nom,
        laboratoire: e.laboratoires?.nom_fr ?? "—",
        responsable: e.laboratoires?.profiles
          ? `${e.laboratoires.profiles.prenom ?? ""} ${e.laboratoires.profiles.nom ?? ""}`.trim() || "—"
          : "—",
      }));
      setRows(mapped);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.nom, r.laboratoire, r.responsable].some((v) => v.toLowerCase().includes(s)),
    );
  }, [rows, q]);

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Équipes</h2>
      <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Laboratoire</TableHead>
              <TableHead>Responsable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.nom}</TableCell>
                  <TableCell>{r.laboratoire}</TableCell>
                  <TableCell>{r.responsable}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
