import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, UserCheck, Lock, Eye, Trash2, Cookie, Mail } from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";

export const Route = createFileRoute("/politique-confidentialite")({
  component: PolitiqueConfidentialite,
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — LabScope | UDL" },
      {
        name: "description",
        content:
          "Politique de confidentialité de LabScope, plateforme de l'Université Djillali Liabès. Découvrez comment nous protégeons vos données personnelles.",
      },
      { property: "og:title", content: "Politique de confidentialité — LabScope" },
      {
        property: "og:description",
        content:
          "Comment LabScope protège vos données personnelles : nom, email, messages.",
      },
    ],
  }),
});

function PolitiqueConfidentialite() {
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
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl" style={{ color: "#0F172A" }}>
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>
            Dernière mise à jour : 22 mai 2025
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. Introduction */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              1. Introduction
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              LabScope est une plateforme développée par l'Université Djillali Liabès — Sidi Bel Abbès,
              dans le cadre du Service de la Recherche Scientifique. La présente politique de confidentialité
              a pour objet d'informer les utilisateurs sur la manière dont leurs données personnelles sont
              collectées, utilisées et protégées. En utilisant LabScope, vous acceptez les pratiques décrites
              ci-après.
            </p>
          </section>

          {/* 2. Responsable du traitement */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              2. Responsable du traitement
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Le responsable du traitement des données est l'Université Djillali Liabès, représentée par
              le Service de la Recherche Scientifique.
            </p>
            <ul className="mt-3 list-none space-y-2 pl-0">
              <li className="flex items-start gap-2" style={{ color: "#475569" }}>
                <span style={{ color: "#0D9488" }}>•</span>
                <span><strong>Adresse :</strong> BP 89, Sidi Bel Abbès 22000, Algérie</span>
              </li>
              <li className="flex items-start gap-2" style={{ color: "#475569" }}>
                <span style={{ color: "#0D9488" }}>•</span>
                <span><strong>Email :</strong> vicerectoarat.pgrs@univ-sba.dz</span>
              </li>
            </ul>
          </section>

          {/* 3. Données collectées */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              3. Données collectées
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: "#475569" }}>
              LabScope collecte uniquement les données strictement nécessaires au fonctionnement de la
              plateforme et à la gestion des laboratoires de recherche.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>
                  Données d'inscription
                </h3>
                <ul className="mt-2 space-y-1 text-sm" style={{ color: "#475569" }}>
                  <li>• Nom et prénom</li>
                  <li>• Adresse e-mail</li>
                  <li>• Rôle (membre, chercheur, directeur, doctorant)</li>
                  <li>• Affiliation au laboratoire / équipe</li>
                </ul>
              </div>

              <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>
                  Messages de contact
                </h3>
                <ul className="mt-2 space-y-1 text-sm" style={{ color: "#475569" }}>
                  <li>• Nom et prénom</li>
                  <li>• Adresse e-mail</li>
                  <li>• Contenu du message</li>
                  <li>• Date d'envoi</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Finalités */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              4. Finalités du traitement
            </h2>
            <p className="mb-3 leading-relaxed" style={{ color: "#475569" }}>
              Vos données sont utilisées exclusivement pour les finalités suivantes :
            </p>
            <ul className="space-y-2" style={{ color: "#475569" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#0D9488" }}>✓</span>
                <span>Gérer l'accès à la plateforme et les rôles des utilisateurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#0D9488" }}>✓</span>
                <span>Permettre la gestion des laboratoires, équipes, projets et publications</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#0D9488" }}>✓</span>
                <span>Répondre aux messages envoyés via le formulaire de contact</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#0D9488" }}>✓</span>
                <span>Générer les bilans et rapports scientifiques annuels</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#0D9488" }}>✓</span>
                <span>Assurer la sécurité du service et prévenir les usages frauduleux</span>
              </li>
            </ul>
          </section>

          {/* 5. Confidentialité */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              5. Confidentialité et sécurité des données
            </h2>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(13,148,136,0.20)", backgroundColor: "#ECFDF5" }}>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(13,148,136,0.14)", color: "#0D9488" }}>
                <Lock className="h-5 w-5" />
              </div>
              <p className="leading-relaxed" style={{ color: "#0F172A" }}>
                <strong>LabScope garantit la confidentialité absolue de vos données.</strong> Les informations
                collectées (nom, e-mail, messages) sont strictement réservées à l'usage interne de
                l'Université Djillali Liabès et de ses services habilités. Aucune donnée personnelle n'est
                cédée, vendue, louée ou échangée avec des tiers. Les données sont stockées sur une
                infrastructure sécurisée (Lovable Cloud) avec chiffrement en transit et au repos. L'accès
                aux données est strictement contrôlé par des politiques de sécurité (RLS — Row Level Security).
              </p>
            </div>
          </section>

          {/* 6. Durée de conservation */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              6. Durée de conservation
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Les données personnelles sont conservées aussi longtemps que nécessaire aux finalités
              poursuivies. En cas de suppression d'un compte utilisateur, les données d'identification
              sont anonymisées ou supprimées dans un délai de 90 jours, sauf obligation légale contraire.
              Les messages de contact sont conservés pendant 24 mois à compter de leur réception, puis archivés
              ou supprimés.
            </p>
          </section>

          {/* 7. Droits des utilisateurs */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              7. Vos droits
            </h2>
            <p className="mb-3 leading-relaxed" style={{ color: "#475569" }}>
              Conformément à la réglementation applicable, vous disposez des droits suivants concernant
              vos données personnelles :
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Eye, title: "Droit d'accès", desc: "Vous pouvez consulter vos données personnelles en tout temps via votre profil utilisateur." },
                { icon: UserCheck, title: "Droit de rectification", desc: "Vous pouvez modifier vos nom, prénom et affiliations depuis votre tableau de bord." },
                { icon: Trash2, title: "Droit à l'effacement", desc: "Vous pouvez demander la suppression de votre compte et de vos données associées." },
                { icon: Lock, title: "Droit à la portabilité", desc: "Vous pouvez demander l'export de vos contributions (publications, projets)." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "rgba(15,23,42,0.08)", backgroundColor: "#FFFFFF" }}>
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: "#0F172A" }}>{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6B7280" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 leading-relaxed" style={{ color: "#475569" }}>
              Pour exercer ces droits, contactez-nous à l'adresse{" "}
              <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>
                vicerectoarat.pgrs@univ-sba.dz
              </a>.
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              8. Cookies et traceurs
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              LabScope utilise des cookies strictement nécessaires au fonctionnement de la plateforme
              (authentification, préférences de langue, session utilisateur). Aucun cookie publicitaire
              ou traceur tiers n'est déployé. Vous pouvez gérer les cookies via les paramètres de votre
              navigateur.
            </p>
          </section>

          {/* 9. Modifications */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              9. Modifications de la politique
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Cette politique de confidentialité peut être mise à jour périodiquement pour refléter les
              évolutions légales ou techniques. Les modifications significatives seront notifiées via
              l'interface de la plateforme ou par e-mail. Nous vous invitons à consulter régulièrement
              cette page.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
              10. Contact
            </h2>
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Pour toute question relative à la confidentialité de vos données, vous pouvez nous contacter :
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
