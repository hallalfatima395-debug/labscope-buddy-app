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
  Phone,
} from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";
import heroImg from "@/assets/lab-hero.jpeg";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InscriptionModal } from "@/components/inscription-modal";
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

const SUBTITLES_AR = [
  "جامعة جيلالي اليابس — سيدي بلعباس",
  "مصلحة البحث العلمي",
];

const T = {
  fr: {
    nav: { home: "Accueil", services: "Services", contact: "Contact", login: "Connexion", register: "Inscription" },
    hero: {
      eyebrow: "LabScope · UDL",
      titleA: "Gérez vos laboratoires",
      titleB: "de recherche",
      titleC: "en toute simplicité",
      desc: "Une plateforme unifiée pour piloter équipes, projets, publications et bilans scientifiques au sein de l'Université Djillali Liabès — Sidi Bel Abbès.",
      cta: "Commencer",
      more: "En savoir plus",
    },
    services: {
      eyebrow: "— Tout ce dont vous avez besoin pour gérer vos laboratoires —",
      title: "Nos Services",
      sub: "Une suite complète d'outils conçus pour la communauté scientifique de l'UDL.",
      items: [
        { title: "Gestion des membres", desc: "Centralisez chercheurs, doctorants, équipes et responsables avec validation des comptes et rôles dédiés." },
        { title: "Suivi des activités", desc: "Pilotez projets, publications et communications en temps réel, par équipe ou par laboratoire." },
        { title: "Rapports & documents", desc: "Générez les bilans annuels, suivez les soumissions et exportez les données prêtes à publier." },
      ],
    },
    contact: {
      eyebrow: "— Une question ? Notre équipe vous répond. —",
      title: "Contactez-nous",
      nom: "Nom", prenom: "Prénom", email: "Email", message: "Message",
      send: "Envoyer le message",
      address: "Adresse", emailLabel: "Email", hours: "Horaires", phone: "Téléphone",
      addressLines: ["Université Djillali Liabès", "BP 89, Sidi Bel Abbès 22000, Algérie"],
      emailLines: ["vicerectoarat.pgrs@univ-sba.dz"],
      hoursLines: ["Dimanche – Jeudi", "08h00 – 16h30"],
      phoneLines: ["+213 (0) 48 74 91 36"],
    },
    footer: "© 2025 — Université Djillali Liabès",
  },
  ar: {
    nav: { home: "الرئيسية", services: "الخدمات", contact: "اتصل بنا", login: "تسجيل الدخول", register: "إنشاء حساب" },
    hero: {
      eyebrow: "لابسكوب · جامعة جيلالي اليابس",
      titleA: "أدِر مختبرات",
      titleB: "البحث العلمي",
      titleC: "بكل سهولة",
      desc: "منصة موحّدة لإدارة الفرق والمشاريع والمنشورات والحصائل العلمية ضمن جامعة جيلالي اليابس — سيدي بلعباس.",
      cta: "ابدأ الآن",
      more: "اعرف المزيد",
    },
    services: {
      eyebrow: "— كل ما تحتاجه لإدارة مختبراتك —",
      title: "خدماتنا",
      sub: "مجموعة متكاملة من الأدوات المصمّمة للمجتمع العلمي بجامعة جيلالي اليابس.",
      items: [
        { title: "إدارة الأعضاء", desc: "نظّم الباحثين والدكاترة والفرق والمسؤولين مع التحقق من الحسابات وأدوار مخصّصة." },
        { title: "متابعة الأنشطة", desc: "تتبّع المشاريع والمنشورات والمداخلات في الوقت الفعلي حسب الفريق أو المختبر." },
        { title: "التقارير والوثائق", desc: "أنشئ الحصائل السنوية وتابع الإيداعات وصدّر البيانات الجاهزة للنشر." },
      ],
    },
    contact: {
      eyebrow: "— لديك سؤال؟ فريقنا في خدمتك. —",
      title: "اتصل بنا",
      nom: "اللقب", prenom: "الاسم", email: "البريد الإلكتروني", message: "الرسالة",
      send: "إرسال الرسالة",
      address: "العنوان", emailLabel: "البريد الإلكتروني", hours: "أوقات العمل", phone: "الهاتف",
      addressLines: ["جامعة جيلالي اليابس", "ص.ب 89، سيدي بلعباس 22000، الجزائر"],
      emailLines: ["vicerectoarat.pgrs@univ-sba.dz"],
      hoursLines: ["الأحد – الخميس", "08:00 – 16:30"],
      phoneLines: ["+213 (0) 48 74 91 36"],
    },
    footer: "© 2025 — جامعة جيلالي اليابس",
  },
} as const;

function Landing() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const [subIdx, setSubIdx] = useState(0);
  const [lang, setLang] = useState<"fr" | "ar">(() => {
    if (typeof window === "undefined") return "fr";
    const stored = window.localStorage.getItem("labscope-lang");
    return stored === "ar" || stored === "fr" ? stored : "fr";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("labscope-lang", lang);
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }
  }, [lang]);

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
  const t = T[lang];
  const subtitles = isAr ? SUBTITLES_AR : SUBTITLES;

  return (
    <div lang={lang} dir={isAr ? "rtl" : "ltr"} className={`min-h-screen bg-background text-foreground ${isAr ? "font-arabic" : ""}`}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="Logo Université Djillali Liabès" className="h-12 w-auto" />
            <div className="leading-tight">
              <p className="font-display text-2xl font-semibold text-foreground">LabScope</p>
              <p
                key={`${lang}-${subIdx}`}
                className="text-[11px] font-medium transition-opacity duration-500 sm:text-xs"
                style={{ color: "#0F172A" }}
              >
                {subtitles[subIdx]}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#accueil" className="text-sm font-semibold transition-colors" style={{ color: "#1E293B" }}>{t.nav.home}</a>
            <a href="#services" className="text-sm font-semibold transition-colors" style={{ color: "#1E293B" }}>{t.nav.services}</a>
            <a href="#contact" className="text-sm font-semibold transition-colors" style={{ color: "#1E293B" }}>{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border p-0.5 text-xs font-semibold" style={{ borderColor: "rgba(15,23,42,0.18)", backgroundColor: "#FFFFFF" }}>
              <button
                onClick={() => setLang("fr")}
                className="rounded-full px-3 py-1 transition"
                style={lang === "fr" ? { backgroundColor: "#0D9488", color: "#FFFFFF" } : { color: "#1E293B" }}
              >
                FR
              </button>
              <button
                onClick={() => setLang("ar")}
                className="rounded-full px-3 py-1 transition"
                style={lang === "ar" ? { backgroundColor: "#0D9488", color: "#FFFFFF" } : { color: "#1E293B" }}
              >
                AR
              </button>
            </div>
            <InscriptionModal defaultTab="connexion">
              <button
                type="button"
                className="hidden rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition hover:brightness-110 sm:inline-block"
                style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}
              >
                {t.nav.login}
              </button>
            </InscriptionModal>
            <InscriptionModal defaultTab="inscription">
              <button
                type="button"
                className="hidden rounded-full border-2 bg-transparent px-5 py-2 text-sm font-semibold transition hover:bg-[#0D9488] hover:text-white sm:inline-block"
                style={{ borderColor: "#0D9488", color: "#0D9488" }}
              >
                {t.nav.register}
              </button>
            </InscriptionModal>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="accueil" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Laboratoires de recherche UDL" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.65)",
            }}
          />
        </div>
        <div className={`mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-12 ${isAr ? "items-end text-right" : "items-start text-left"}`}>
          <p className="mb-4 inline-block rounded-full border px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#F1F5F9", borderColor: "rgba(241,245,249,0.45)" }}>
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-title max-w-3xl font-sans text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            {t.hero.titleA} {t.hero.titleB} {t.hero.titleC}
          </h1>
          <p className="hero-desc mt-4 max-w-xl text-base font-normal leading-relaxed sm:text-lg">{t.hero.desc}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:brightness-110"
              style={{ backgroundColor: "#0D9488", color: "#F1F5F9" }}
            >
              {t.hero.cta} <ArrowRight className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
            </button>
            <a
              href="#services"
              className="hero-outline inline-flex items-center gap-2 rounded-full border-2 border-[#E2E8F0] bg-transparent px-7 py-3 text-sm font-semibold transition hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              style={{ color: "#F1F5F9" }}
            >
              {t.hero.more}
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "#0D9488" }}>
              {t.services.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{t.services.title}</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.services.items.map((item, i) => {
              const Icon = [Users, Activity, FileText][i];
              return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: "rgba(15,23,42,0.10)" }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: "linear-gradient(90deg, #0D9488, #0F172A)" }}
                />
                <div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#475569" }}>{item.desc}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
        <section id="contact" className="border-t py-24" style={{ backgroundColor: "#F8FAFC", borderColor: "rgba(15,23,42,0.08)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "#0D9488" }}>
              {t.contact.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl" style={{ color: "#0F172A" }}>{t.contact.title}</h2>
          </div>

          <form onSubmit={handleContact} className="mx-auto mt-14 grid max-w-3xl gap-4 rounded-2xl border bg-card p-8 shadow-sm" style={{ borderColor: "rgba(15,23,42,0.10)" }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.contact.nom}</label>
                  <Input required name="nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.contact.prenom}</label>
                  <Input required name="prenom" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.contact.email}</label>
                <Input required type="email" name="email" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.contact.message}</label>
                <Textarea required name="message" rows={5} />
              </div>
              <Button
                type="submit"
                className="mt-2 w-full rounded-full py-6 text-sm font-semibold"
                style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}
              >
                {t.contact.send}
              </Button>
          </form>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            <InfoCard
              Icon={MapPin}
              title={t.contact.address}
              lines={t.contact.addressLines}
              bg="#0F172A"
              fg="#FFFFFF"
              iconBg="rgba(255,255,255,0.12)"
              iconFg="#FFFFFF"
            />
            <InfoCard
              Icon={Mail}
              title={t.contact.emailLabel}
              lines={t.contact.emailLines}
              bg="#ECFDF5"
              fg="#0F172A"
              iconBg="rgba(13,148,136,0.14)"
              iconFg="#0D9488"
            />
            <InfoCard
              Icon={Clock}
              title={t.contact.hours}
              lines={t.contact.hoursLines}
              bg="#F1F5F9"
              fg="#0F172A"
              iconBg="rgba(15,23,42,0.10)"
              iconFg="#0F172A"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="UDL" className="h-9 w-auto" />
            <p className="font-display text-lg" style={{ color: "#0F172A" }}>LabScope</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>{t.footer}</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#" style={{ color: "#1E293B" }} className="hover:underline">
              {isAr ? "سياسة الخصوصية" : "Politique de confidentialité"}
            </a>
            <a href="#" style={{ color: "#1E293B" }} className="hover:underline">
              {isAr ? "إشعارات قانونية" : "Mentions légales"}
            </a>
          </div>
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
  iconBg,
  iconFg,
}: {
  Icon: typeof MapPin;
  title: string;
  lines: readonly string[];
  bg: string;
  fg: string;
  iconBg?: string;
  iconFg?: string;
}) {
  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: bg, color: fg }}>
      <div className="flex items-start gap-4">
        <div className="rounded-xl p-3" style={{ backgroundColor: iconBg ?? "rgba(255,255,255,0.15)", color: iconFg ?? "inherit" }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold uppercase tracking-wide">{title}</p>
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
