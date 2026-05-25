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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useDirecteurLab } from "@/hooks/use-directeur-lab";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/directeur/chercheurs")({ component: Page });

interface Row {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  grade: string | null;
  specialite: string | null;
  equipe: string;
  role: "enseignant" | "doctorant";
}

function Page() {
  const { lab } = useDirecteurLab();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<{ id: string; nom: string; prenom: string; email: string; role: string }[]>([]);
  const [equipes, setEquipes] = useState<{ id: string; nom: string }[]>([]);
  const [form, setForm] = useState({ profile_id: "", equipe_id: "", grade: "", specialite: "" });
  const [selectedMembre, setSelectedMembre] = useState<{ grade: string | null; specialite: string | null } | null>(null);

  const load = useCallback(async () => {
    if (!lab) return;
    const { data } = await supabase
      .from("membres")
      .select("id, grade, specialite, profiles:profile_id(nom, prenom, email, role), equipes:equipe_id(nom)")
      .eq("laboratoire_id", lab.id);
    const mapped: Row[] = ((data as any[]) ?? [])
      .filter((m) => m.profiles?.role === "enseignant" || m.profiles?.role === "doctorant")
      .map((m) => ({
        id: m.id,
        nom: m.profiles?.nom ?? "",
        prenom: m.profiles?.prenom ?? "",
        email: m.profiles?.email ?? "",
        grade: m.grade,
        specialite: m.specialite,
        equipe: m.equipes?.nom ?? "—",
        role: m.profiles?.role as "enseignant" | "doctorant",
      }));
    setRows(mapped);

    const { data: eqs } = await supabase.from("equipes").select("id, nom").eq("laboratoire_id", lab.id);
    setEquipes((eqs as any) ?? []);

    const { data: profs } = await supabase
      .from("profiles")
      .select("id, nom, prenom, email, role")
      .in("role", ["enseignant", "doctorant"])
      .eq("statut", "accepte");
    const { data: existing } = await supabase.from("membres").select("profile_id").not("laboratoire_id", "is", null);
    const taken = new Set(((existing as any[]) ?? []).map((m) => m.profile_id));
    setAvailable(((profs as any[]) ?? []).filter((p) => !taken.has(p.id)));
  }, [lab]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    const base = !s ? rows : rows.filter((r) => [r.nom, r.prenom, r.email, r.grade ?? "", r.specialite ?? "", r.equipe].some((v) => v.toLowerCase().includes(s)));
    return {
      enseignants: base.filter((r) => r.role === "enseignant"),
      doctorants: base.filter((r) => r.role === "doctorant"),
    };
  }, [rows, q]);

  const assign = async () => {
    if (!lab || !form.profile_id) return;
    const existing = await supabase.from("membres").select("id").eq("profile_id", form.profile_id).maybeSingle();
    let res;
    if (existing.data) {
      res = await supabase.from("membres").update({
        laboratoire_id: lab.id,
        equipe_id: form.equipe_id || null,
        grade: form.grade || null,
        specialite: form.specialite || null,
      }).eq("id", existing.data.id);
    } else {
      res = await supabase.from("membres").insert({
        profile_id: form.profile_id,
        laboratoire_id: lab.id,
        equipe_id: form.equipe_id || null,
        grade: form.grade || null,
        specialite: form.specialite || null,
      });
    }
    if (res.error) return toast.error(res.error.message);
    toast.success("Chercheur assigné");
    setOpen(false);
    setForm({ profile_id: "", equipe_id: "", grade: "", specialite: "" });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Retirer ce chercheur du laboratoire ?")) return;
    const { error } = await supabase.from("membres").update({ laboratoire_id: null, equipe_id: null }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Chercheur retiré");
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Chercheurs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Ajouter</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Assigner un chercheur</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Utilisateur</Label>
                <Select value={form.profile_id} onValueChange={(v) => setForm({ ...form, profile_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                  <SelectContent>
                    {available.length === 0 ? <SelectItem value="none" disabled>Aucun utilisateur disponible</SelectItem> :
                      available.map((u) => <SelectItem key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.role})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Équipe</Label>
                <Select value={form.equipe_id} onValueChange={(v) => setForm({ ...form, equipe_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Équipe (optionnel)" /></SelectTrigger>
                  <SelectContent>
                    {equipes.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Grade</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></div>
              <div className="space-y-2"><Label>Spécialité</Label><Input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={assign}>Assigner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      <Tabs defaultValue="enseignants" className="w-full">
        <TabsList>
          <TabsTrigger value="enseignants">Enseignants-Chercheurs ({filtered.enseignants.length})</TabsTrigger>
          <TabsTrigger value="doctorants">Doctorants ({filtered.doctorants.length})</TabsTrigger>
        </TabsList>
        {(["enseignants", "doctorants"] as const).map((key) => (
          <TabsContent key={key} value={key}>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead><TableHead>Prénom</TableHead><TableHead>Email</TableHead>
                    <TableHead>Grade</TableHead><TableHead>Spécialité</TableHead><TableHead>Équipe</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered[key].length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune donnée disponible</TableCell></TableRow>
                  ) : filtered[key].map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.nom}</TableCell><TableCell>{r.prenom}</TableCell><TableCell>{r.email}</TableCell>
                      <TableCell>{r.grade ?? "—"}</TableCell><TableCell>{r.specialite ?? "—"}</TableCell><TableCell>{r.equipe}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}