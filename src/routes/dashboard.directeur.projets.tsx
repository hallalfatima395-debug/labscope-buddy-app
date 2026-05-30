import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/directeur/projets")({ component: Page });

interface Projet {
  id: string;
  titre: string;
  description: string | null;
  date_debut: string | null;
  date_fin: string | null;
  equipe_id: string | null;
  equipe_nom: string;
  contributeurs: string | null;
}

interface Contributor { id: string; label: string; isDirector?: boolean }

function Page() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Projet[]>([]);
  const [equipes, setEquipes] = useState<{ id: string; nom: string; chef_membre_id: string | null }[]>([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Projet | null>(null);
  const [form, setForm] = useState({ titre: "", description: "", date_debut: "", date_fin: "", equipe_id: "" });
  const [contributeurs, setContributeurs] = useState<string[]>([]);
  const [contributorOptions, setContributorOptions] = useState<Contributor[]>([]);

  const load = useCallback(async () => {
    if (!lab) return;
    const { data } = await supabase
      .from("projets")
      .select("id, titre, description, date_debut, date_fin, equipe_id, contributeurs, equipes:equipe_id(nom)")
      .eq("laboratoire_id", lab.id);
    setRows(((data as any[]) ?? []).map((p) => ({ ...p, equipe_nom: p.equipes?.nom ?? "—" })));
    const { data: eqs } = await supabase.from("equipes").select("id, nom, chef_membre_id").eq("laboratoire_id", lab.id);
    setEquipes((eqs as any) ?? []);
  }, [lab]);

  useEffect(() => { void load(); }, [load]);

  // Reload contributor options when the selected équipe changes
  useEffect(() => {
    if (!form.equipe_id || !lab?.id) { setContributorOptions([]); return; }
    void (async () => {
      const [{ data: dir }, { data: mem }] = await Promise.all([
        supabase.rpc("get_lab_directeur", { p_lab_id: lab.id }),
        supabase.rpc("list_membres_by_equipe", { p_equipe_id: form.equipe_id }),
      ]);
      const opts: Contributor[] = [];
      const director = (dir as any[] | null)?.[0];
      if (director) {
        opts.push({ id: `dir:${director.id}`, label: `${director.prenom ?? ""} ${director.nom ?? ""}`.trim() + " (Directeur)", isDirector: true });
      }
      ((mem as any[]) ?? []).forEach((m: any) => {
        opts.push({ id: m.id, label: `${m.prenom ?? ""} ${m.nom ?? ""}`.trim() + (m.role ? ` (${m.role})` : "") });
      });
      setContributorOptions(opts);
    })();
  }, [form.equipe_id, lab?.id]);

  const filtered = useMemo(() => filter === "all" ? rows : rows.filter((r) => r.equipe_id === filter), [rows, filter]);

  const openAdd = () => { setEditing(null); setForm({ titre: "", description: "", date_debut: "", date_fin: "", equipe_id: "" }); setContributeurs([]); setOpen(true); };
  const openEdit = (p: Projet) => {
    setEditing(p);
    setForm({ titre: p.titre, description: p.description ?? "", date_debut: p.date_debut ?? "", date_fin: p.date_fin ?? "", equipe_id: p.equipe_id ?? "" });
    setContributeurs(p.contributeurs ? p.contributeurs.split(",").map((s) => s.trim()).filter(Boolean) : []);
    setOpen(true);
  };

  const save = async () => {
    if (!lab || !form.titre.trim()) return;
    const payload = {
      titre: form.titre,
      description: form.description || null,
      date_debut: form.date_debut || null,
      date_fin: form.date_fin || null,
      equipe_id: form.equipe_id || null,
      laboratoire_id: lab.id,
      contributeurs: contributeurs.length ? contributeurs.join(", ") : null,
    };
    const res = editing
      ? await supabase.from("projets").update(payload).eq("id", editing.id)
      : await supabase.from("projets").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Enregistré");
    setOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    const { error } = await supabase.from("projets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projets</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4" /> Ajouter</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} projet</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Titre</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date début</Label><Input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} /></div>
                <div className="space-y-2"><Label>Date fin</Label><Input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} /></div>
              </div>
              <div className="space-y-2">
                <Label>Équipe</Label>
                <Select value={form.equipe_id} onValueChange={(v) => setForm({ ...form, equipe_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Équipe" /></SelectTrigger>
                  <SelectContent>
                    {equipes.filter((e) => e.chef_membre_id !== null).map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contributeurs</Label>
                {!form.equipe_id ? (
                  <p className="text-xs text-muted-foreground">Sélectionnez d'abord une équipe.</p>
                ) : contributorOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Aucun contributeur disponible.</p>
                ) : (
                  <div className="rounded-md border border-border p-2 max-h-48 overflow-auto space-y-1">
                    {contributorOptions.map((c) => (
                      <label key={c.id} className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${c.isDirector ? "bg-muted font-medium" : ""}`}>
                        <input
                          type="checkbox"
                          checked={contributeurs.includes(c.label)}
                          onChange={() => setContributeurs((prev) => prev.includes(c.label) ? prev.filter((x) => x !== c.label) : [...prev, c.label])}
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={save}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-64"><SelectValue placeholder="Équipe" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les équipes</SelectItem>
          {equipes.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
        </SelectContent>
      </Select>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead><TableHead>Équipe</TableHead><TableHead>Début</TableHead><TableHead>Fin</TableHead><TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.titre}</TableCell><TableCell>{p.equipe_nom}</TableCell>
                <TableCell>{p.date_debut ?? "—"}</TableCell><TableCell>{p.date_fin ?? "—"}</TableCell>
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