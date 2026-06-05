
-- LABORATOIRES
CREATE TABLE public.laboratoires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_fr TEXT NOT NULL,
  nom_ar TEXT,
  faculte TEXT,
  date_creation DATE,
  directeur_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.laboratoires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read laboratoires" ON public.laboratoires FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write laboratoires" ON public.laboratoires FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EQUIPES
CREATE TABLE public.equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  laboratoire_id UUID NOT NULL REFERENCES public.laboratoires(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read equipes" ON public.equipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write equipes" ON public.equipes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger: max 4 equipes per laboratoire
CREATE OR REPLACE FUNCTION public.check_max_equipes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF (SELECT count(*) FROM public.equipes WHERE laboratoire_id = NEW.laboratoire_id) >= 4 THEN
    RAISE EXCEPTION 'Un laboratoire ne peut avoir plus de 4 équipes';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_max_equipes
BEFORE INSERT ON public.equipes
FOR EACH ROW EXECUTE FUNCTION public.check_max_equipes();

-- MEMBRES
CREATE TABLE public.membres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  laboratoire_id UUID REFERENCES public.laboratoires(id) ON DELETE SET NULL,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE SET NULL,
  grade TEXT,
  specialite TEXT,
  sujet_these TEXT,
  directeur_these TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.membres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read membres" ON public.membres FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write membres" ON public.membres FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger: one membre per laboratoire only (a profile can belong to a single lab)
CREATE OR REPLACE FUNCTION public.check_one_lab_per_membre()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.laboratoire_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.membres
    WHERE profile_id = NEW.profile_id
      AND laboratoire_id IS NOT NULL
      AND laboratoire_id <> NEW.laboratoire_id
      AND id <> NEW.id
  ) THEN
    RAISE EXCEPTION 'Un membre ne peut appartenir qu''à un seul laboratoire';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_one_lab_per_membre
BEFORE INSERT OR UPDATE ON public.membres
FOR EACH ROW EXECUTE FUNCTION public.check_one_lab_per_membre();

-- PROJETS
CREATE TABLE public.projets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  date_debut DATE,
  date_fin DATE,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE SET NULL,
  laboratoire_id UUID REFERENCES public.laboratoires(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read projets" ON public.projets FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write projets" ON public.projets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PUBLICATIONS
CREATE TABLE public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  auteurs TEXT,
  annee INTEGER,
  type TEXT,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE SET NULL,
  laboratoire_id UUID REFERENCES public.laboratoires(id) ON DELETE SET NULL,
  membre_id UUID REFERENCES public.membres(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read publications" ON public.publications FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write publications" ON public.publications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- BILANS
CREATE TABLE public.bilans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id UUID NOT NULL REFERENCES public.membres(id) ON DELETE CASCADE,
  annee INTEGER NOT NULL,
  activites TEXT,
  publications_annee TEXT,
  projets TEXT,
  communications TEXT,
  encadrements TEXT,
  is_submitted BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bilans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read bilans" ON public.bilans FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write bilans" ON public.bilans FOR ALL TO authenticated USING (true) WITH CHECK (true);
