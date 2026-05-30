-- Add contributeurs column to projets
ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS contributeurs text;

-- RPC: list members of an équipe with display info + role
CREATE OR REPLACE FUNCTION public.list_membres_by_equipe(p_equipe_id uuid)
RETURNS TABLE(id uuid, nom text, prenom text, role text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, p.nom, p.prenom, p.role
  FROM public.membres m
  JOIN public.profiles p ON p.id = m.profile_id
  WHERE m.equipe_id = p_equipe_id
  ORDER BY p.nom, p.prenom
$$;

GRANT EXECUTE ON FUNCTION public.list_membres_by_equipe(uuid) TO authenticated;

-- RPC: get the lab directeur profile for a given lab
CREATE OR REPLACE FUNCTION public.get_lab_directeur(p_lab_id uuid)
RETURNS TABLE(id uuid, nom text, prenom text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.nom, p.prenom
  FROM public.laboratoires l
  JOIN public.profiles p ON p.id = l.directeur_id
  WHERE l.id = p_lab_id
$$;

GRANT EXECUTE ON FUNCTION public.get_lab_directeur(uuid) TO authenticated;