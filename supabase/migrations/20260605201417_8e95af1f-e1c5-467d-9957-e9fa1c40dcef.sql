GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_directeur(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_lab(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_membre(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_directeur_of_profile_lab(uuid, uuid) TO authenticated;