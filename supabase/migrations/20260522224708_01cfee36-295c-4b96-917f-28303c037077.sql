-- Updated handle_new_user: auto-create laboratoire row if missing, link directeur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role text;
  v_lab_name text;
  v_lab_ar text;
  v_faculte text;
  v_date_creation date;
  v_lab_id uuid;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'membre');

  -- Insert profile
  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nom',
    NEW.raw_user_meta_data->>'prenom',
    v_role,
    'en_attente'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Determine lab name from metadata
  v_lab_name := NULLIF(trim(COALESCE(
    NEW.raw_user_meta_data->>'laboratoire_fr',
    NEW.raw_user_meta_data->>'laboratoire'
  )), '');

  IF v_lab_name IS NOT NULL THEN
    -- Try to find an existing lab (case-insensitive, trimmed)
    SELECT id INTO v_lab_id
    FROM public.laboratoires
    WHERE lower(trim(nom_fr)) = lower(v_lab_name)
    LIMIT 1;

    IF v_role = 'directeur' THEN
      v_lab_ar := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'laboratoire_ar', '')), '');
      v_faculte := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'faculte', '')), '');
      BEGIN
        v_date_creation := (NEW.raw_user_meta_data->>'date_creation')::date;
      EXCEPTION WHEN OTHERS THEN
        v_date_creation := NULL;
      END;

      IF v_lab_id IS NULL THEN
        INSERT INTO public.laboratoires (nom_fr, nom_ar, faculte, date_creation, directeur_id)
        VALUES (v_lab_name, v_lab_ar, v_faculte, v_date_creation, NEW.id)
        RETURNING id INTO v_lab_id;
      ELSE
        -- Attach directeur if not yet assigned
        UPDATE public.laboratoires
        SET directeur_id = COALESCE(directeur_id, NEW.id),
            nom_ar = COALESCE(nom_ar, v_lab_ar),
            faculte = COALESCE(faculte, v_faculte),
            date_creation = COALESCE(date_creation, v_date_creation)
        WHERE id = v_lab_id;
      END IF;
    ELSE
      -- Enseignant / doctorant: create lab shell if missing so the request is visible
      IF v_lab_id IS NULL THEN
        INSERT INTO public.laboratoires (nom_fr)
        VALUES (v_lab_name)
        RETURNING id INTO v_lab_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Make matching robust to trimming as well
CREATE OR REPLACE FUNCTION public.pending_requests_for_lab(p_lab text)
RETURNS TABLE(id uuid, nom text, prenom text, email text, role text, statut text, created_at timestamp with time zone, laboratoire text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.id, p.nom, p.prenom, p.email, p.role, p.statut, p.created_at,
    COALESCE(u.raw_user_meta_data->>'laboratoire', u.raw_user_meta_data->>'laboratoire_fr') AS laboratoire
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE COALESCE(p.statut, 'en_attente') = 'en_attente'
    AND (
      lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire', ''))) = lower(trim(p_lab))
      OR lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', ''))) = lower(trim(p_lab))
    )
  ORDER BY p.created_at DESC;
$function$;

-- Backfill: create missing laboratoires from existing auth.users metadata
INSERT INTO public.laboratoires (nom_fr)
SELECT DISTINCT trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', u.raw_user_meta_data->>'laboratoire'))
FROM auth.users u
WHERE NULLIF(trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', u.raw_user_meta_data->>'laboratoire', '')), '') IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.laboratoires l
    WHERE lower(trim(l.nom_fr)) = lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', u.raw_user_meta_data->>'laboratoire')))
  );

-- Backfill: attach directeurs to their lab when missing
UPDATE public.laboratoires l
SET directeur_id = u.id
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE p.role = 'directeur'
  AND l.directeur_id IS NULL
  AND lower(trim(l.nom_fr)) = lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', u.raw_user_meta_data->>'laboratoire', '')));
