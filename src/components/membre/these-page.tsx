import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMembre } from "@/hooks/use-membre";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export function ThesePage() {
  const { membre, reload } = useMembre();
  const [open, setOpen] = useState(false);
  const [sujet, setSujet] = useState("");
  const [directeur, setDirecteur] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [statut, setStatut] = useState("En cours");

  useEffect(() => {
    setSujet(membre?.sujet_these ?? "");
    setDirecteur(membre?.directeur_these ?? "");
    setDateDebut(membre?.date_debut_these ?? "");
    setStatut(membre?.statut_these ?? "En cours");
  }, [membre]);

  const save = async () => {
    if (!membre) return;
    const { error } = await supabase.from("membres").update({
      sujet_these: sujet,
      directeur_these: directeur,
      date_debut_these: dateDebut || null,
      statut_these: statut,
    }).eq("id", membre.id);
    if (error) return toast.error(error.message);
    toast.success("Thèse mise à jour");
    setOpen(false);
    await reload();
  };

  const Row = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-border last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm">{value || "—"}</div>
    </div>
  );

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ma thèse</h2>
        <Button onClick={() => setOpen(true)}><Pencil className="h-4 w-4" /> Modifier</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Informations sur la thèse</CardTitle></CardHeader>
        <CardContent>
          <Row label="Sujet" value={membre?.sujet_these} />
          <Row label="Directeur" value={membre?.directeur_these} />
          <Row label="Date début" value={membre?.date_debut_these} />
          <Row label="Statut" value={membre?.statut_these} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier ma thèse</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Sujet</Label><Input value={sujet} onChange={(e) => setSujet(e.target.value)} /></div>
            <div className="space-y-1"><Label>Directeur</Label><Input value={directeur} onChange={(e) => setDirecteur(e.target.value)} /></div>
            <div className="space-y-1"><Label>Date début</Label><Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} /></div>
            <div className="space-y-1">
              <Label>Statut</Label>
              <Select value={statut} onValueChange={setStatut}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Soutenue">Soutenue</SelectItem>
                </SelectContent>
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
  );
}