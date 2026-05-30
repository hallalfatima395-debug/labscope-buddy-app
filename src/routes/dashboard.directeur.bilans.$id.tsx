import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

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
  const [membre, setMembre] = useState<{ nom: string; prenom: string; role: string; grade: string | null; specialite: string | null; lab: string | null; faculte: string | null } | null>(null);

  useEffect(() => {
    void (async () => {
      const { data: b } = await supabase.from("bilans").select("*").eq("id", id).maybeSingle();
      if (!b) return;
      setBilan(b as BilanDetail);
      const { data: m } = await supabase
        .from("membres")
        .select("grade, specialite, laboratoire_id, profiles:profile_id(nom, prenom, role)")
        .eq("id", (b as BilanDetail).membre_id)
        .maybeSingle();
      const mm = m as any;
      let lab: string | null = null;
      let faculte: string | null = null;
      if (mm?.laboratoire_id) {
        const { data: l } = await supabase.from("laboratoires").select("nom_fr, faculte").eq("id", mm.laboratoire_id).maybeSingle();
        lab = (l as any)?.nom_fr ?? null;
        faculte = (l as any)?.faculte ?? null;
      }
      setMembre({
        nom: mm?.profiles?.nom ?? "—",
        prenom: mm?.profiles?.prenom ?? "—",
        role: mm?.profiles?.role ?? "",
        grade: mm?.grade ?? null,
        specialite: mm?.specialite ?? null,
        lab,
        faculte,
      });
    })();
  }, [id]);

  if (!bilan || !membre) {
    return <div className="p-6 text-muted-foreground">Chargement…</div>;
  }

  const enc = formatEncadrements(bilan.encadrements);

  return (
    <div className="space-y-4">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="no-print flex items-center justify-between max-w-4xl mx-auto">
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard/directeur/bilans"><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Link>
        </Button>
        <Button onClick={() => window.print()} size="sm">
          <Printer className="h-4 w-4 mr-2" /> Exporter en PDF
        </Button>
      </div>

      <div className="print-sheet mx-auto max-w-4xl bg-white text-black border border-border shadow-sm p-10 font-serif leading-relaxed">
        <header className="text-center border-b-2 border-black pb-4 mb-6">
          <p className="text-xs uppercase tracking-widest">République Algérienne Démocratique et Populaire</p>
          {membre.faculte && <p className="text-sm mt-1">{membre.faculte}</p>}
          {membre.lab && <p className="text-sm font-semibold mt-1">Laboratoire : {membre.lab}</p>}
          <h1 className="font-display text-3xl font-bold mt-4">Bilan d'activités — Année {bilan.annee}</h1>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-black mb-2">Identification</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="font-semibold py-1 w-48">Nom et Prénom</td><td>{membre.prenom} {membre.nom}</td></tr>
              <tr><td className="font-semibold py-1">Qualité</td><td className="capitalize">{membre.role === "enseignant" ? "Enseignant-Chercheur" : membre.role}</td></tr>
              {membre.grade && <tr><td className="font-semibold py-1">Grade</td><td>{membre.grade}</td></tr>}
              {membre.specialite && <tr><td className="font-semibold py-1">Spécialité</td><td>{membre.specialite}</td></tr>}
              <tr><td className="font-semibold py-1">Date de soumission</td><td>{bilan.submitted_at ? new Date(bilan.submitted_at).toLocaleDateString("fr-FR") : "—"}</td></tr>
            </tbody>
          </table>
        </section>

        <Section title="1. Activités de recherche">{bilan.activites}</Section>
        <Section title={`2. Publications de l'année ${bilan.annee}`}>{bilan.publications_annee}</Section>
        <Section title={`3. Projets de recherche ${bilan.annee}`}>{bilan.projets}</Section>
        <Section title="4. Communications">{bilan.communications}</Section>

        <section className="mb-6 break-inside-avoid">
          <h2 className="text-lg font-bold border-b border-black mb-2">5. Encadrements</h2>
          {membre.role === "doctorant" ? (
            <p className="text-sm whitespace-pre-wrap">Encadré par : {bilan.encadrements || "—"}</p>
          ) : (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-semibold">Doctorants encadrés (laboratoire) :</p>
                {enc.internal.length === 0 ? (
                  <p className="italic">Aucun</p>
                ) : (
                  <ul className="list-disc pl-6">{enc.internal.map((n, i) => <li key={i}>{n}</li>)}</ul>
                )}
              </div>
              {enc.external && (
                <div>
                  <p className="font-semibold">Encadrements externes :</p>
                  <p className="whitespace-pre-wrap">{enc.external}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {bilan.avancement_these && (
          <Section title="6. Avancement de la thèse">{bilan.avancement_these}</Section>
        )}

        <footer className="mt-10 pt-6 border-t border-black text-sm flex justify-between">
          <div>
            <p className="font-semibold">Signature du membre</p>
            <div className="h-16 w-48 mt-2"></div>
          </div>
          <div className="text-right">
            <p className="font-semibold">Visa du Directeur du laboratoire</p>
            <div className="h-16 w-48 mt-2 ml-auto"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="text-lg font-bold border-b border-black mb-2">{title}</h2>
      <div className="text-sm whitespace-pre-wrap min-h-[24px]">{children || <span className="italic text-gray-500">—</span>}</div>
    </section>
  );
}