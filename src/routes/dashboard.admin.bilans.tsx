import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/admin/bilans")({
  component: BilansPage,
});

interface Row {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  laboratoire: string;
  laboratoire_id: string | null;
  submitted: boolean;
}

function BilansPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [labs, setLabs] = useState<{ id: string; nom_fr: string }[]>([]);
  const [labFilter, setLabFilter] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      const [{ data: membres }, { data: bilans }, { data: laboratoires }] = await Promise.all([
        supabase
          .from("membres")
          .select("id, laboratoire_id, profiles:profile_id(nom, prenom, role), laboratoires:laboratoire_id(nom_fr)"),
        supabase.from("bilans").select("membre_id, is_submitted"),
        supabase.from("laboratoires").select("id, nom_fr"),
      ]);
      const submittedSet = new Set(
        ((bilans as any[]) ?? []).filter((b) => b.is_submitted).map((b) => b.membre_id),
      );
      const mapped: Row[] = ((membres as any[]) ?? [])
        .filter((m) => m.profiles?.role === "enseignant" || m.profiles?.role === "doctorant")
        .map((m) => ({
          id: m.id,
          nom: m.profiles?.nom ?? "—",
          prenom: m.profiles?.prenom ?? "—",
          role: m.profiles?.role ?? "",
          laboratoire: m.laboratoires?.nom_fr ?? "—",
          laboratoire_id: m.laboratoire_id,
          submitted: submittedSet.has(m.id),
        }));
      setRows(mapped);
      setLabs((laboratoires as any[]) ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (labFilter === "all") return rows;
    return rows.filter((r) => r.laboratoire_id === labFilter);
  }, [rows, labFilter]);

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Bilans</h2>
      <Select value={labFilter} onValueChange={setLabFilter}>
        <SelectTrigger className="w-64"><SelectValue placeholder="Laboratoire" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les laboratoires</SelectItem>
          {labs.map((l) => <SelectItem key={l.id} value={l.id}>{l.nom_fr}</SelectItem>)}
        </SelectContent>
      </Select>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Laboratoire</TableHead>
              <TableHead>Bilan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.nom}</TableCell>
                  <TableCell>{r.prenom}</TableCell>
                  <TableCell className="capitalize">{r.role}</TableCell>
                  <TableCell>{r.laboratoire}</TableCell>
                  <TableCell>{r.submitted ? "✅ Soumis" : "❌ Non soumis"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
