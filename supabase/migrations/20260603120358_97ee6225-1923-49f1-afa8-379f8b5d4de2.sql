CREATE OR REPLACE FUNCTION public.list_accepted_labs()
RETURNS TABLE(id uuid, nom_fr text, nom_ar text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, l.nom_fr, l.nom_ar
  FROM public.laboratoires l
  JOIN public.profiles p ON p.id = l.directeur_id
  WHERE p.statut = 'accepte'
  ORDER BY l.nom_fr;
$$;

GRANT EXECUTE ON FUNCTION public.list_accepted_labs() TO anon, authenticated;