-- 1) Privilege escalation fix
DROP POLICY IF EXISTS "Users can update own profile non-sensitive" ON public.profiles;
CREATE POLICY "Users can update own profile non-sensitive"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (nom, prenom, email) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 2) is_directeur_of_profile_lab via membres (not auth metadata)
CREATE OR REPLACE FUNCTION public.is_directeur_of_profile_lab(_directeur_id uuid, _profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.membres m
    JOIN public.laboratoires l ON l.id = m.laboratoire_id
    WHERE m.profile_id = _profile_id AND l.directeur_id = _directeur_id
  );
$$;

-- 3) Remove sensitive tables from realtime
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.contact_messages; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 4) Tighten always-true INSERT policies
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (
  length(nom) BETWEEN 1 AND 100
  AND length(prenom) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(message) BETWEEN 1 AND 5000
);

DROP POLICY IF EXISTS "Anon can insert profile during signup" ON public.profiles;

-- 5) Revoke EXECUTE on internal SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_directeur(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_directeur_of_lab(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_directeur_of_membre(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_directeur_of_profile_lab(uuid, uuid) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.pending_directeurs_for_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.pending_requests_for_lab(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_doctorants_by_lab(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_enseignants_by_lab(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.team_enseignants(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_lab_directeur(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_membres_by_equipe(uuid) FROM PUBLIC, anon;