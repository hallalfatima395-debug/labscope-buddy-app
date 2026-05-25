CREATE POLICY "Anon can read laboratoires for signup"
ON public.laboratoires
FOR SELECT
TO anon
USING (true);