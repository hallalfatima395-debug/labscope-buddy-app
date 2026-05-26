CREATE OR REPLACE FUNCTION public.team_enseignants(p_equipe_id uuid)
RETURNS TABLE(id uuid, nom text, prenom text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.nom, p.prenom
  FROM public.profiles p
  JOIN public.membres m ON m.profile_id = p.id
  WHERE m.equipe_id = p_equipe_id
    AND p.role = 'enseignant'
    AND COALESCE(p.statut, '') IN ('accepte', 'valide')
    AND EXISTS (
      SELECT 1 FROM public.membres me
      WHERE me.profile_id = auth.uid() AND me.equipe_id = p_equipe_id
    );
$$;

GRANT EXECUTE ON FUNCTION public.team_enseignants(uuid) TO authenticated;