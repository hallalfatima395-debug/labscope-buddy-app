
-- ============================================================
-- SYNCHRONISATION COMPLÈTE DE LA BASE LABSCOPE
-- Idempotent : peut être rejoué sans casser l'existant
-- ============================================================

-- ---------- TABLES ----------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  nom text,
  prenom text,
  role text,
  statut text DEFAULT 'en_attente',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.laboratoires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_fr text NOT NULL,
  nom_ar text,
  faculte text,
  date_creation date,
  directeur_id uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  laboratoire_id uuid NOT NULL REFERENCES public.laboratoires(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.membres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  laboratoire_id uuid REFERENCES public.laboratoires(id) ON DELETE SET NULL,
  equipe_id uuid REFERENCES public.equipes(id) ON DELETE SET NULL,
  grade text,
  specialite text,
  sujet_these text,
  directeur_these text,
  date_debut_these date,
  statut_these text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text,
  date_debut date,
  date_fin date,
  laboratoire_id uuid REFERENCES public.laboratoires(id) ON DELETE CASCADE,
  equipe_id uuid REFERENCES public.equipes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  auteurs text,
  annee integer,
  type text,
  membre_id uuid REFERENCES public.membres(id) ON DELETE SET NULL,
  laboratoire_id uuid REFERENCES public.laboratoires(id) ON DELETE CASCADE,
  equipe_id uuid REFERENCES public.equipes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bilans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id uuid NOT NULL REFERENCES public.membres(id) ON DELETE CASCADE,
  annee integer NOT NULL,
  activites text,
  encadrements text,
  communications text,
  projets text,
  publications_annee text,
  avancement_these text,
  is_submitted boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- RLS ENABLE ----------
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratoires     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membres          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bilans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ---------- FONCTIONS ----------

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin')
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nom',
    NEW.raw_user_meta_data->>'prenom',
    COALESCE(NEW.raw_user_meta_data->>'role', 'membre'),
    'en_attente'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_max_equipes()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF (SELECT count(*) FROM public.equipes WHERE laboratoire_id = NEW.laboratoire_id) >= 4 THEN
    RAISE EXCEPTION 'Un laboratoire ne peut avoir plus de 4 équipes';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_one_lab_per_membre()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.has_existing_lab_request(p_email text, p_lab text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    WHERE lower(u.email) = lower(p_email)
      AND COALESCE(p.statut, 'en_attente') IN ('en_attente', 'accepte')
      AND (
        lower(COALESCE(u.raw_user_meta_data->>'laboratoire', '')) = lower(p_lab)
        OR lower(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', '')) = lower(p_lab)
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.pending_requests_for_lab(p_lab text)
RETURNS TABLE(id uuid, nom text, prenom text, email text, role text, statut text, created_at timestamptz, laboratoire text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.nom, p.prenom, p.email, p.role, p.statut, p.created_at,
    COALESCE(u.raw_user_meta_data->>'laboratoire', u.raw_user_meta_data->>'laboratoire_fr') AS laboratoire
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE COALESCE(p.statut, 'en_attente') = 'en_attente'
    AND (
      lower(COALESCE(u.raw_user_meta_data->>'laboratoire', '')) = lower(p_lab)
      OR lower(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', '')) = lower(p_lab)
    )
  ORDER BY p.created_at DESC;
$$;

-- ---------- TRIGGERS ----------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS trg_check_max_equipes ON public.equipes;
CREATE TRIGGER trg_check_max_equipes
  BEFORE INSERT ON public.equipes
  FOR EACH ROW EXECUTE FUNCTION public.check_max_equipes();

DROP TRIGGER IF EXISTS trg_check_one_lab_per_membre ON public.membres;
CREATE TRIGGER trg_check_one_lab_per_membre
  BEFORE INSERT OR UPDATE ON public.membres
  FOR EACH ROW EXECUTE FUNCTION public.check_one_lab_per_membre();

-- ---------- POLICIES : PROFILES ----------
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anon can insert profile during signup" ON public.profiles;
CREATE POLICY "Anon can insert profile during signup" ON public.profiles
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

GRANT INSERT ON public.profiles TO anon, authenticated;

-- ---------- POLICIES : helper macro pattern for other tables ----------
-- (read + write for authenticated)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['laboratoires','equipes','membres','projets','publications','bilans']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth read %1$s" ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY "auth read %1$s" ON public.%1$s FOR SELECT TO authenticated USING (true);', t);
    EXECUTE format('DROP POLICY IF EXISTS "auth write %1$s" ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY "auth write %1$s" ON public.%1$s FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- ---------- POLICIES : CONTACT MESSAGES ----------
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can read contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can update contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (true);
