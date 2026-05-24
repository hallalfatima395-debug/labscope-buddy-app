import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Scale, Server } from "lucide-react";
import udlLogo from "@/assets/udl-logo.png";
import { useLang } from "@/hooks/use-lang";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsLegales,
  head: () => ({
    meta: [
      { title: "Mentions légales — LabScope | UDL" },
      { name: "description", content: "Mentions légales de LabScope, plateforme de l'Université Djillali Liabès." },
    ],
  }),
});

const T = {
  fr: {
    back: "Retour à l'accueil",
    title: "Mentions légales",
    updated: "Dernière mise à jour : 22 mai 2025",
    s1: "1. Éditeur du site",
    editor: "Université Djillali Liabès — Sidi Bel Abbès",
    editorBody: "Vice-Rectorat de la Recherche Scientifique\nBP 89, Sidi Bel Abbès 22000, Algérie\nTéléphone : +213 (0) 48 74 91 36",
    emailLabel: "Email :",
    s2: "2. Directeur de publication",
    p2: "Le directeur de publication du site LabScope est le responsable du Vice-Rectorat de la Recherche Scientifique de l'Université Djillali Liabès, agissant pour le compte de l'établissement.",
    s3: "3. Hébergement",
    hostName: "Lovable Cloud",
    hostBody: "Infrastructure cloud sécurisée avec déploiement global et chiffrement des données. Lovable fournit l'hébergement et la base de données backend pour LabScope.",
    s4: "4. Propriété intellectuelle",
    p4a: "L'ensemble du contenu du site LabScope (textes, graphismes, logos, images, vidéos, icônes, logiciels, bases de données, architecture technique) est la propriété exclusive de l'Université Djillali Liabès ou de ses partenaires ayant concédé des droits d'utilisation.",
    p4b: "Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, sans autorisation préalable écrite de l'Université Djillali Liabès, est strictement interdite et constituerait une contrefaçon sanctionnée par la législation en vigueur.",
    s5: "5. Données personnelles et confidentialité",
    p5a: "LabScope collecte et traite des données personnelles (nom, prénom, adresse e-mail, contenu des messages) dans le respect de la vie privée et des droits fondamentaux.",
    p5b: "Pour connaître l'ensemble de nos engagements, consultez notre",
    policyLink: "Politique de confidentialité",
    s6: "6. Liens hypertextes",
    p6: "Le site LabScope peut contenir des liens vers des sites tiers. L'Université Djillali Liabès n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
    s7: "7. Responsabilité et limitation",
    p7: "L'Université Djillali Liabès met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées. Sa responsabilité ne saurait être engagée pour tout dommage direct ou indirect résultant de l'utilisation du site.",
    s8: "8. Droit applicable et juridiction",
    p8: "Les présentes mentions légales sont régies par le droit algérien. À défaut de résolution amiable, les tribunaux compétents de Sidi Bel Abbès seront seuls habilités à connaître du litige.",
    s9: "9. Contact",
    contactIntro: "Pour toute question relative aux mentions légales :",
    contactName: "Vice-Rectorat de la Recherche Scientifique — UDL",
    contactAddr: "BP 89, Sidi Bel Abbès 22000, Algérie",
    contactPhone: "Téléphone : +213 (0) 48 74 91 36",
    footer: "© 2026 — Université Djillali Liabès",
    legalLink: "Mentions légales",
  },
  ar: {
    back: "العودة إلى الرئيسية",
    title: "إشعارات قانونية",
    updated: "آخر تحديث: 22 ماي 2025",
    s1: "1. ناشر الموقع",
    editor: "جامعة جيلالي اليابس — سيدي بلعباس",
    editorBody: "نيابة مديرية الجامعة للبحث العلمي\nص.ب 89، سيدي بلعباس 22000، الجزائر\nالهاتف: +213 (0) 48 74 91 36",
    emailLabel: "البريد الإلكتروني:",
    s2: "2. مدير النشر",
    p2: "مدير نشر موقع لابسكوب هو المسؤول عن نيابة مديرية الجامعة للبحث العلمي بجامعة جيلالي اليابس، نيابةً عن المؤسسة.",
    s3: "3. الاستضافة",
    hostName: "Lovable Cloud",
    hostBody: "بنية تحتية سحابية آمنة بنشر عالمي وتشفير للبيانات. توفّر Lovable الاستضافة وقاعدة البيانات الخلفية للابسكوب.",
    s4: "4. الملكية الفكرية",
    p4a: "جميع محتويات موقع لابسكوب (النصوص، الرسومات، الشعارات، الصور، الفيديوهات، الأيقونات، البرمجيات، قواعد البيانات، البنية التقنية) هي ملكية حصرية لجامعة جيلالي اليابس أو لشركائها الذين منحوا حقوق الاستخدام.",
    p4b: "يُمنع منعًا باتًا كل استنساخ أو تمثيل أو تعديل أو نشر أو تكييف أو استغلال، كليًا أو جزئيًا، للموقع أو لمحتوياته، بأي وسيلة كانت، دون إذن خطي مسبق من جامعة جيلالي اليابس، ويشكّل ذلك تزويرًا يعاقب عليه القانون.",
    s5: "5. البيانات الشخصية والسرية",
    p5a: "يقوم لابسكوب بجمع ومعالجة البيانات الشخصية (اللقب، الاسم، البريد الإلكتروني، محتوى الرسائل) مع احترام الحياة الخاصة والحقوق الأساسية.",
    p5b: "للاطلاع على كامل التزاماتنا، يُرجى مراجعة",
    policyLink: "سياسة الخصوصية",
    s6: "6. الروابط التشعبية",
    p6: "قد يحتوي موقع لابسكوب على روابط لمواقع طرف ثالث. لا تمارس جامعة جيلالي اليابس أي رقابة على هذه المواقع وتُخلي مسؤوليتها عن محتوياتها.",
    s7: "7. المسؤولية وحدودها",
    p7: "تبذل جامعة جيلالي اليابس كل ما في وسعها لضمان دقة وتحديث المعلومات المنشورة. لا يمكن تحميلها أي مسؤولية عن الأضرار المباشرة أو غير المباشرة الناجمة عن استخدام الموقع.",
    s8: "8. القانون المعمول به والاختصاص القضائي",
    p8: "تخضع هذه الإشعارات القانونية للقانون الجزائري. في حال تعذّر التسوية الودية، تختص محاكم سيدي بلعباس وحدها بالنظر في النزاع.",
    s9: "9. التواصل",
    contactIntro: "لأي سؤال يتعلق بالإشعارات القانونية:",
    contactName: "نيابة مديرية الجامعة للبحث العلمي — جامعة جيلالي اليابس",
    contactAddr: "ص.ب 89، سيدي بلعباس 22000، الجزائر",
    contactPhone: "الهاتف: +213 (0) 48 74 91 36",
    footer: "© 2026 — جامعة جيلالي اليابس",
    legalLink: "إشعارات قانونية",
  },
} as const;

function MentionsLegales() {
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
            <Scale className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl" style={{ color: "#0F172A" }}>{t.title}</h1>
          <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>{t.updated}</p>
        </div>

        <div className="space-y-12">
          <Section title={t.s1}>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}><Building2 className="h-6 w-6" /></div>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>{t.editor}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed" style={{ color: "#475569" }}>{t.editorBody}</p>
                  <p className="mt-1 text-sm" style={{ color: "#475569" }}>{t.emailLabel} <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>vicerectoarat.pgrs@univ-sba.dz</a></p>
                </div>
              </div>
            </div>
          </Section>

          <Section title={t.s2}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p2}</p></Section>

          <Section title={t.s3}>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}><Server className="h-6 w-6" /></div>
                <div>
                  <p className="font-display text-lg font-semibold" style={{ color: "#0F172A" }}>{t.hostName}</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "#475569" }}>{t.hostBody}</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title={t.s4}>
            <p className="leading-relaxed" style={{ color: "#475569" }}>{t.p4a}</p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>{t.p4b}</p>
          </Section>

          <Section title={t.s5}>
            <p className="leading-relaxed" style={{ color: "#475569" }}>{t.p5a}</p>
            <p className="mt-3 leading-relaxed" style={{ color: "#475569" }}>{t.p5b}{" "}
              <Link to="/politique-confidentialite" className="underline" style={{ color: "#0D9488" }}>{t.policyLink}</Link>.
            </p>
          </Section>

          <Section title={t.s6}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p6}</p></Section>
          <Section title={t.s7}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p7}</p></Section>
          <Section title={t.s8}><p className="leading-relaxed" style={{ color: "#475569" }}>{t.p8}</p></Section>

          <Section title={t.s9}>
            <p className="leading-relaxed" style={{ color: "#475569" }}>{t.contactIntro}</p>
            <div className="mt-4 rounded-2xl border p-6" style={{ borderColor: "rgba(15,23,42,0.10)", backgroundColor: "#F8FAFC" }}>
              <p className="font-semibold" style={{ color: "#0F172A" }}>{t.contactName}</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>{t.contactAddr}</p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>{t.emailLabel} <a href="mailto:vicerectoarat.pgrs@univ-sba.dz" className="underline" style={{ color: "#0D9488" }}>vicerectoarat.pgrs@univ-sba.dz</a></p>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>{t.contactPhone}</p>
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