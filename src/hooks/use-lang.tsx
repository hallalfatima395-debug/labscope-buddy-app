import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, { fr: string; ar: string }>;

// Shared translations for app chrome (layouts, login, common buttons).
// Page-specific content can use t(key) as well — fall back to the key if missing.
const DICT: Dict = {
  // Common
  logout: { fr: "Déconnexion", ar: "تسجيل الخروج" },
  logoutShort: { fr: "Logout", ar: "خروج" },
  loading: { fr: "Chargement…", ar: "جارٍ التحميل…" },

  // Roles / spaces
  "space.admin": { fr: "Espace Administrateur", ar: "فضاء المسؤول" },
  "space.directeur": { fr: "Espace Directeur", ar: "فضاء المدير" },
  "space.chercheur": { fr: "Espace Chercheur", ar: "فضاء الباحث" },
  "space.doctorant": { fr: "Espace Doctorant", ar: "فضاء طالب الدكتوراه" },
  "role.admin": { fr: "Admin", ar: "المسؤول" },
  "role.directeur": { fr: "Directeur", ar: "المدير" },
  "role.chercheur": { fr: "Chercheur", ar: "باحث" },
  "role.doctorant": { fr: "Doctorant", ar: "طالب دكتوراه" },

  // Sidebar — admin
  "nav.dashboard": { fr: "Dashboard", ar: "لوحة التحكم" },
  "nav.demandes_directeurs": { fr: "Demandes Directeurs", ar: "طلبات المديرين" },
  "nav.equipes": { fr: "Équipes", ar: "الفِرَق" },
  "nav.publications": { fr: "Publications", ar: "المنشورات" },
  "nav.doctorants": { fr: "Doctorants", ar: "طلبة الدكتوراه" },
  "nav.bilans": { fr: "Bilans", ar: "الحصائل" },
  "nav.messages": { fr: "Messages", ar: "الرسائل" },
  // Sidebar — directeur
  "nav.chercheurs": { fr: "Chercheurs", ar: "الباحثون" },
  "nav.projets": { fr: "Projets", ar: "المشاريع" },
  "nav.inscriptions": { fr: "Demandes d'inscription", ar: "طلبات التسجيل" },
  // Sidebar — chercheur / doctorant
  "nav.profile": { fr: "Mon profil", ar: "ملفّي الشخصي" },
  "nav.my_publications": { fr: "Mes publications", ar: "منشوراتي" },
  "nav.my_bilan": { fr: "Mon bilan", ar: "حصيلتي" },
  "nav.these": { fr: "Ma thèse", ar: "أطروحتي" },

  // Login
  "login.title": { fr: "LabScope", ar: "لابسكوب" },
  "login.subtitle": { fr: "Connectez-vous à votre compte.", ar: "سجّل الدخول إلى حسابك." },
  "login.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "login.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "login.submit": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "login.submitting": { fr: "Connexion…", ar: "جارٍ الدخول…" },
  "login.bad_credentials": { fr: "Identifiants invalides", ar: "بيانات الاعتماد غير صحيحة" },
  "login.profile_missing": { fr: "Profil introuvable", ar: "الملف الشخصي غير موجود" },
  "login.pending_directeur": {
    fr: "Votre compte est en attente de validation par votre Directeur de laboratoire.",
    ar: "حسابك في انتظار التحقق من قِبَل مدير المختبر.",
  },
  "login.pending_admin": {
    fr: "Votre compte est en attente de validation par l'Admin Central.",
    ar: "حسابك في انتظار التحقق من قِبَل المسؤول المركزي.",
  },
  "login.refused": { fr: "Votre compte a été refusé", ar: "تم رفض حسابك" },
  "login.success": { fr: "Connexion réussie", ar: "تم تسجيل الدخول بنجاح" },

  // Header subtitle (logo)
  "logo.subtitle": {
    fr: "Vice-Rectorat de la Recherche Scientifique",
    ar: "نيابة مديرية الجامعة للبحث العلمي",
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isAr: boolean;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

const STORAGE_KEY = "labscope-lang";

function readInitial(): Lang {
  if (typeof window === "undefined") return "fr";
  const s = window.localStorage.getItem(STORAGE_KEY);
  return s === "ar" || s === "fr" ? s : "fr";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  useEffect(() => {
    if (typeof document === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // Sync across tabs / pages
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "fr" || e.newValue === "ar")) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const t = (key: string) => DICT[key]?.[lang] ?? key;

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang: setLangState,
        t,
        dir: lang === "ar" ? "rtl" : "ltr",
        isAr: lang === "ar",
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
