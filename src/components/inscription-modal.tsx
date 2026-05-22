import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, dashboardPathForRole, type Profile } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, BookOpen, Building2, ArrowLeft, FlaskConical } from "lucide-react";
import { toast } from "sonner";

type SignupRole = "enseignant" | "doctorant" | "directeur";

const FACULTES = [
  "Faculté des Sciences Exactes",
  "Faculté des Sciences de la Nature et de la Vie",
  "Faculté de Technologie",
  "Faculté de Génie Électrique",
  "Faculté des Lettres, Langues et Arts",
  "Faculté des Sciences Humaines et Sociales",
  "Faculté de Droit et des Sciences Politiques",
  "Faculté des Sciences Économiques, Commerciales et de Gestion",
  "Faculté de Médecine",
];

const GRADES_ENS = ["MAB", "MAA", "MCB", "MCA", "Professeur"] as const;
const GRADES_DIR = ["MCB", "MCA", "Professeur"] as const;

function ageFromDob(dob: string): number {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function InscriptionModal({ children, defaultTab = "inscription" }: { children: ReactNode; defaultTab?: "connexion" | "inscription" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"connexion" | "inscription">(defaultTab);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setTab(defaultTab); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        data-auth-modal
        className="max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0 border-0"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="flex items-center gap-4 px-6 py-5"
          style={{ backgroundColor: "#0F172A", color: "#FFFFFF" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "#2DD4BF" }}
          >
            <FlaskConical className="h-6 w-6" style={{ color: "#0F172A" }} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl font-semibold" style={{ color: "#FFFFFF" }}>LabScope</p>
            <p className="text-xs" style={{ color: "#5EEAD4" }}>Université Djillali Liabès — Sidi Bel Abbès</p>
          </div>
        </div>

        <div className="max-h-[calc(90vh-92px)] overflow-y-auto px-6 pb-6 pt-5" style={{ backgroundColor: "#FFFFFF" }}>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList
              className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0 h-auto"
              style={{ borderColor: "#E5E7EB" }}
            >
              <TabsTrigger
                value="connexion"
                className="rounded-none border-b-2 border-transparent bg-transparent py-3 text-sm font-semibold uppercase tracking-wide text-slate-500 data-[state=active]:border-[#0D9488] data-[state=active]:bg-transparent data-[state=active]:text-[#0D9488] data-[state=active]:shadow-none"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger
                value="inscription"
                className="rounded-none border-b-2 border-transparent bg-transparent py-3 text-sm font-semibold uppercase tracking-wide text-slate-500 data-[state=active]:border-[#0D9488] data-[state=active]:bg-transparent data-[state=active]:text-[#0D9488] data-[state=active]:shadow-none"
              >
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connexion" className="pt-5">
              <LoginForm
                onSuccess={(path) => {
                  setOpen(false);
                  void navigate({ to: path });
                }}
              />
            </TabsContent>

            <TabsContent value="inscription" className="pt-5">
              <InscriptionFlow onDone={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (path: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return toast.error(error?.message ?? "Identifiants invalides");
      const { data: prof } = await supabase
        .from("profiles").select("id, role, nom, prenom, email, statut").eq("id", data.user.id).maybeSingle();
      const p = prof as Profile | null;
      if (!p) { await supabase.auth.signOut(); return toast.error("Profil introuvable"); }
      if (p.statut === "en_attente") { await supabase.auth.signOut(); return toast.warning("Votre compte est en attente de validation"); }
      if (p.statut === "refuse") { await supabase.auth.signOut(); return toast.error("Votre compte a été refusé"); }
      toast.success("Connexion réussie");
      onSuccess(dashboardPathForRole(p.role));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lemail" className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#475569" }}>Email</Label>
        <Input id="lemail" type="email" required placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#0F172A" }} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lpw" className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#475569" }}>Mot de passe</Label>
        <Input id="lpw" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#0F172A" }} />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full py-6 text-sm font-semibold hover:opacity-90"
        disabled={busy}
        style={{ backgroundColor: "#2DD4BF", color: "#0F172A", borderColor: "#2DD4BF" }}
      >
        {busy ? "Connexion…" : "Se connecter →"}
      </Button>
    </form>
  );
}

function InscriptionFlow({ onDone }: { onDone: () => void }) {
  const [role, setRole] = useState<SignupRole | null>(null);

  if (!role) {
    return (
      <div className="space-y-3">
        <p className="text-sm" style={{ color: "#475569" }}>Choisissez votre profil :</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <RoleCard icon={<GraduationCap className="h-6 w-6" />} title="Enseignant-Chercheur" onClick={() => setRole("enseignant")} />
          <RoleCard icon={<BookOpen className="h-6 w-6" />} title="Doctorant" onClick={() => setRole("doctorant")} />
          <RoleCard icon={<Building2 className="h-6 w-6" />} title="Directeur de Labo" onClick={() => setRole("directeur")} />
        </div>
      </div>
    );
  }

  return <SignupForm role={role} onBack={() => setRole(null)} onDone={onDone} />;
}

function RoleCard({ icon, title, onClick }: { icon: ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition hover:shadow-md"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#0F172A" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
    >
      <span className="rounded-full p-2" style={{ backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488" }}>{icon}</span>
      <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{title}</span>
    </button>
  );
}

function SignupForm({ role, onBack, onDone }: { role: SignupRole; onBack: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    nom: "", prenom: "", email: "", dob: "", password: "", confirm: "",
    grade: "", specialite: "", laboratoire: "",
    sujet_these: "", directeur_these: "",
    lab_fr: "", lab_ar: "", faculte: "", date_creation: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.nom.trim() || !f.prenom.trim()) return toast.error("Nom et prénom requis");
    if (f.password.length < 8) return toast.error("Mot de passe : 8 caractères minimum");
    if (f.password !== f.confirm) return toast.error("Les mots de passe ne correspondent pas");
    if (!f.dob || ageFromDob(f.dob) < 18) return toast.error("Vous devez avoir au moins 18 ans");

    if (role === "enseignant" && (!f.grade || !f.specialite.trim() || !f.laboratoire.trim()))
      return toast.error("Tous les champs sont requis");
    if (role === "doctorant" && (!f.sujet_these.trim() || !f.directeur_these.trim() || !f.laboratoire.trim()))
      return toast.error("Tous les champs sont requis");
    if (role === "directeur" && (!f.lab_fr.trim() || !f.lab_ar.trim() || !f.faculte || !f.grade || !f.date_creation))
      return toast.error("Tous les champs sont requis");
    if (role === "directeur") {
      const y = new Date(f.date_creation).getFullYear();
      if (y < 1962 || y > 2024) return toast.error("Date de création : entre 1962 et 2024");
    }

    setBusy(true);
    try {
      const labName =
        role === "directeur" ? f.lab_fr.trim() : f.laboratoire.trim();
      if (labName) {
        const { data: exists, error: chkErr } = await supabase.rpc(
          "has_existing_lab_request" as never,
          { p_email: f.email, p_lab: labName } as never,
        );
        if (chkErr) return toast.error(chkErr.message);
        if (exists) return toast.error("Vous avez déjà soumis une demande pour ce laboratoire");
      }

      const meta: Record<string, unknown> = { nom: f.nom, prenom: f.prenom, role, date_naissance: f.dob };
      if (role === "enseignant") Object.assign(meta, { grade: f.grade, specialite: f.specialite, laboratoire: f.laboratoire });
      if (role === "doctorant") Object.assign(meta, { sujet_these: f.sujet_these, directeur_these: f.directeur_these, laboratoire: f.laboratoire });
      if (role === "directeur") Object.assign(meta, { laboratoire_fr: f.lab_fr, laboratoire_ar: f.lab_ar, faculte: f.faculte, grade: f.grade, date_creation: f.date_creation });

      const { data, error } = await supabase.auth.signUp({
        email: f.email,
        password: f.password,
        options: { emailRedirectTo: `${window.location.origin}/login`, data: meta },
      });
      if (error || !data.user) return toast.error(error?.message ?? "Inscription impossible");

      const { error: pErr } = await supabase.from("profiles").upsert({
        id: data.user.id, email: f.email, nom: f.nom, prenom: f.prenom, role, statut: "en_attente",
      });
      if (pErr) return toast.error(pErr.message);

      await supabase.auth.signOut();
      toast.success("Inscription réussie ! Veuillez attendre une notification d'acceptation.");
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "#0D9488" }}>
        <ArrowLeft className="h-3 w-3" /> Changer de profil
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nom"><Input required value={f.nom} onChange={set("nom")} /></Field>
        <Field label="Prénom"><Input required value={f.prenom} onChange={set("prenom")} /></Field>
        <Field label="Email"><Input type="email" required value={f.email} onChange={set("email")} /></Field>
        <Field label="Date de naissance">
          <Input type="date" required value={f.dob} onChange={set("dob")} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().slice(0, 10)} />
        </Field>
        <Field label="Mot de passe"><Input type="password" required value={f.password} onChange={set("password")} /></Field>
        <Field label="Confirmer mot de passe"><Input type="password" required value={f.confirm} onChange={set("confirm")} /></Field>
      </div>

      {role === "enseignant" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Grade">
            <Select value={f.grade} onValueChange={(v) => setF((p) => ({ ...p, grade: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir un grade" /></SelectTrigger>
              <SelectContent>{GRADES_ENS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Spécialité"><Input value={f.specialite} onChange={set("specialite")} /></Field>
          <Field label="Laboratoire de rattachement" className="sm:col-span-2"><Input value={f.laboratoire} onChange={set("laboratoire")} /></Field>
        </div>
      )}

      {role === "doctorant" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Sujet de thèse" className="sm:col-span-2"><Input value={f.sujet_these} onChange={set("sujet_these")} /></Field>
          <Field label="Directeur de thèse"><Input value={f.directeur_these} onChange={set("directeur_these")} /></Field>
          <Field label="Laboratoire de rattachement"><Input value={f.laboratoire} onChange={set("laboratoire")} /></Field>
        </div>
      )}

      {role === "directeur" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nom du laboratoire (FR)"><Input value={f.lab_fr} onChange={set("lab_fr")} /></Field>
          <Field label="اسم المختبر (AR)">
            <Input dir="rtl" lang="ar" className="font-arabic text-right" value={f.lab_ar} onChange={set("lab_ar")} />
          </Field>
          <Field label="Faculté">
            <Select value={f.faculte} onValueChange={(v) => setF((p) => ({ ...p, faculte: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir une faculté" /></SelectTrigger>
              <SelectContent>{FACULTES.map((fac) => <SelectItem key={fac} value={fac}>{fac}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Grade">
            <Select value={f.grade} onValueChange={(v) => setF((p) => ({ ...p, grade: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir un grade" /></SelectTrigger>
              <SelectContent>{GRADES_DIR.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Date de création du laboratoire" className="sm:col-span-2">
            <Input type="date" min="1962-01-01" max="2024-12-31" value={f.date_creation} onChange={set("date_creation")} />
          </Field>
        </div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full py-6 text-sm font-semibold hover:opacity-90"
        disabled={busy}
        style={{ backgroundColor: "#2DD4BF", color: "#0F172A", borderColor: "#2DD4BF" }}
      >
        {busy ? "Inscription…" : "S'inscrire →"}
      </Button>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#475569" }}>{label}</Label>
      {children}
    </div>
  );
}