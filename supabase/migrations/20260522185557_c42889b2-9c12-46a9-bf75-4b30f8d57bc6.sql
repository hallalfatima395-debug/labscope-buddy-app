ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON TABLE public.profiles TO anon;
GRANT INSERT ON TABLE public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anon can insert profile during signup" ON public.profiles;
CREATE POLICY "Anon can insert profile during signup"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (true);