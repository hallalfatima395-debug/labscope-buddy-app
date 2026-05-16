import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/admin/publications")({
  component: PublicationsPage,
});

interface Pub {
  id: string;
  titre: string;
  auteurs: string | null;
  annee: number | null;
  type: string | null;
}

function PublicationsPage() {
  const [rows, setRows] = useState<Pub[]>([]);
  const [q, setQ] = useState("");
  const [annee, setAnnee] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("publications")
        .select("id, titre, auteurs, annee, type")
        .order("annee", { ascending: false });
      setRows((data as Pub[]) ?? []);
    })();
  }, []);

  const annees = useMemo(
    () => Array.from(new Set(rows.map((r) => r.annee).filter((a): a is number => a != null))).sort((a, b) => b - a),
    [rows],
  );

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return rows.filter((r) => {
      if (annee !== "all" && String(r.annee) !== annee) return false;
      if (!s) return true;
      return [r.titre, r.auteurs ?? "", r.type ?? ""].some((v) => v.toLowerCase().includes(s));
    });
  }, [rows, q, annee]);

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Publications</h2>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Select value={annee} onValueChange={setAnnee}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Année" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes années</SelectItem>
            {annees.map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteurs</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Type</TableHead>
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
                  <TableCell>{r.titre}</TableCell>
                  <TableCell>{r.auteurs ?? "—"}</TableCell>
                  <TableCell>{r.annee ?? "—"}</TableCell>
                  <TableCell>{r.type ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
