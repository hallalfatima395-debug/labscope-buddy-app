import { useLang } from "@/hooks/use-lang";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`flex items-center rounded-full border p-0.5 text-xs font-semibold ${className}`}
      style={{ borderColor: "rgba(15,23,42,0.18)", backgroundColor: "#FFFFFF" }}
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className="rounded-full px-3 py-1 transition"
        style={lang === "fr" ? { backgroundColor: "#0D9488", color: "#FFFFFF" } : { color: "#1E293B" }}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className="rounded-full px-3 py-1 transition"
        style={lang === "ar" ? { backgroundColor: "#0D9488", color: "#FFFFFF" } : { color: "#1E293B" }}
        aria-pressed={lang === "ar"}
      >
        AR
      </button>
    </div>
  );
}
