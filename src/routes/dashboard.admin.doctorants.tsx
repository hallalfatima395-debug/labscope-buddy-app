import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/dashboard/admin/doctorants")({
  component: DoctorantsPage,
});

interface Row {
  id: string;
  nom: string;
  prenom: string;
  sujet: string;
  laboratoire: string;
}

function DoctorantsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("membres")
        .select("id, sujet_these, profiles:profile_id(nom, prenom, role, statut), laboratoires:laboratoire_id(nom_fr)");
      const mapped: Row[] = ((data as any[]) ?? [])
        .filter((m) => m.profiles?.role === "doctorant" && m.profiles?.statut === "accepte")
        .map((m) => ({
          id: m.id,
          nom: m.profiles?.nom ?? "—",
          prenom: m.profiles?.prenom ?? "—",
          sujet: m.sujet_these ?? "—",
          laboratoire: m.laboratoires?.nom_fr ?? "—",
        }));
      setRows(mapped);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.nom, r.prenom, r.sujet, r.laboratoire].some((v) => v.toLowerCase().includes(s)),
    );
  }, [rows, q]);

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Doctorants</h2>
      <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Sujet de thèse</TableHead>
              <TableHead>Laboratoire</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.nom}</TableCell>
                  <TableCell>{r.prenom}</TableCell>
                  <TableCell>{r.sujet}</TableCell>
                  <TableCell>{r.laboratoire}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
