import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface MembreRow {
  id: string;
  profile_id: string;
  laboratoire_id: string | null;
  equipe_id: string | null;
  grade: string | null;
  specialite: string | null;
  sujet_these: string | null;
  directeur_these: string | null;
  date_debut_these: string | null;
  statut_these: string | null;
}

export interface LabLite { id: string; nom_fr: string }

export function useMembre() {
  const { profile } = useAuth();
  const [membre, setMembre] = useState<MembreRow | null>(null);
  const [lab, setLab] = useState<LabLite | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from("membres")
      .select("id, profile_id, laboratoire_id, equipe_id, grade, specialite, sujet_these, directeur_these, date_debut_these, statut_these")
      .eq("profile_id", profile.id)
      .maybeSingle();
    const m = (data as MembreRow) ?? null;
    setMembre(m);
    if (m?.laboratoire_id) {
      const { data: l } = await supabase.from("laboratoires").select("id, nom_fr").eq("id", m.laboratoire_id).maybeSingle();
      setLab((l as LabLite) ?? null);
    } else {
      setLab(null);
    }
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { void reload(); }, [reload]);

  return { membre, lab, loading, reload };
}