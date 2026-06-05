-- 1) Update handle_new_user: directors -> en_attente_admin, others -> en_attente
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
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'membre');
  v_statut := CASE WHEN v_role = 'directeur' THEN 'en_attente_admin' ELSE 'en_attente' END;

  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nom',
    NEW.raw_user_meta_data->>'prenom',
    v_role,
    v_statut
  )
  ON CONFLICT (id) DO NOTHING;

  v_lab_name := NULLIF(trim(COALESCE(
    NEW.raw_user_meta_data->>'laboratoire_fr',
    NEW.raw_user_meta_data->>'laboratoire'
  )), '');

  IF v_lab_name IS NOT NULL THEN
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
        UPDATE public.laboratoires
        SET directeur_id = COALESCE(directeur_id, NEW.id),
            nom_ar = COALESCE(nom_ar, v_lab_ar),
            faculte = COALESCE(faculte, v_faculte),
            date_creation = COALESCE(date_creation, v_date_creation)
        WHERE id = v_lab_id;
      END IF;
    ELSE
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

-- 2) Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Directors pending list, dynamique pour l'Admin (basé sur le rôle, pas d'email codé en dur)
CREATE OR REPLACE FUNCTION public.pending_directeurs_for_admin()
 RETURNS TABLE(id uuid, nom text, prenom text, email text, role text, statut text, created_at timestamp with time zone, laboratoire text, faculte text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.id, p.nom, p.prenom, p.email, p.role, p.statut, p.created_at,
    COALESCE(u.raw_user_meta_data->>'laboratoire_fr', u.raw_user_meta_data->>'laboratoire') AS laboratoire,
    u.raw_user_meta_data->>'faculte' AS faculte
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.role = 'directeur'
    AND COALESCE(p.statut, 'en_attente_admin') = 'en_attente_admin'
  ORDER BY p.created_at DESC;
$function$;

-- 4) Filter directeurs out of director-lab pending list
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
    AND COALESCE(p.role, '') <> 'directeur'
    AND (
      lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire', ''))) = lower(trim(p_lab))
      OR lower(trim(COALESCE(u.raw_user_meta_data->>'laboratoire_fr', ''))) = lower(trim(p_lab))
    )
  ORDER BY p.created_at DESC;
$function$;

-- 5) Backfill: existing directeurs en_attente -> en_attente_admin
UPDATE public.profiles
SET statut = 'en_attente_admin'
WHERE role = 'directeur' AND statut = 'en_attente';