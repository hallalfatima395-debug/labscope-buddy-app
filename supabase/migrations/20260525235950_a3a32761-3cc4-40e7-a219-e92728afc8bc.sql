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
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'membre');
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

  -- Create membres row for researchers so profile page shows grade/specialite/lab immediately
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