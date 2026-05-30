import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMembre } from "@/hooks/use-membre";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Pub {
  id: string; titre: string; annee: number | null; type: string | null; auteurs: string | null; equipe_id: string | null;
}
interface Equipe { id: string; nom: string }
interface Contributor { id: string; label: string; isDirector?: boolean }

export function PublicationsPage() {
  const { membre } = useMembre();
  const [rows, setRows] = useState<Pub[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pub | null>(null);
  const [titre, setTitre] = useState("");
  const [annee, setAnnee] = useState("");
  const [type, setType] = useState("article");
  const [contributeurs, setContributeurs] = useState<string[]>([]);
  const [contributorOptions, setContributorOptions] = useState<Contributor[]>([]);
  const [equipeId, setEquipeId] = useState<string>("");

  const load = useCallback(async () => {
    if (!membre) return;
    const { data } = await supabase
      .from("publications")
      .select("id, titre, annee, type, auteurs, equipe_id")
      .eq("membre_id", membre.id)
      .order("annee", { ascending: false });
    setRows((data as Pub[]) ?? []);
    if (membre.equipe_id) {
      const { data: eq } = await supabase.from("equipes").select("id, nom").eq("id", membre.equipe_id);
      setEquipes((eq as Equipe[]) ?? []);
    } else {
      setEquipes([]);
    }
  }, [membre]);

  useEffect(() => { void load(); }, [load]);

  // Load contributor options whenever the selected équipe changes
  useEffect(() => {
    if (!equipeId || !membre?.laboratoire_id) { setContributorOptions([]); return; }
    void (async () => {
      const [{ data: dir }, { data: mem }] = await Promise.all([
        supabase.rpc("get_lab_directeur", { p_lab_id: membre.laboratoire_id as string }),
        supabase.rpc("list_membres_by_equipe", { p_equipe_id: equipeId }),
      ]);
      const opts: Contributor[] = [];
      const director = (dir as any[] | null)?.[0];
      if (director) {
        opts.push({ id: `dir:${director.id}`, label: `${director.prenom ?? ""} ${director.nom ?? ""}`.trim() + " (Directeur)", isDirector: true });
      }
      ((mem as any[]) ?? []).forEach((m) => {
        opts.push({ id: m.id, label: `${m.prenom ?? ""} ${m.nom ?? ""}`.trim() + (m.role ? ` (${m.role})` : "") });
      });
      setContributorOptions(opts);
    })();
  }, [equipeId, membre?.laboratoire_id]);

  const openAdd = () => {
    setEditing(null); setTitre(""); setAnnee(String(new Date().getFullYear())); setType("article"); setContributeurs([]); setEquipeId(membre?.equipe_id ?? ""); setOpen(true);
  };
  const openEdit = (p: Pub) => {
    setEditing(p);
    setTitre(p.titre);
    setAnnee(p.annee ? String(p.annee) : "");
    setType(p.type ?? "article");
    setContributeurs(p.auteurs ? p.auteurs.split(",").map((s) => s.trim()).filter(Boolean) : []);
    setEquipeId(p.equipe_id ?? "");
    setOpen(true);
  };

  const save = async () => {
    if (!membre || !titre.trim()) return;
    const payload = {
      titre: titre.trim(),
      annee: annee ? Number(annee) : null,
      type,
      auteurs: contributeurs.join(", "),
      equipe_id: equipeId || null,
      laboratoire_id: membre.laboratoire_id,
      membre_id: membre.id,
    };
    if (editing) {
      const { error } = await supabase.from("publications").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Publication modifiée");
    } else {
      const { error } = await supabase.from("publications").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Publication ajoutée");
    }
    setOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette publication ?")) return;
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Publication supprimée");
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-semibold" style={{ color: "var(--navy)" }}>Mes publications</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} une publication</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Titre</Label><Input value={titre} onChange={(e) => setTitre(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Année</Label><Input type="number" value={annee} onChange={(e) => setAnnee(e.target.value)} /></div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="conférence">Conférence</SelectItem>
                      <SelectItem value="brevet">Brevet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Équipe</Label>
                <Select value={equipeId} onValueChange={setEquipeId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {equipes.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Contributeurs</Label>
                {!equipeId ? (
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
                          onChange={() =>
                            setContributeurs((prev) => prev.includes(c.label) ? prev.filter((x) => x !== c.label) : [...prev, c.label])
                          }
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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead><TableHead>Année</TableHead><TableHead>Type</TableHead><TableHead>Contributeurs</TableHead><TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.titre}</TableCell>
                <TableCell>{r.annee ?? "—"}</TableCell>
                <TableCell className="capitalize">{r.type ?? "—"}</TableCell>
                <TableCell>{r.auteurs ?? "—"}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}