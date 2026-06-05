
-- 1. Whitelist roles on signup (prevent admin injection)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role text;
  v_statut text;
  v_lab_name text;
  v_lab_ar text;
  v_faculte text;
  v_date_creation date;
  v_lab_id uuid;
  v_lab_id_from_meta uuid;
  v_grade text;
  v_specialite text;
  v_sujet text;
  v_dir_these text;
BEGIN
  -- Whitelist self-signup roles; admin can NEVER be self-assigned
  v_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' IN ('enseignant','doctorant','directeur')
      THEN NEW.raw_user_meta_data->>'role'
    ELSE 'enseignant'
  END;
  v_statut := CASE WHEN v_role = 'directeur' THEN 'en_attente_admin' ELSE 'en_attente' END;

  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nom', NEW.raw_user_meta_data->>'prenom', v_role, v_statut)
  ON CONFLICT (id) DO NOTHING;

  BEGIN
    v_lab_id_from_meta := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire_id', '')), '')::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_lab_id_from_meta := NULL;
  END;

  IF v_lab_id_from_meta IS NOT NULL THEN
    SELECT id INTO v_lab_id FROM public.laboratoires WHERE id = v_lab_id_from_meta;
    v_lab_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire', '')), '');
  ELSE
    v_lab_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire_fr', NEW.raw_user_meta_data->>'laboratoire')), '');
    IF v_lab_name IS NOT NULL THEN
      SELECT id INTO v_lab_id FROM public.laboratoires WHERE lower(trim(nom_fr)) = lower(v_lab_name) LIMIT 1;
    END IF;
  END IF;

  IF v_lab_id IS NULL AND v_lab_name IS NOT NULL AND v_role = 'directeur' THEN
    v_lab_ar := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire_ar', '')), '');
    v_faculte := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'faculte', '')), '');
    BEGIN v_date_creation := (NEW.raw_user_meta_data->>'date_creation')::date;
    EXCEPTION WHEN OTHERS THEN v_date_creation := NULL; END;
    INSERT INTO public.laboratoires (nom_fr, nom_ar, faculte, date_creation, directeur_id)
    VALUES (v_lab_name, v_lab_ar, v_faculte, v_date_creation, NEW.id)
    RETURNING id INTO v_lab_id;
  ELSIF v_lab_id IS NOT NULL AND v_role = 'directeur' THEN
    v_lab_ar := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire_ar', '')), '');
    v_faculte := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'faculte', '')), '');
    BEGIN v_date_creation := (NEW.raw_user_meta_data->>'date_creation')::date;
    EXCEPTION WHEN OTHERS THEN v_date_creation := NULL; END;
    UPDATE public.laboratoires
    SET directeur_id = COALESCE(directeur_id, NEW.id),
        nom_ar = COALESCE(nom_ar, v_lab_ar),
        faculte = COALESCE(faculte, v_faculte),
        date_creation = COALESCE(date_creation, v_date_creation)
    WHERE id = v_lab_id;
  END IF;

  IF v_role IN ('enseignant', 'doctorant') THEN
    v_grade := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'grade', '')), '');
    v_specialite := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'specialite', '')), '');
    v_sujet := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'sujet_these', '')), '');
    v_dir_these := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'directeur_these', '')), '');

    INSERT INTO public.membres (profile_id, laboratoire_id, grade, specialite, sujet_these, directeur_these)
    VALUES (NEW.id, v_lab_id, v_grade, v_specialite, v_sujet, v_dir_these)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2. Lock down self-managed membres: split ALL into INSERT/DELETE, restrict UPDATE
DROP POLICY IF EXISTS "Users manage own membre" ON public.membres;

CREATE POLICY "Users insert own membre"
  ON public.membres FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users delete own membre"
  ON public.membres FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- Self-update allowed ONLY when laboratoire_id and equipe_id are unchanged
CREATE POLICY "Users update own membre non-assignment fields"
  ON public.membres FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (
    profile_id = auth.uid()
    AND laboratoire_id IS NOT DISTINCT FROM (SELECT m.laboratoire_id FROM public.membres m WHERE m.id = membres.id)
    AND equipe_id IS NOT DISTINCT FROM (SELECT m.equipe_id FROM public.membres m WHERE m.id = membres.id)
  );

-- 3. Publications: prevent unscoped inserts (membre_id IS NULL AND laboratoire_id IS NULL bypass)
CREATE POLICY "Publications must be scoped"
  ON public.publications FOR INSERT TO authenticated
  WITH CHECK (
    is_admin(auth.uid())
    OR (laboratoire_id IS NOT NULL AND is_directeur_of_lab(auth.uid(), laboratoire_id))
    OR (membre_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.membres m
      WHERE m.id = publications.membre_id AND m.profile_id = auth.uid()
    ))
  );
