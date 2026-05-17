import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Users,
  Activity,
  FileText,
  MapPin,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";
import heroImg from "@/assets/lab-hero.jpeg";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "LabScope — Gestion des laboratoires de recherche | UDL" },
      {
        name: "description",
        content:
          "LabScope, la plateforme de l'Université Djillali Liabès pour gérer vos laboratoires, équipes, projets et publications scientifiques.",
      },
      { property: "og:title", content: "LabScope — UDL Sidi Bel Abbès" },
      {
        property: "og:description",
        content: "Gérez vos laboratoires de recherche en toute simplicité.",
      },
    ],
  }),
});

const SUBTITLES = [
  "Université Djillali Liabès — Sidi Bel Abbès",
  "Service de la Recherche Scientifique",
];

function Landing() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const [subIdx, setSubIdx] = useState(0);
  const [lang, setLang] = useState<"fr" | "ar">("fr");

  useEffect(() => {
    const t = setInterval(() => setSubIdx((i) => (i + 1) % SUBTITLES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const handleStart = () => {
    if (session && profile?.statut === "accepte" && profile.role) {
      void navigate({ to: dashboardPathForRole(profile.role) });
    } else {
      void navigate({ to: "/login" });
    }
  };

  const handleContact = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé. Nous vous répondrons rapidement.");
    (e.target as HTMLFormElement).reset();
  };

  const isAr = lang === "ar";

  return (
    <div lang={lang} dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="Logo Université Djillali Liabès" className="h-12 w-auto" />
            <div className="leading-tight">
              <p className="font-display text-2xl font-semibold text-foreground">LabScope</p>
              <p
                key={subIdx}
                className="text-[11px] font-medium text-teal transition-opacity duration-500 sm:text-xs"
                style={{ color: "var(--teal)" }}
              >
                {SUBTITLES[subIdx]}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#accueil" className="text-sm font-medium text-foreground/80 transition-colors hover:text-teal" style={{ ["--tw-text-opacity" as never]: 1 }}>
              {isAr ? "الرئيسية" : "Accueil"}
            </a>
            <a href="#services" className="text-sm font-medium text-foreground/80 hover:text-teal transition-colors">
              {isAr ? "الخدمات" : "Services"}
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-teal transition-colors">
              {isAr ? "اتصل بنا" : "Contact"}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang("fr")}
                className={`rounded-full px-3 py-1 transition ${lang === "fr" ? "bg-navy text-white" : "text-foreground/60"}`}
                style={lang === "fr" ? { backgroundColor: "var(--navy)", color: "white" } : undefined}
              >
                FR
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`rounded-full px-3 py-1 transition ${lang === "ar" ? "bg-navy text-white" : "text-foreground/60"}`}
                style={lang === "ar" ? { backgroundColor: "var(--navy)", color: "white" } : undefined}
              >
                AR
              </button>
            </div>
            <Link
              to="/login"
              className="hidden rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-block"
              style={{ backgroundColor: "var(--teal)", color: "var(--teal-foreground)" }}
            >
              {isAr ? "تسجيل الدخول" : "Connexion"}
            </Link>
            <Link
              to="/login"
              className="hidden rounded-full border-2 px-5 py-2 text-sm font-semibold transition hover:bg-terracotta hover:text-white sm:inline-block"
              style={{ borderColor: "var(--terracotta)", color: "var(--terracotta)" }}
            >
              {isAr ? "تسجيل" : "Inscription"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="accueil" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Laboratoires de recherche UDL" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--navy) 88%, transparent) 0%, color-mix(in oklab, var(--navy) 60%, transparent) 100%)",
            }}
          />
        </div>
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
          <p className="mb-4 inline-block rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90" style={{ color: "var(--teal)", borderColor: "color-mix(in oklab, var(--teal) 50%, transparent)" }}>
            LabScope · UDL
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Gérez vos laboratoires <span style={{ color: "var(--teal)" }}>de recherche</span> en toute simplicité
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
            Une plateforme unifiée pour piloter équipes, projets, publications et bilans
            scientifiques au sein de l'Université Djillali Liabès — Sidi Bel Abbès.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:brightness-110"
              style={{ backgroundColor: "var(--teal)", color: "var(--teal-foreground)" }}
            >
              Commencer <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-navy"
              style={{ ["--hover-color" as never]: "var(--navy)" }}
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--teal)" }}>
              — Tout ce dont vous avez besoin pour gérer vos laboratoires —
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Nos Services</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Une suite complète d'outils conçus pour la communauté scientifique de l'UDL.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Gestion des membres",
                desc: "Centralisez chercheurs, doctorants, équipes et responsables avec validation des comptes et rôles dédiés.",
                Icon: Users,
              },
              {
                title: "Suivi des activités",
                desc: "Pilotez projets, publications et communications en temps réel, par équipe ou par laboratoire.",
                Icon: Activity,
              },
              {
                title: "Rapports & documents",
                desc: "Générez les bilans annuels, suivez les soumissions et exportez les données prêtes à publier.",
                Icon: FileText,
              },
            ].map(({ title, desc, Icon }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border-2 bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: "color-mix(in oklab, var(--teal) 25%, transparent)" }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: "linear-gradient(90deg, var(--teal), var(--terracotta))" }}
                />
                <div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "color-mix(in oklab, var(--teal) 18%, transparent)", color: "var(--teal)" }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border/70 py-24" style={{ backgroundColor: "color-mix(in oklab, var(--terracotta) 5%, var(--background))" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--terracotta)" }}>
              — Une question ? Notre équipe vous répond. —
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Contactez-nous</h2>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-5">
            <form onSubmit={handleContact} className="lg:col-span-3 grid gap-4 rounded-2xl border bg-card p-8 shadow-sm" style={{ borderColor: "color-mix(in oklab, var(--teal) 20%, transparent)" }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</label>
                  <Input required name="nom" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prénom</label>
                  <Input required name="prenom" placeholder="Votre prénom" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <Input required type="email" name="email" placeholder="vous@univ-sba.dz" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                <Textarea required name="message" rows={5} placeholder="Votre message…" />
              </div>
              <Button
                type="submit"
                className="mt-2 w-full rounded-full py-6 text-sm font-semibold"
                style={{ backgroundColor: "var(--teal)", color: "var(--teal-foreground)" }}
              >
                Envoyer le message
              </Button>
            </form>

            <div className="space-y-4 lg:col-span-2">
              <InfoCard
                Icon={MapPin}
                title="Adresse"
                lines={["Université Djillali Liabès", "BP 89 — Sidi Bel Abbès 22000, Algérie"]}
                bg="var(--navy)"
                fg="white"
              />
              <InfoCard
                Icon={Mail}
                title="Email"
                lines={["contact@labscope.univ-sba.dz", "recherche@univ-sba.dz"]}
                bg="var(--teal)"
                fg="var(--teal-foreground)"
              />
              <InfoCard
                Icon={Clock}
                title="Horaires"
                lines={["Dimanche — Jeudi", "08h30 — 16h30"]}
                bg="var(--terracotta)"
                fg="white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--navy)", color: "white" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="UDL" className="h-10 w-auto" />
            <p className="font-display text-lg">LabScope</p>
          </div>
          <p className="text-xs text-white/70">
            © 2025 — Université Djillali Liabès, Sidi Bel Abbès
          </p>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({
  Icon,
  title,
  lines,
  bg,
  fg,
}: {
  Icon: typeof MapPin;
  title: string;
  lines: string[];
  bg: string;
  fg: string;
}) {
  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: bg, color: fg }}>
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white/15 p-3">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold">{title}</p>
          <div className="mt-1 space-y-0.5 text-sm opacity-90">
            {lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
