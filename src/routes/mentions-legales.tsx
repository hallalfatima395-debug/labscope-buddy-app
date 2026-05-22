import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Globe, FileText, Scale, Server } from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsLegales,
  head: () => ({
    meta: [
      { title: "Mentions légales — LabScope | UDL" },
      {
        name: "description",
        content:
          "Mentions légales de LabScope, plateforme de l'Université Djillali Liabès. Informations éditoriales, hébergement et propriété intellectuelle.",
      },
      { property: "og:title", content: "Mentions légales — LabScope" },
      {
        property: "og:description",
        content:
          "Informations éditoriales, hébergement et propriété intellectuelle de LabScope.",
      },
    ],
  }),
});

function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={udlLogo} alt="Logo UDL" className="h-10 w-auto" />
            <div>
              <p className="font-display text-xl font-semibold" style={{ color: "#0F172A" }}>
                LabScope
              </p>
              <p className="text-[10px] font-medium" style={{ color: "#6B7280" }}>
                Université Djillali Liabès
              </p>
            </div>
          </Link>
          <Link
            to="/"
            className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-[#0D9488] hover:text-white"
            style={{ borderColor: "#0D9488", color: "#0D9488" }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}
          >
            <Scale className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl" style={{ color: "#0F172A" }}>
            Mentions légales
          </h1>
          <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>
            Dernière mise à jour : 22 mai 2025
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. Éditeur */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              1. Éditeur du site
            </h2>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>
                    Université Djillali Liabès — Sidi Bel Abbès
                  </p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "#475569" }}>
                    <strong>Service de la Recherche Scientifique</strong><br />
                    BP 89, Sidi Bel Abbès 22000, Algérie<br />
                    Téléphone : +213 (0) 48 74 91 36<br />
                    Email :{" "}
                    <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>
                      vicerectoarat.pgrs@univ-sba.dz
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Directeur de publication */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              2. Directeur de publication
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Le directeur de publication du site LabScope est le responsable du Service de la Recherche
              Scientifique de l'Université Djillali Liabès, agissant pour le compte de l'établissement.
            </p>
          </section>

          {/* 3. Hébergement */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              3. Hébergement
            </h2>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>
                    Lovable Cloud
                  </p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "#475569" }}>
                    Infrastructure cloud sécurisée avec déploiement global et chiffrement des données.<br />
                    Lovable fournit l'hébergement et la base de données backend pour LabScope.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Propriété intellectuelle */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              4. Propriété intellectuelle
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              L'ensemble du contenu du site LabScope (textes, graphismes, logos, images, vidéos,
              icônes, logiciels, bases de données, architecture technique) est la propriété exclusive
              de l'Université Djillali Liabès ou de ses partenaires ayant concédé des droits d'utilisation.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>
              Toute reproduction, représentation, modification, publication, adaptation ou exploitation,
              totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, sans
              autorisation préalable écrite de l'Université Djillali Liabès, est strictement interdite
              et constituerait une contrefaçon sanctionnée par la législation en vigueur.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>
              Le logo de l'Université Djillali Liabès, le nom "LabScope" et leur identité visuelle
              associée sont des marques déposées ou enregistrées. Toute utilisation non autorisée est
              prohibée.
            </p>
          </section>

          {/* 5. Données personnelles */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              5. Données personnelles et confidentialité
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              LabScope collecte et traite des données personnelles (nom, prénom, adresse e-mail, contenu
              des messages) dans le respect de la vie privée et des droits fondamentaux. Ces données
              restent strictement confidentielles et ne sont utilisées que dans le cadre de la gestion
              des laboratoires de recherche et du service utilisateur.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>
              Pour connaître l'ensemble de nos engagements en matière de protection des données,
              veuillez consulter notre{" "}
              <Link
                to="/politique-confidentialite"
                className="underline"
                style={{ color: "#0D9488" }}
              >
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          {/* 6. Liens hypertextes */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              6. Liens hypertextes
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Le site LabScope peut contenir des liens vers des sites tiers (sites de partenaires,
              institutions de recherche, bases de données). L'Université Djillali Liabès n'exerce
              aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu,
              leur politique de confidentialité ou leur fonctionnement technique.
            </p>
          </section>

          {/* 7. Responsabilité */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              7. Responsabilité et limitation
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              L'Université Djillali Liabès met tout en œuvre pour assurer l'exactitude et la mise à jour
              des informations diffusées sur LabScope. Toutefois, elle ne peut garantir l'exhaustivité
              ou l'absence d'erreur. En conséquence, la responsabilité de l'Université ne saurait être
              engagée pour tout dommage direct ou indirect résultant de l'utilisation du site, d'une
              indisponibilité temporaire ou d'une erreur dans les données affichées.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>
              Les utilisateurs sont responsables de la sécurité de leurs identifiants de connexion.
              Toute activité réalisée avec un compte utilisateur est réputée avoir été effectuée par
              le titulaire légitime de ce compte.
            </p>
          </section>

          {/* 8. Droit applicable */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              8. Droit applicable et juridiction
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Les présentes mentions légales sont régies par le droit algérien. En cas de différend
              relatif à l'utilisation du site LabScope et à défaut de résolution amiable, les tribunaux
              compétents de Sidi Bel Abbès seront seuls habilités à connaître du litige.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              9. Contact
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Pour toute question relative aux mentions légales ou au fonctionnement de LabScope :
            </p>
            <div className="mt-4 rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <p className="font-semibold" style={{ color: "#0F172A" }}>Service de la Recherche Scientifique — UDL</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>BP 89, Sidi Bel Abbès 22000, Algérie</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                Email :{" "}
                <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>
                  vicerectoarat.pgrs@univ-sba.dz
                </a>
              </p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                Téléphone : +213 (0) 48 74 91 36
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="UDL" className="h-9 w-auto" />
            <p className="font-display text-lg" style={{ color: "#0F172A" }}>LabScope</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>© 2025 — Université Djillali Liabès</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link to="/politique-confidentialite" style={{ color: "#1E293B" }} className="hover:underline">
              Politique de confidentialité
            </Link>
            <Link to="/mentions-legales" style={{ color: "#1E293B" }} className="hover:underline">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
