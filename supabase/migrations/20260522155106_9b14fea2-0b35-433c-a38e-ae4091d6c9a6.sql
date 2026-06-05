
-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nom',
    NEW.raw_user_meta_data->>'prenom',
    COALESCE(NEW.raw_user_meta_data->>'role', 'membre'),
    'en_attente'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Attach validation triggers
DROP TRIGGER IF EXISTS enforce_max_equipes ON public.equipes;
CREATE TRIGGER enforce_max_equipes
  BEFORE INSERT ON public.equipes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_max_equipes();

DROP TRIGGER IF EXISTS enforce_one_lab_per_membre ON public.membres;
CREATE TRIGGER enforce_one_lab_per_membre
  BEFORE INSERT OR UPDATE ON public.membres
  FOR EACH ROW
  EXECUTE FUNCTION public.check_one_lab_per_membre();
