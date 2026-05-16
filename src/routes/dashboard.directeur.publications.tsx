import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/directeur/publications")({ component: Page });

interface Pub {
  id: string;
  titre: string;
  auteurs: string | null;
  annee: number | null;
  type: string | null;
  equipe_id: string | null;
  equipe_nom: string;
}

const TYPES = ["article", "conférence", "brevet"] as const;

function Page() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Pub[]>([]);
  const [equipes, setEquipes] = useState<{ id: string; nom: string }[]>([]);
  const [eqFilter, setEqFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pub | null>(null);
  const [form, setForm] = useState({ titre: "", auteurs: "", annee: "", type: "article", equipe_id: "" });

  const load = useCallback(async () => {
    if (!lab) return;
    const { data } = await supabase
      .from("publications")
      .select("id, titre, auteurs, annee, type, equipe_id, equipes:equipe_id(nom)")
      .eq("laboratoire_id", lab.id)
      .order("annee", { ascending: false });
    setRows(((data as any[]) ?? []).map((p) => ({ ...p, equipe_nom: p.equipes?.nom ?? "—" })));
    const { data: eqs } = await supabase.from("equipes").select("id, nom").eq("laboratoire_id", lab.id);
    setEquipes((eqs as any) ?? []);
  }, [lab]);

  useEffect(() => { void load(); }, [load]);

  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.annee).filter((a): a is number => a != null))).sort((a, b) => b - a),
    [rows],
  );

  const filtered = useMemo(() => rows.filter((r) => {
    if (eqFilter !== "all" && r.equipe_id !== eqFilter) return false;
    if (yearFilter !== "all" && String(r.annee) !== yearFilter) return false;
    return true;
  }), [rows, eqFilter, yearFilter]);

  const openAdd = () => { setEditing(null); setForm({ titre: "", auteurs: "", annee: "", type: "article", equipe_id: "" }); setOpen(true); };
  const openEdit = (p: Pub) => {
    setEditing(p);
    setForm({ titre: p.titre, auteurs: p.auteurs ?? "", annee: p.annee ? String(p.annee) : "", type: p.type ?? "article", equipe_id: p.equipe_id ?? "" });
    setOpen(true);
  };

  const save = async () => {
    if (!lab || !form.titre.trim()) return;
    const payload = {
      titre: form.titre,
      auteurs: form.auteurs || null,
      annee: form.annee ? Number(form.annee) : null,
      type: form.type,
      equipe_id: form.equipe_id || null,
      laboratoire_id: lab.id,
    };
    const res = editing
      ? await supabase.from("publications").update(payload).eq("id", editing.id)
      : await supabase.from("publications").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Enregistré");
    setOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette publication ?")) return;
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Publications</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4" /> Ajouter</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} publication</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Titre</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
              <div className="space-y-2"><Label>Auteurs</Label><Input value={form.auteurs} onChange={(e) => setForm({ ...form, auteurs: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Année</Label><Input type="number" value={form.annee} onChange={(e) => setForm({ ...form, annee: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Équipe</Label>
                <Select value={form.equipe_id} onValueChange={(v) => setForm({ ...form, equipe_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Équipe" /></SelectTrigger>
                  <SelectContent>{equipes.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={save}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-3">
        <Select value={eqFilter} onValueChange={setEqFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Équipe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {equipes.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
          </SelectContent>
        </Select>
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
            <TableRow>
              <TableHead>Titre</TableHead><TableHead>Auteurs</TableHead><TableHead>Année</TableHead>
              <TableHead>Type</TableHead><TableHead>Équipe</TableHead><TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.titre}</TableCell><TableCell>{p.auteurs ?? "—"}</TableCell>
                <TableCell>{p.annee ?? "—"}</TableCell><TableCell>{p.type ?? "—"}</TableCell><TableCell>{p.equipe_nom}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}