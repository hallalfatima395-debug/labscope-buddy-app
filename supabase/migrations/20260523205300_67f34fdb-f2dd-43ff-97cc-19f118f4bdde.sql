
-- ============ Helper functions ============
CREATE OR REPLACE FUNCTION public.is_directeur(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'directeur')
$$;

CREATE OR REPLACE FUNCTION public.is_directeur_of_membre(_user_id uuid, _membre_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.membres m
    JOIN public.laboratoires l ON l.id = m.laboratoire_id
    WHERE m.id = _membre_id AND l.directeur_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_directeur_of_lab(_user_id uuid, _lab_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.laboratoires WHERE id = _lab_id AND directeur_id = _user_id)
$$;

-- ============ PROFILES ============
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs can view profiles in their lab"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_directeur_of_profile_lab(auth.uid(), id));

CREATE POLICY "Users can update own profile non-sensitive"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger to prevent role / statut escalation by non-admins
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF public.is_directeur_of_profile_lab(auth.uid(), NEW.id) THEN
    -- directeur can change statut but not role
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Not allowed to change role';
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role OR NEW.statut IS DISTINCT FROM OLD.statut THEN
    RAISE EXCEPTION 'Not allowed to change role or statut';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- ============ CONTACT MESSAGES ============
DROP POLICY IF EXISTS "Authenticated can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated can delete contact messages" ON public.contact_messages;

CREATE POLICY "Admins can read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- ============ LABORATOIRES ============
DROP POLICY IF EXISTS "auth write laboratoires" ON public.laboratoires;

CREATE POLICY "Admins can write laboratoires"
ON public.laboratoires FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs can update own lab"
ON public.laboratoires FOR UPDATE TO authenticated
USING (directeur_id = auth.uid())
WITH CHECK (directeur_id = auth.uid());

-- ============ EQUIPES ============
DROP POLICY IF EXISTS "auth write equipes" ON public.equipes;

CREATE POLICY "Admins manage equipes"
ON public.equipes FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs manage equipes of own lab"
ON public.equipes FOR ALL TO authenticated
USING (public.is_directeur_of_lab(auth.uid(), laboratoire_id))
WITH CHECK (public.is_directeur_of_lab(auth.uid(), laboratoire_id));

-- ============ MEMBRES ============
DROP POLICY IF EXISTS "auth write membres" ON public.membres;

CREATE POLICY "Admins manage membres"
ON public.membres FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs manage membres of own lab"
ON public.membres FOR ALL TO authenticated
USING (laboratoire_id IS NOT NULL AND public.is_directeur_of_lab(auth.uid(), laboratoire_id))
WITH CHECK (laboratoire_id IS NULL OR public.is_directeur_of_lab(auth.uid(), laboratoire_id));

CREATE POLICY "Users manage own membre"
ON public.membres FOR ALL TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============ PROJETS ============
DROP POLICY IF EXISTS "auth write projets" ON public.projets;

CREATE POLICY "Admins manage projets"
ON public.projets FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs manage projets of own lab"
ON public.projets FOR ALL TO authenticated
USING (laboratoire_id IS NOT NULL AND public.is_directeur_of_lab(auth.uid(), laboratoire_id))
WITH CHECK (laboratoire_id IS NOT NULL AND public.is_directeur_of_lab(auth.uid(), laboratoire_id));

-- ============ PUBLICATIONS ============
DROP POLICY IF EXISTS "auth write publications" ON public.publications;

CREATE POLICY "Admins manage publications"
ON public.publications FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs manage publications of own lab"
ON public.publications FOR ALL TO authenticated
USING (laboratoire_id IS NOT NULL AND public.is_directeur_of_lab(auth.uid(), laboratoire_id))
WITH CHECK (laboratoire_id IS NOT NULL AND public.is_directeur_of_lab(auth.uid(), laboratoire_id));

CREATE POLICY "Members manage own publications"
ON public.publications FOR ALL TO authenticated
USING (membre_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.membres m WHERE m.id = membre_id AND m.profile_id = auth.uid()))
WITH CHECK (membre_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.membres m WHERE m.id = membre_id AND m.profile_id = auth.uid()));

-- ============ BILANS ============
DROP POLICY IF EXISTS "auth read bilans" ON public.bilans;
DROP POLICY IF EXISTS "auth write bilans" ON public.bilans;

CREATE POLICY "Members read own bilans"
ON public.bilans FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.membres m WHERE m.id = membre_id AND m.profile_id = auth.uid()));

CREATE POLICY "Admins read all bilans"
ON public.bilans FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Directeurs read bilans of own lab members"
ON public.bilans FOR SELECT TO authenticated
USING (public.is_directeur_of_membre(auth.uid(), membre_id));

CREATE POLICY "Members manage own bilans"
ON public.bilans FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.membres m WHERE m.id = membre_id AND m.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.membres m WHERE m.id = membre_id AND m.profile_id = auth.uid()));

CREATE POLICY "Admins manage bilans"
ON public.bilans FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============ REALTIME ============
-- Postgres_changes respect RLS so tightening SELECT already limits broadcasts.
-- Block broadcast/presence channels on realtime.messages for non-admins.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='realtime' AND tablename='messages') THEN
    EXECUTE 'ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Only admins access realtime topics" ON realtime.messages';
    EXECUTE 'CREATE POLICY "Only admins access realtime topics" ON realtime.messages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()))';
  END IF;
END $$;

-- ============ Lock SECURITY DEFINER function execution ============
REVOKE EXECUTE ON FUNCTION public.pending_directeurs_for_admin() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.pending_directeurs_for_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.pending_requests_for_lab(text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.pending_requests_for_lab(text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_existing_lab_request(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_existing_lab_request(text, text) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_directeur_of_profile_lab(uuid, uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_profile_lab(uuid, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_directeur(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_directeur(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_directeur_of_membre(uuid, uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_membre(uuid, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_directeur_of_lab(uuid, uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_lab(uuid, uuid) TO authenticated;
