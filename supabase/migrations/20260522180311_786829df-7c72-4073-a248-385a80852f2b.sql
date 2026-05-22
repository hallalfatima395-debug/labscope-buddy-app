
CREATE OR REPLACE FUNCTION public.has_existing_lab_request(p_email text, p_lab text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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

GRANT EXECUTE ON FUNCTION public.has_existing_lab_request(text, text) TO anon, authenticated;
