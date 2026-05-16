import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";

export const Route = createFileRoute("/dashboard/directeur/bilans")({ component: Page });

interface Row { id: string; nom: string; prenom: string; role: string; submitted: boolean }

function Page() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!lab) return;
    void (async () => {
      const [{ data: membres }, { data: bilans }] = await Promise.all([
        supabase.from("membres").select("id, profiles:profile_id(nom, prenom, role)").eq("laboratoire_id", lab.id),
        supabase.from("bilans").select("membre_id, is_submitted"),
      ]);
      const submitted = new Set(((bilans as any[]) ?? []).filter((b) => b.is_submitted).map((b) => b.membre_id));
      setRows(((membres as any[]) ?? [])
        .filter((m) => m.profiles?.role === "enseignant" || m.profiles?.role === "doctorant")
        .map((m) => ({
          id: m.id,
          nom: m.profiles?.nom ?? "—",
          prenom: m.profiles?.prenom ?? "—",
          role: m.profiles?.role ?? "",
          submitted: submitted.has(m.id),
        })));
    })();
  }, [lab]);

  return (
    <div className="space-y-4 max-w-5xl">
      <h2 className="text-2xl font-semibold">Bilans</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nom</TableHead><TableHead>Prénom</TableHead><TableHead>Rôle</TableHead><TableHead>Bilan</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.nom}</TableCell><TableCell>{r.prenom}</TableCell>
                <TableCell className="capitalize">{r.role}</TableCell>
                <TableCell>{r.submitted ? "✅ Soumis" : "❌ Non soumis"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}