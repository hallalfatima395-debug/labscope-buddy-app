
-- Helper: check if a given user is the directeur of the lab matching a profile's signup metadata
CREATE OR REPLACE FUNCTION public.is_directeur_of_profile_lab(_directeur_id uuid, _profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.laboratoires l
      ON lower(trim(l.nom_fr)) = lower(trim(COALESCE(
           u.raw_user_meta_data->>'laboratoire_fr',
           u.raw_user_meta_data->>'laboratoire'
         )))
    JOIN public.profiles dp ON dp.id = _directeur_id
    WHERE u.id = _profile_id
      AND dp.role = 'directeur'
      AND l.directeur_id = _directeur_id
  );
$$;

DROP POLICY IF EXISTS "Directeurs can update profiles in their lab" ON public.profiles;
CREATE POLICY "Directeurs can update profiles in their lab"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_directeur_of_profile_lab(auth.uid(), id))
WITH CHECK (public.is_directeur_of_profile_lab(auth.uid(), id));
