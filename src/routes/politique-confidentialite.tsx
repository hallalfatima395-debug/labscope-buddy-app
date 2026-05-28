import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, UserCheck, Lock, Eye, Trash2, Mail } from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";
import { useLang } from "@/hooks/use-lang";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/politique-confidentialite")({
  component: PolitiqueConfidentialite,
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — LabScope | UDL" },
      { name: "description", content: "Politique de confidentialité de LabScope." },
    ],
  }),
});

const T = {
  fr: {
    back: "Retour à l'accueil",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 28 mai 2026",
    s1: "1. Introduction",
    p1: "LabScope est une plateforme développée par l'Université Djillali Liabès — Sidi Bel Abbès, dans le cadre du Vice-Rectorat de la Recherche Scientifique. La présente politique informe les utilisateurs sur la manière dont leurs données personnelles sont collectées, utilisées et protégées.",
    s2: "2. Responsable du traitement",
    p2: "Le responsable du traitement est l'Université Djillali Liabès, représentée par le Vice-Rectorat de la Recherche Scientifique.",
    addr: "Adresse :", addrV: "BP 89, Sidi Bel Abbès 22000, Algérie",
    emailL: "Email :",
    s3: "3. Données collectées",
    p3: "LabScope collecte uniquement les données strictement nécessaires au fonctionnement de la plateforme et à la gestion des laboratoires.",
    box1Title: "Données d'inscription",
    box1: ["Nom et prénom", "Adresse e-mail", "Rôle (chercheur, directeur, doctorant)", "Affiliation au laboratoire"],
    box2Title: "Messages de contact",
    box2: ["Nom et prénom", "Adresse e-mail", "Contenu du message", "Date d'envoi"],
    s4: "4. Finalités du traitement",
    p4: "Vos données sont utilisées exclusivement pour les finalités suivantes :",
    f4: [
      "Gérer l'accès à la plateforme et les rôles des utilisateurs",
      "Permettre la gestion des laboratoires, équipes, projets et publications",
      "Répondre aux messages envoyés via le formulaire de contact",
      "Générer les bilans et rapports scientifiques annuels",
      "Assurer la sécurité du service et prévenir les usages frauduleux",
    ],
    s5: "5. Confidentialité et sécurité",
    p5: "LabScope garantit la confidentialité absolue de vos données. Les informations collectées sont strictement réservées à l'usage interne de l'Université Djillali Liabès et de ses services habilités. Aucune donnée personnelle n'est cédée, vendue, louée ou échangée. Les données sont stockées sur une infrastructure cloud sécurisée avec chiffrement et politiques d'accès (RLS).",
    s6: "6. Durée de conservation",
    p6: "Les données sont conservées aussi longtemps que nécessaire. En cas de suppression d'un compte, les données sont anonymisées ou supprimées sous 90 jours. Les messages de contact sont conservés 24 mois.",
    s7: "7. Vos droits",
    p7: "Vous disposez des droits suivants concernant vos données :",
    rights: [
      { title: "Droit d'accès", desc: "Consulter vos données via votre profil." },
      { title: "Droit de rectification", desc: "Modifier vos informations depuis votre tableau de bord." },
      { title: "Droit à l'effacement", desc: "Demander la suppression de votre compte." },
      { title: "Droit à la portabilité", desc: "Exporter vos contributions (publications, projets)." },
    ],
    rightsContact: "Pour exercer ces droits, contactez-nous à",
    s8: "8. Cookies",
    p8: "LabScope utilise uniquement des cookies strictement nécessaires (authentification, langue, session). Aucun cookie publicitaire n'est déployé.",
    s9: "9. Modifications",
    p9: "Cette politique peut être mise à jour. Les modifications significatives seront notifiées via l'interface ou par e-mail.",
    s10: "10. Contact",
    contactIntro: "Pour toute question relative à la confidentialité :",
    contactName: "Vice-Rectorat de la Recherche Scientifique — UDL",
    footer: "© 2026 — Université Djillali Liabès",
    policyLink: "Politique de confidentialité", legalLink: "Mentions légales",
  },
  ar: {
    back: "العودة إلى الرئيسية",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 28 ماي 2026",
    s1: "1. مقدمة",
    p1: "لابسكوب منصة طوّرتها جامعة جيلالي اليابس — سيدي بلعباس، في إطار نيابة مديرية الجامعة للبحث العلمي. تهدف هذه السياسة إلى إعلام المستخدمين بكيفية جمع بياناتهم الشخصية واستخدامها وحمايتها.",
    s2: "2. المسؤول عن المعالجة",
    p2: "المسؤول عن معالجة البيانات هو جامعة جيلالي اليابس، ممثَّلةً بنيابة مديرية الجامعة للبحث العلمي.",
    addr: "العنوان:", addrV: "ص.ب 89، سيدي بلعباس 22000، الجزائر",
    emailL: "البريد الإلكتروني:",
    s3: "3. البيانات المجمَّعة",
    p3: "يجمع لابسكوب فقط البيانات الضرورية لتشغيل المنصة وإدارة المختبرات.",
    box1Title: "بيانات التسجيل",
    box1: ["اللقب والاسم", "البريد الإلكتروني", "الدور (باحث، مدير، طالب دكتوراه)", "الانتماء إلى المختبر"],
    box2Title: "رسائل التواصل",
    box2: ["اللقب والاسم", "البريد الإلكتروني", "محتوى الرسالة", "تاريخ الإرسال"],
    s4: "4. أهداف المعالجة",
    p4: "تُستخدم بياناتك حصريًا للأغراض التالية:",
    f4: [
      "إدارة الوصول إلى المنصة وأدوار المستخدمين",
      "تمكين إدارة المختبرات والفِرق والمشاريع والمنشورات",
      "الرد على الرسائل المرسلة عبر نموذج الاتصال",
      "إعداد الحصائل والتقارير العلمية السنوية",
      "ضمان أمن الخدمة ومنع الاستخدامات الاحتيالية",
    ],
    s5: "5. السرية والأمن",
    p5: "يضمن لابسكوب السرية التامة لبياناتك. تُحفظ المعلومات حصريًا للاستخدام الداخلي لجامعة جيلالي اليابس وخدماتها المخوّلة. لا تُباع ولا تُؤجَّر أي بيانات شخصية ولا تُتبادل مع الغير. تُخزَّن البيانات على بنية تحتية سحابية آمنة مع التشفير وسياسات الوصول (RLS).",
    s6: "6. مدة الاحتفاظ",
    p6: "تُحفظ البيانات طوال المدة اللازمة. عند حذف الحساب، تُجهَّل أو تُحذف خلال 90 يومًا. تُحفظ رسائل الاتصال لمدة 24 شهرًا.",
    s7: "7. حقوقك",
    p7: "تتمتع بالحقوق التالية المتعلقة ببياناتك:",
    rights: [
      { title: "حق الوصول", desc: "الاطلاع على بياناتك عبر ملفك الشخصي." },
      { title: "حق التصحيح", desc: "تعديل معلوماتك من لوحة التحكم." },
      { title: "حق الحذف", desc: "طلب حذف حسابك." },
      { title: "حق نقل البيانات", desc: "تصدير مساهماتك (المنشورات، المشاريع)." },
    ],
    rightsContact: "لممارسة هذه الحقوق، تواصل معنا عبر",
    s8: "8. ملفات تعريف الارتباط",
    p8: "يستخدم لابسكوب فقط ملفات تعريف الارتباط الضرورية (المصادقة، اللغة، الجلسة). لا تُستخدم أي ملفات إعلانية.",
    s9: "9. التعديلات",
    p9: "قد تُحدَّث هذه السياسة. يتم إشعار المستخدمين بالتعديلات الهامة عبر الواجهة أو البريد الإلكتروني.",
    s10: "10. التواصل",
    contactIntro: "لأي سؤال يتعلق بالسرية:",
    contactName: "نيابة مديرية الجامعة للبحث العلمي — جامعة جيلالي اليابس",
    footer: "© 2026 — جامعة جيلالي اليابس",
    policyLink: "سياسة الخصوصية", legalLink: "إشعارات قانونية",
  },
} as const;

function PolitiqueConfidentialite() {
  const { lang, dir, isAr } = useLang();
  const t = T[lang];

  return (
    <div lang={lang} dir={dir} className={`min-h-screen bg-background text-foreground ${isAr ? "font-arabic" : ""}`}>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={udlLogo} alt="UDL" className="h-10 w-auto" />
            <div>
              <p className="font-display text-xl font-semibold" style={{ color: "#0F172A" }}>LabScope</p>
              <p className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{isAr ? "جامعة جيلالي اليابس" : "Université Djillali Liabès"}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/" className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-[#0D9488] hover:text-white" style={{ borderColor: "#0D9488", color: "#0D9488" }}>{t.back}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl" style={{ color: "#0F172A" }}>{t.title}</h1>
          <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>{t.updated}</p>
        </div>

        <div className="space-y-12">
          <Section title={t.s1}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p1}</p></Section>

          <Section title={t.s2}>
            <p className="leading-relaxed" style={{ color: "#475569" }}>{t.p2}</p>
            <ul className="mt-3 list-none space-y-2 pl-0">
              <li className="flex items-start gap-2" style={{ color: "#475569" }}><span style={{ color: "#0D9488" }}>•</span><span><strong>{t.addr}</strong> {t.addrV}</span></li>
              <li className="flex items-start gap-2" style={{ color: "#475569" }}><span style={{ color: "#0D9488" }}>•</span><span><strong>{t.emailL}</strong> vicerectoarat.pgrs@univ-sba.dz</span></li>
            </ul>
          </Section>

          <Section title={t.s3}>
            <p className="mb-4 leading-relaxed" style={{ color: "#475569" }}>{t.p3}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <DataBox icon={<UserCheck className="h-5 w-5" />} title={t.box1Title} items={t.box1} />
              <DataBox icon={<Mail className="h-5 w-5" />} title={t.box2Title} items={t.box2} />
            </div>
          </Section>

          <Section title={t.s4}>
            <p className="mb-3 leading-relaxed" style={{ color: "#475569" }}>{t.p4}</p>
            <ul className="space-y-2" style={{ color: "#475569" }}>
              {t.f4.map((it) => (<li key={it} className="flex items-start gap-2"><span style={{ color: "#0D9488" }}>✓</span><span>{it}</span></li>))}
            </ul>
          </Section>

          <Section title={t.s5}>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(13,148,136,0.20)", backgroundColor: "#ECFDF5" }}>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(13,148,136,0.14)", color: "#0D9488" }}>
                <Lock className="h-5 w-5" />
              </div>
              <p className="leading-relaxed" style={{ color: "#0F172A" }}>{t.p5}</p>
            </div>
          </Section>

          <Section title={t.s6}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p6}</p></Section>

          <Section title={t.s7}>
            <p className="mb-3 leading-relaxed" style={{ color: "#475569" }}>{t.p7}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.rights.map((item, idx) => {
                const Icon = [Eye, UserCheck, Trash2, Lock][idx];
                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "rgba(15,23,42,0.08)", backgroundColor: "#FFFFFF" }}>
                    <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: "#0F172A" }}>{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6B7280" }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 leading-relaxed" style={{ color: "#475569" }}>{t.rightsContact} <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>vicerectoarat.pgrs@univ-sba.dz</a>.</p>
          </Section>

          <Section title={t.s8}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p8}</p></Section>
          <Section title={t.s9}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p9}</p></Section>

          <Section title={t.s10}>
            <p className="leading-relaxed" style={{ color: "#475569" }}>{t.contactIntro}</p>
            <div className="mt-4 rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <p className="font-semibold" style={{ color: "#0F172A" }}>{t.contactName}</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>{t.addrV}</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>{t.emailL} <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>vicerectoarat.pgrs@univ-sba.dz</a></p>
            </div>
          </Section>
        </div>
      </main>

      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={udlLogo} alt="UDL" className="h-9 w-auto" />
            <p className="font-display text-lg" style={{ color: "#0F172A" }}>LabScope</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>{t.footer}</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link to="/politique-confidentialite" style={{ color: "#1E293B" }} className="hover:underline">{t.policyLink}</Link>
            <Link to="/mentions-legales" style={{ color: "#1E293B" }} className="hover:underline">{t.legalLink}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold" style={{ color: "#0F172A" }}>
        <span className="h-8 w-1 rounded-full" style={{ backgroundColor: "#0D9488" }} />
        {title}
      </h2>
      {children}
    </section>
  );
}

function DataBox({ icon, title, items }: { icon: React.ReactNode; title: string; items: readonly string[] }) {
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>{title}</h3>
      <ul className="mt-2 space-y-1 text-sm" style={{ color: "#475569" }}>
        {items.map((it) => (<li key={it}>• {it}</li>))}
      </ul>
    </div>
  );
}