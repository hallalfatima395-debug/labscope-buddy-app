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
  const [communications, setCommunications] = useState("");
  const [encadrements, setEncadrements] = useState("");
  const [encadrementsExternes, setEncadrementsExternes] = useState("");
  const [selectedDoctorants, setSelectedDoctorants] = useState<string[]>([]);
  const [avancement, setAvancement] = useState("");
  const [encadrants, setEncadrants] = useState<{ id: string; label: string }[]>([]);
  const [doctorantsLab, setDoctorantsLab] = useState<{ id: string; label: string }[]>([]);
  const [autoPublications, setAutoPublications] = useState<{ titre: string; auteurs: string | null; type: string | null }[]>([]);
  const [autoProjets, setAutoProjets] = useState<{ titre: string; description: string | null }[]>([]);

  useEffect(() => {
    if (!includeThese || !membre?.laboratoire_id) { setEncadrants([]); return; }
    void (async () => {
      const { data, error } = await supabase.rpc("list_enseignants_by_lab", { p_lab_id: membre.laboratoire_id as string });
      if (error) { setEncadrants([]); return; }
      setEncadrants(((data ?? []) as { id: string; nom: string | null; prenom: string | null }[])
        .map((p) => ({ id: p.id, label: `${p.prenom ?? ""} ${p.nom ?? ""}`.trim() || "—" })));
    })();
  }, [includeThese, membre?.laboratoire_id]);

  // Load doctorants from same lab for enseignant-chercheur "Encadrements"
  useEffect(() => {
    if (includeThese || !membre?.laboratoire_id) { setDoctorantsLab([]); return; }
    void (async () => {
      const { data, error } = await supabase.rpc("list_doctorants_by_lab", { p_lab_id: membre.laboratoire_id as string });
      if (error) { setDoctorantsLab([]); return; }
      setDoctorantsLab(((data ?? []) as { id: string; nom: string | null; prenom: string | null }[])
        .map((p) => ({ id: p.id, label: `${p.prenom ?? ""} ${p.nom ?? ""}`.trim() || "—" })));
    })();
  }, [includeThese, membre?.laboratoire_id]);

  // Auto-fetch publications and projets for current year (read-only)
  useEffect(() => {
    if (!membre) return;
    void (async () => {
      const start = `${annee}-01-01`;
      const end = `${annee}-12-31`;
      if (!membre.equipe_id) {
        setAutoPublications([]);
        setAutoProjets([]);
        return;
      }
      const [{ data: pubs }, { data: pros }] = await Promise.all([
        supabase.from("publications").select("titre, auteurs, type, annee").eq("equipe_id", membre.equipe_id).eq("annee", annee),
        supabase.from("projets").select("titre, description, date_debut, date_fin").eq("equipe_id", membre.equipe_id).or(`date_debut.lte.${end},date_debut.is.null`).or(`date_fin.gte.${start},date_fin.is.null`),
      ]);
      setAutoPublications(((pubs as any[]) ?? []).map((p) => ({ titre: p.titre, auteurs: p.auteurs, type: p.type })));
      setAutoProjets(((pros as any[]) ?? []).map((p) => ({ titre: p.titre, description: p.description })));
    })();
  }, [membre, annee]);

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
      setCommunications(b?.communications ?? "");
      // Parse encadrements payload
      const raw = b?.encadrements ?? "";
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setSelectedDoctorants(Array.isArray(parsed.internal) ? parsed.internal : []);
          setEncadrementsExternes(typeof parsed.external === "string" ? parsed.external : "");
          setEncadrements(raw);
        } else {
          setEncadrements(raw);
          setSelectedDoctorants([]);
          setEncadrementsExternes("");
        }
      } catch {
        setEncadrements(raw);
        setSelectedDoctorants([]);
        setEncadrementsExternes(includeThese ? "" : raw);
      }
      setAvancement(b?.avancement_these ?? "");
    })();
  }, [membre, annee]);

  const readOnly = !!bilan?.is_submitted;

  const toggleDoctorant = (label: string) => {
    setSelectedDoctorants((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  const submit = async () => {
    if (!membre) return;
    const publicationsText = autoPublications.length
      ? autoPublications.map((p) => `• ${p.titre}${p.auteurs ? ` — ${p.auteurs}` : ""}${p.type ? ` [${p.type}]` : ""}`).join("\n")
      : "Aucune publication enregistrée pour cette année.";
    const projetsText = autoProjets.length
      ? autoProjets.map((p) => `• ${p.titre}${p.description ? ` — ${p.description}` : ""}`).join("\n")
      : "Aucun projet enregistré pour cette année.";
    let encadrementsPayload: string;
    if (includeThese) {
      encadrementsPayload = encadrements;
    } else {
      encadrementsPayload = JSON.stringify({ internal: selectedDoctorants, external: encadrementsExternes });
    }
    const payload = {
      membre_id: membre.id,
      annee,
      activites,
      publications_annee: publicationsText,
      projets: projetsText,
      communications,
      encadrements: encadrementsPayload,
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
    toast.success("Bilan soumis et verrouillé");
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
          🔒 Bilan soumis le {bilan?.submitted_at ? new Date(bilan.submitted_at).toLocaleDateString() : ""} — verrouillé (lecture seule)
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Bilan {annee}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1"><Label>Activités de recherche</Label>
            <Textarea rows={4} value={activites} onChange={(e) => setActivites(e.target.value)} disabled={readOnly} /></div>
          <div className="space-y-1">
            <Label>Publications de l'année {annee} <span className="text-xs text-muted-foreground">(automatique)</span></Label>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm min-h-[64px]">
              {autoPublications.length === 0 ? (
                <span className="text-muted-foreground">Aucune publication enregistrée pour cette année.</span>
              ) : (
                <ul className="space-y-1">
                  {autoPublications.map((p, i) => (
                    <li key={i}>• {p.titre}{p.auteurs ? ` — ${p.auteurs}` : ""}{p.type ? ` [${p.type}]` : ""}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Projets {annee} <span className="text-xs text-muted-foreground">(automatique)</span></Label>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm min-h-[64px]">
              {autoProjets.length === 0 ? (
                <span className="text-muted-foreground">Aucun projet enregistré pour cette année.</span>
              ) : (
                <ul className="space-y-1">
                  {autoProjets.map((p, i) => (
                    <li key={i}>• {p.titre}{p.description ? ` — ${p.description}` : ""}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="space-y-1"><Label>Communications</Label>
            <Textarea rows={3} value={communications} onChange={(e) => setCommunications(e.target.value)} disabled={readOnly} /></div>
          {includeThese ? (
            <div className="space-y-1"><Label>Encadré par</Label>
              <Select value={encadrements} onValueChange={setEncadrements} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder={encadrants.length ? "Sélectionner un enseignant-chercheur du laboratoire" : "Aucun enseignant-chercheur dans votre laboratoire"} /></SelectTrigger>
                <SelectContent>
                  {encadrants.map((e) => (
                    <SelectItem key={e.id} value={e.label}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Encadrements (doctorants du laboratoire)</Label>
              <div className="rounded-md border border-border p-3 space-y-2 max-h-48 overflow-auto">
                {doctorantsLab.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Aucun doctorant dans votre laboratoire.</span>
                ) : (
                  doctorantsLab.map((d) => (
                    <label key={d.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDoctorants.includes(d.label)}
                        onChange={() => toggleDoctorant(d.label)}
                        disabled={readOnly}
                      />
                      <span>{d.label}</span>
                    </label>
                  ))
                )}
              </div>
              <Label className="pt-2">Encadrements externes / manuels</Label>
              <Textarea
                rows={3}
                placeholder="Encadrements hors laboratoire (saisie libre)…"
                value={encadrementsExternes}
                onChange={(e) => setEncadrementsExternes(e.target.value)}
                disabled={readOnly}
              />
            </div>
          )}
          {includeThese && (
            <div className="space-y-1"><Label>Avancement de la thèse</Label>
              <Textarea rows={4} value={avancement} onChange={(e) => setAvancement(e.target.value)} disabled={readOnly} /></div>
          )}
          {!readOnly && (
            <div className="flex justify-end">
              <Button onClick={submit}>Soumettre le bilan (verrouillage définitif)</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}