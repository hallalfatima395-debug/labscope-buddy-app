
CREATE OR REPLACE FUNCTION public.pending_requests_for_lab(p_lab text)
RETURNS TABLE (
  id uuid,
  nom text,
  prenom text,
  email text,
  role text,
  statut text,
  created_at timestamptz,
  laboratoire text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.nom,
    p.prenom,
    p.email,
    p.role,
    p.statut,
    p.created_at,
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

GRANT EXECUTE ON FUNCTION public.pending_requests_for_lab(text) TO authenticated;
