ALTER TABLE public.membres
  ADD COLUMN IF NOT EXISTS date_debut_these date,
  ADD COLUMN IF NOT EXISTS statut_these text;