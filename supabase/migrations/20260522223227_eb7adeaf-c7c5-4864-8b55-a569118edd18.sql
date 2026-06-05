-- Ensure trigger exists on auth.users to auto-create a profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill: create profiles for any auth.users missing one
INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'nom',
  u.raw_user_meta_data->>'prenom',
  COALESCE(u.raw_user_meta_data->>'role', 'membre'),
  'en_attente'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;