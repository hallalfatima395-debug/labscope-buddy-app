import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface DirecteurLab {
  id: string;
  nom_fr: string;
  nom_ar: string | null;
  faculte: string | null;
}

export function useDirecteurLab() {
  const { profile } = useAuth();
  const [lab, setLab] = useState<DirecteurLab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    void (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("laboratoires")
        .select("id, nom_fr, nom_ar, faculte")
        .eq("directeur_id", profile.id)
        .maybeSingle();
      setLab((data as DirecteurLab) ?? null);
      setLoading(false);
    })();
  }, [profile?.id]);

  return { lab, loading };
}