import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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

export const Route = createFileRoute("/dashboard/directeur/equipes")({
  component: EquipesPage,
});

interface Equipe { id: string; nom: string; chef_membre_id: string | null }
interface Membre { id: string; nom: string; prenom: string; equipe_id: string | null }

function EquipesPage() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Equipe[]>([]);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipe | null>(null);
  const [nom, setNom] = useState("");

  const load = useCallback(async () => {
    if (!lab) return;
    const { data } = await supabase.from("equipes").select("id, nom, chef_membre_id").eq("laboratoire_id", lab.id).order("nom");
    setRows((data as Equipe[]) ?? []);
    const { data: mems } = await supabase
      .from("membres")
      .select("id, equipe_id, profiles:profile_id(nom, prenom, role)")
      .eq("laboratoire_id", lab.id);
    const mapped: Membre[] = ((mems as any[]) ?? [])
      .filter((m) => m.profiles?.role === "enseignant" || m.profiles?.role === "doctorant")
      .map((m) => ({ id: m.id, nom: m.profiles?.nom ?? "", prenom: m.profiles?.prenom ?? "", equipe_id: m.equipe_id }));
    setMembres(mapped);
  }, [lab]);

  useEffect(() => { void load(); }, [load]);

  const maxReached = rows.length >= 4;

  const openAdd = () => { setEditing(null); setNom(""); setOpen(true); };
  const openEdit = (e: Equipe) => { setEditing(e); setNom(e.nom); setOpen(true); };

  const save = async () => {
    if (!lab || !nom.trim()) return;
    if (editing) {
      const { error } = await supabase.from("equipes").update({ nom }).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Équipe modifiée");
    } else {
      const { error } = await supabase.from("equipes").insert({ nom, laboratoire_id: lab.id });
      if (error) return toast.error(error.message);
      toast.success("Équipe ajoutée");
    }
    setOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette équipe ?")) return;
    const { error } = await supabase.from("equipes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Équipe supprimée");
    await load();
  };

  const setChef = async (equipeId: string, membreId: string) => {
    const value = membreId === "__none__" ? null : membreId;
    const { error } = await supabase.from("equipes").update({ chef_membre_id: value }).eq("id", equipeId);
    if (error) return toast.error(error.message);
    toast.success("Chef d'équipe mis à jour");
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Équipes ({rows.length}/4)</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={maxReached} onClick={openAdd}>
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Ajouter"} équipe</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} />
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
            <TableRow><TableHead>Nom</TableHead><TableHead>Chef d'équipe</TableHead><TableHead className="w-32">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
            ) : rows.map((r) => {
              const eqMembres = membres.filter((m) => m.equipe_id === r.id);
              return (
              <TableRow key={r.id}>
                <TableCell>{r.nom}</TableCell>
                <TableCell>
                  <Select value={r.chef_membre_id ?? "__none__"} onValueChange={(v) => setChef(r.id, v)}>
                    <SelectTrigger className="w-64"><SelectValue placeholder="Désigner un chef…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Aucun —</SelectItem>
                      {eqMembres.length === 0 ? (
                        <SelectItem value="empty" disabled>Aucun chercheur dans l'équipe</SelectItem>
                      ) : eqMembres.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.prenom} {m.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}