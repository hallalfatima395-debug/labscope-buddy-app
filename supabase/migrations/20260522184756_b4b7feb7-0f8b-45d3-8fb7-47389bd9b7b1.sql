-- Ensure trigger exists to auto-create profile on signup (runs as SECURITY DEFINER, bypasses RLS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate INSERT policy to allow authenticated users to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow anon role to insert during signup flow (id must match the new user)
DROP POLICY IF EXISTS "Anon can insert profile during signup" ON public.profiles;
CREATE POLICY "Anon can insert profile during signup"
  ON public.profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);
