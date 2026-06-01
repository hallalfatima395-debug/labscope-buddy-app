import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/directeur/bilans/$id")({ component: Page });

interface BilanDetail {
  id: string;
  annee: number;
  activites: string | null;
  publications_annee: string | null;
  projets: string | null;
  communications: string | null;
  encadrements: string | null;
  avancement_these: string | null;
  submitted_at: string | null;
  membre_id: string;
}

function formatEncadrements(raw: string | null): { internal: string[]; external: string } {
  if (!raw) return { internal: [], external: "" };
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === "object") {
      return {
        internal: Array.isArray(p.internal) ? p.internal : [],
        external: typeof p.external === "string" ? p.external : "",
      };
    }
  } catch {
    // legacy plain text
  }
  return { internal: [], external: raw };
}

function Page() {
  const { id } = Route.useParams();
  const [bilan, setBilan] = useState<BilanDetail | null>(null);
  const [membre, setMembre] = useState<{ nom: string; prenom: string; role: string; grade: string | null; specialite: string | null; lab: string | null; faculte: string | null; equipe: string | null } | null>(null);

  useEffect(() => {
    void (async () => {
      const { data: b } = await supabase.from("bilans").select("*").eq("id", id).maybeSingle();
      if (!b) return;
      setBilan(b as BilanDetail);
      const { data: m } = await supabase
        .from("membres")
        .select("grade, specialite, laboratoire_id, equipe_id, profiles:profile_id(nom, prenom, role)")
        .eq("id", (b as BilanDetail).membre_id)
        .maybeSingle();
      const mm = m as any;
      let lab: string | null = null;
      let faculte: string | null = null;
      let equipe: string | null = null;
      if (mm?.laboratoire_id) {
        const { data: l } = await supabase.from("laboratoires").select("nom_fr, faculte").eq("id", mm.laboratoire_id).maybeSingle();
        lab = (l as any)?.nom_fr ?? null;
        faculte = (l as any)?.faculte ?? null;
      }
      if (mm?.equipe_id) {
        const { data: e } = await supabase.from("equipes").select("nom").eq("id", mm.equipe_id).maybeSingle();
        equipe = (e as any)?.nom ?? null;
      }
      setMembre({
        nom: mm?.profiles?.nom ?? "—",
        prenom: mm?.profiles?.prenom ?? "—",
        role: mm?.profiles?.role ?? "",
        grade: mm?.grade ?? null,
        specialite: mm?.specialite ?? null,
        lab,
        faculte,
        equipe,
      });
    })();
  }, [id]);

  if (!bilan || !membre) {
    return <div className="p-6 text-muted-foreground">Chargement…</div>;
  }

  const enc = formatEncadrements(bilan.encadrements);

  const toBullets = (text: string | null): string[] => {
    if (!text) return [];
    return text
      .split(/\r?\n+/)
      .map((l) => l.replace(/^\s*[•\-\*]\s*/, "").trim())
      .filter((l) => l.length > 0 && l.toLowerCase() !== "aucune publication enregistrée pour cette année." && l.toLowerCase() !== "aucun projet enregistré pour cette année.");
  };

  return (
    <div className="space-y-4">
      <style>{`
        @media print {
          .no-print, header, [data-sidebar], [data-slot="sidebar"], [data-slot^="sidebar-"] { display: none !important; }
          body, html { background: white !important; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; max-width: 100% !important; color: #000 !important; }
          .print-sheet * { color: #000 !important; border-color: transparent !important; background: transparent !important; }
          main { padding: 0 !important; overflow: visible !important; }
        }
      `}</style>

      <div className="no-print flex items-center justify-between max-w-4xl mx-auto">
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard/directeur/bilans"><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Link>
        </Button>
      </div>

      <div className="print-sheet mx-auto max-w-4xl bg-white p-10 font-serif leading-relaxed" style={{ color: "#000" }}>
        <header className="text-center mb-8">
          <p className="text-sm font-semibold">Université Djillali Liabès</p>
          {membre.lab && <p className="text-sm font-semibold mt-1">{membre.lab}</p>}
          <h1 className="font-display text-2xl font-bold mt-6">Bilan d'activités — Année {bilan.annee}</h1>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3">Identification</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Nom et Prénom :</span> {membre.prenom} {membre.nom}</p>
            <p><span className="font-semibold">Qualité :</span> <span className="capitalize">{membre.role === "enseignant" ? "Enseignant-Chercheur" : membre.role}</span></p>
            {membre.grade && <p><span className="font-semibold">Grade :</span> {membre.grade}</p>}
            {membre.specialite && <p><span className="font-semibold">Spécialité :</span> {membre.specialite}</p>}
            {membre.equipe && <p><span className="font-semibold">Équipe :</span> {membre.equipe}</p>}
            <p><span className="font-semibold">Date de soumission :</span> {bilan.submitted_at ? new Date(bilan.submitted_at).toLocaleDateString("fr-FR") : "—"}</p>
          </div>
        </section>

        <BulletSection title="Activités de recherche" text={bilan.activites} />
        <BulletSection title={`Publications de l'année ${bilan.annee}`} text={bilan.publications_annee} bullets={toBullets(bilan.publications_annee)} />
        <BulletSection title={`Projets de recherche ${bilan.annee}`} text={bilan.projets} bullets={toBullets(bilan.projets)} />
        <BulletSection title="Communications" text={bilan.communications} />

        {membre.role === "doctorant" ? (
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-lg font-bold mb-3">Encadré par</h2>
            {bilan.encadrements ? (
              <ul className="list-disc pl-6 text-sm space-y-1">
                <li>{bilan.encadrements}</li>
              </ul>
            ) : (
              <p className="text-sm">—</p>
            )}
          </section>
        ) : (
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-lg font-bold mb-3">Encadrements</h2>
            {(enc.internal.length === 0 && !enc.external) ? (
              <p className="text-sm">—</p>
            ) : (
              <ul className="list-disc pl-6 text-sm space-y-1">
                {enc.internal.map((n, i) => <li key={`i-${i}`}>{n}</li>)}
                {enc.external && enc.external.split(/\r?\n+/).map((l) => l.trim()).filter(Boolean).map((n, i) => (
                  <li key={`e-${i}`}>{n}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {bilan.avancement_these && (
          <BulletSection title="Avancement de la thèse" text={bilan.avancement_these} />
        )}
      </div>
    </div>
  );
}

function BulletSection({ title, text, bullets }: { title: string; text: string | null; bullets?: string[] }) {
  const items = bullets ?? (text ? text.split(/\r?\n+/).map((l) => l.replace(/^\s*[•\-\*]\s*/, "").trim()).filter(Boolean) : []);
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm">—</p>
      ) : (
        <ul className="list-disc pl-6 text-sm space-y-1">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </section>
  );
}