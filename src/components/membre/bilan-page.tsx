import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMembre } from "@/hooks/use-membre";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Bilan {
  id: string;
  annee: number;
  activites: string | null;
  publications_annee: string | null;
  projets: string | null;
  communications: string | null;
  encadrements: string | null;
  avancement_these: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
}

export function BilanPage({ includeThese = false }: { includeThese?: boolean }) {
  const { membre } = useMembre();
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [activites, setActivites] = useState("");
  const [pubAnnee, setPubAnnee] = useState("");
  const [projets, setProjets] = useState("");
  const [communications, setCommunications] = useState("");
  const [encadrements, setEncadrements] = useState("");
  const [avancement, setAvancement] = useState("");
  const [encadrants, setEncadrants] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    if (!includeThese || !membre?.equipe_id) { setEncadrants([]); return; }
    void (async () => {
      const { data: mems } = await supabase
        .from("membres")
        .select("profile_id")
        .eq("equipe_id", membre.equipe_id as string);
      const ids = (mems ?? []).map((m: { profile_id: string }) => m.profile_id);
      if (ids.length === 0) { setEncadrants([]); return; }
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, nom, prenom, role")
        .in("id", ids)
        .eq("role", "enseignant");
      setEncadrants(((profs ?? []) as { id: string; nom: string | null; prenom: string | null }[])
        .map((p) => ({ id: p.id, label: `${p.prenom ?? ""} ${p.nom ?? ""}`.trim() || "—" })));
    })();
  }, [includeThese, membre?.equipe_id]);

  useEffect(() => {
    if (!membre) return;
    void (async () => {
      const { data } = await supabase
        .from("bilans")
        .select("id, annee, activites, publications_annee, projets, communications, encadrements, avancement_these, is_submitted, submitted_at")
        .eq("membre_id", membre.id)
        .eq("annee", annee)
        .maybeSingle();
      const b = (data as Bilan) ?? null;
      setBilan(b);
      setActivites(b?.activites ?? "");
      setPubAnnee(b?.publications_annee ?? "");
      setProjets(b?.projets ?? "");
      setCommunications(b?.communications ?? "");
      setEncadrements(b?.encadrements ?? "");
      setAvancement(b?.avancement_these ?? "");
    })();
  }, [membre, annee]);

  const readOnly = !!bilan?.is_submitted;

  const submit = async () => {
    if (!membre) return;
    const payload = {
      membre_id: membre.id,
      annee,
      activites,
      publications_annee: pubAnnee,
      projets,
      communications,
      encadrements,
      avancement_these: includeThese ? avancement : null,
      is_submitted: true,
      submitted_at: new Date().toISOString(),
    };
    if (bilan) {
      const { error } = await supabase.from("bilans").update(payload).eq("id", bilan.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("bilans").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Bilan soumis");
    setBilan({ ...(bilan ?? { id: "" }), ...payload } as Bilan);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-semibold" style={{ color: "var(--navy)" }}>Mon bilan</h2>
        <div className="flex items-center gap-2">
          <Label>Année</Label>
          <Input type="number" className="w-28" value={annee} onChange={(e) => setAnnee(Number(e.target.value) || new Date().getFullYear())} />
        </div>
      </div>
      {readOnly && (
        <div className="rounded-md border border-border bg-muted/40 px-4 py-2 text-sm">
          ✅ Bilan soumis le {bilan?.submitted_at ? new Date(bilan.submitted_at).toLocaleDateString() : ""} — lecture seule
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Bilan {annee}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1"><Label>Activités de recherche</Label>
            <Textarea rows={4} value={activites} onChange={(e) => setActivites(e.target.value)} disabled={readOnly} /></div>
          <div className="space-y-1"><Label>Publications de l'année</Label>
            <Textarea rows={3} value={pubAnnee} onChange={(e) => setPubAnnee(e.target.value)} disabled={readOnly} /></div>
          <div className="space-y-1"><Label>Projets</Label>
            <Textarea rows={3} value={projets} onChange={(e) => setProjets(e.target.value)} disabled={readOnly} /></div>
          <div className="space-y-1"><Label>Communications</Label>
            <Textarea rows={3} value={communications} onChange={(e) => setCommunications(e.target.value)} disabled={readOnly} /></div>
          {includeThese ? (
            <div className="space-y-1"><Label>Encadré par</Label>
              <Select value={encadrements} onValueChange={setEncadrements} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder={encadrants.length ? "Sélectionner un enseignant-chercheur" : "Aucun enseignant-chercheur dans votre équipe"} /></SelectTrigger>
                <SelectContent>
                  {encadrants.map((e) => (
                    <SelectItem key={e.id} value={e.label}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1"><Label>Encadrements</Label>
              <Textarea rows={3} value={encadrements} onChange={(e) => setEncadrements(e.target.value)} disabled={readOnly} /></div>
          )}
          {includeThese && (
            <div className="space-y-1"><Label>Avancement de la thèse</Label>
              <Textarea rows={4} value={avancement} onChange={(e) => setAvancement(e.target.value)} disabled={readOnly} /></div>
          )}
          {!readOnly && (
            <div className="flex justify-end">
              <Button onClick={submit}>Soumettre le bilan</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}