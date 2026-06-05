ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_statut_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_statut_check
  CHECK (statut IN ('en_attente', 'en_attente_admin', 'accepte', 'refuse'));