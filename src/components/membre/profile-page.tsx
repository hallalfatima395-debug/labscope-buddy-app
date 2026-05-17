import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMembre } from "@/hooks/use-membre";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { membre, lab, reload } = useMembre();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [grade, setGrade] = useState("");
  const [specialite, setSpecialite] = useState("");

  useEffect(() => {
    setNom(profile?.nom ?? "");
    setPrenom(profile?.prenom ?? "");
    setGrade(membre?.grade ?? "");
    setSpecialite(membre?.specialite ?? "");
  }, [profile, membre]);

  const save = async () => {
    if (!profile?.id) return;
    const { error: pErr } = await supabase.from("profiles").update({ nom, prenom }).eq("id", profile.id);
    if (pErr) return toast.error(pErr.message);
    if (membre) {
      const { error: mErr } = await supabase.from("membres").update({ grade, specialite }).eq("id", membre.id);
      if (mErr) return toast.error(mErr.message);
    }
    toast.success("Profil mis à jour");
    setOpen(false);
    await Promise.all([refreshProfile(), reload()]);
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
        <h2 className="font-display text-3xl font-semibold" style={{ color: "var(--navy)" }}>Mon profil</h2>
        <Button onClick={() => setOpen(true)}><Pencil className="h-4 w-4" /> Modifier</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
        <CardContent>
          <Row label="Nom" value={profile?.nom} />
          <Row label="Prénom" value={profile?.prenom} />
          <Row label="Email" value={profile?.email} />
          <Row label="Grade" value={membre?.grade} />
          <Row label="Spécialité" value={membre?.specialite} />
          <Row label="Laboratoire" value={lab?.nom_fr} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier le profil</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Nom</Label><Input value={nom} onChange={(e) => setNom(e.target.value)} /></div>
            <div className="space-y-1"><Label>Prénom</Label><Input value={prenom} onChange={(e) => setPrenom(e.target.value)} /></div>
            <div className="space-y-1"><Label>Grade</Label><Input value={grade} onChange={(e) => setGrade(e.target.value)} disabled={!membre} /></div>
            <div className="space-y-1"><Label>Spécialité</Label><Input value={specialite} onChange={(e) => setSpecialite(e.target.value)} disabled={!membre} /></div>
            <div className="space-y-1"><Label>Laboratoire</Label><Input value={lab?.nom_fr ?? ""} disabled readOnly /></div>
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