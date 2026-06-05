CREATE OR REPLACE FUNCTION public.list_doctorants_by_lab(p_lab_id uuid)
RETURNS TABLE(id uuid, nom text, prenom text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.nom, p.prenom
  FROM public.profiles p
  JOIN public.membres m ON m.profile_id = p.id
  WHERE m.laboratoire_id = p_lab_id
    AND p.role = 'doctorant'
    AND p.statut IN ('accepte', 'valide')
  ORDER BY p.nom, p.prenom;
$$;

GRANT EXECUTE ON FUNCTION public.list_doctorants_by_lab(uuid) TO authenticated;