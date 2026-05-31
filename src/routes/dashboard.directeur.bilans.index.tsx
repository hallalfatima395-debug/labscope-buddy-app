import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/directeur/bilans/")({ component: Page });

interface Row { id: string; nom: string; prenom: string; role: string; submitted: boolean; bilanId: string | null; annee: number | null; submittedAt: string | null }

function Page() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Row[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("all");

  useEffect(() => {
    if (!lab) return;
    void (async () => {
      const [{ data: membres }, { data: bilans }] = await Promise.all([
        supabase.from("membres").select("id, profiles:profile_id(nom, prenom, role)").eq("laboratoire_id", lab.id),
        supabase.from("bilans").select("id, membre_id, is_submitted, annee, submitted_at").order("submitted_at", { ascending: false }),
      ]);
      const submittedMap = new Map<string, { id: string; annee: number; submitted_at: string | null }>();
      ((bilans as any[]) ?? []).filter((b) => b.is_submitted).forEach((b) => {
        if (!submittedMap.has(b.membre_id)) submittedMap.set(b.membre_id, { id: b.id, annee: b.annee, submitted_at: b.submitted_at });
      });
      setRows(((membres as any[]) ?? [])
        .filter((m) => m.profiles?.role === "enseignant" || m.profiles?.role === "doctorant")
        .map((m) => {
          const s = submittedMap.get(m.id);
          return {
            id: m.id,
            nom: m.profiles?.nom ?? "—",
            prenom: m.profiles?.prenom ?? "—",
            role: m.profiles?.role ?? "",
            submitted: !!s,
            bilanId: s?.id ?? null,
            annee: s?.annee ?? null,
            submittedAt: s?.submitted_at ?? null,
          };
        }));
    })();
  }, [lab]);

  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.annee).filter((a): a is number => a != null))).sort((a, b) => b - a),
    [rows],
  );
  const filtered = useMemo(
    () => yearFilter === "all" ? rows : rows.filter((r) => String(r.annee) === yearFilter),
    [rows, yearFilter],
  );

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Bilans</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Recherche par année :</span>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Année" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes années</SelectItem>
            {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nom</TableHead><TableHead>Prénom</TableHead><TableHead>Rôle</TableHead><TableHead>Année</TableHead><TableHead>Bilan</TableHead><TableHead>Action</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.nom}</TableCell><TableCell>{r.prenom}</TableCell>
                <TableCell className="capitalize">{r.role}</TableCell>
                <TableCell>{r.annee ?? "—"}</TableCell>
                <TableCell>{r.submitted ? "✅ Soumis" : "❌ Non soumis"}</TableCell>
                <TableCell>
                  {r.submitted && r.bilanId ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/dashboard/directeur/bilans/$id" params={{ id: r.bilanId }}>Consulter</Link>
                    </Button>
                  ) : <span className="text-muted-foreground text-sm">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}