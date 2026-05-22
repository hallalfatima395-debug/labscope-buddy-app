export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bilans: {
        Row: {
          activites: string | null
          annee: number
          avancement_these: string | null
          communications: string | null
          created_at: string
          encadrements: string | null
          id: string
          is_submitted: boolean
          membre_id: string
          projets: string | null
          publications_annee: string | null
          submitted_at: string | null
        }
        Insert: {
          activites?: string | null
          annee: number
          avancement_these?: string | null
          communications?: string | null
          created_at?: string
          encadrements?: string | null
          id?: string
          is_submitted?: boolean
          membre_id: string
          projets?: string | null
          publications_annee?: string | null
          submitted_at?: string | null
        }
        Update: {
          activites?: string | null
          annee?: number
          avancement_these?: string | null
          communications?: string | null
          created_at?: string
          encadrements?: string | null
          id?: string
          is_submitted?: boolean
          membre_id?: string
          projets?: string | null
          publications_annee?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bilans_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "membres"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          nom: string
          prenom: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          nom: string
          prenom: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          nom?: string
          prenom?: string
        }
        Relationships: []
      }
      equipes: {
        Row: {
          created_at: string
          id: string
          laboratoire_id: string
          nom: string
        }
        Insert: {
          created_at?: string
          id?: string
          laboratoire_id: string
          nom: string
        }
        Update: {
          created_at?: string
          id?: string
          laboratoire_id?: string
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_laboratoire_id_fkey"
            columns: ["laboratoire_id"]
            isOneToOne: false
            referencedRelation: "laboratoires"
            referencedColumns: ["id"]
          },
        ]
      }
      laboratoires: {
        Row: {
          created_at: string
          date_creation: string | null
          directeur_id: string | null
          faculte: string | null
          id: string
          nom_ar: string | null
          nom_fr: string
        }
        Insert: {
          created_at?: string
          date_creation?: string | null
          directeur_id?: string | null
          faculte?: string | null
          id?: string
          nom_ar?: string | null
          nom_fr: string
        }
        Update: {
          created_at?: string
          date_creation?: string | null
          directeur_id?: string | null
          faculte?: string | null
          id?: string
          nom_ar?: string | null
          nom_fr?: string
        }
        Relationships: [
          {
            foreignKeyName: "laboratoires_directeur_id_fkey"
            columns: ["directeur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      membres: {
        Row: {
          created_at: string
          date_debut_these: string | null
          directeur_these: string | null
          equipe_id: string | null
          grade: string | null
          id: string
          laboratoire_id: string | null
          profile_id: string
          specialite: string | null
          statut_these: string | null
          sujet_these: string | null
        }
        Insert: {
          created_at?: string
          date_debut_these?: string | null
          directeur_these?: string | null
          equipe_id?: string | null
          grade?: string | null
          id?: string
          laboratoire_id?: string | null
          profile_id: string
          specialite?: string | null
          statut_these?: string | null
          sujet_these?: string | null
        }
        Update: {
          created_at?: string
          date_debut_these?: string | null
          directeur_these?: string | null
          equipe_id?: string | null
          grade?: string | null
          id?: string
          laboratoire_id?: string | null
          profile_id?: string
          specialite?: string | null
          statut_these?: string | null
          sujet_these?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membres_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membres_laboratoire_id_fkey"
            columns: ["laboratoire_id"]
            isOneToOne: false
            referencedRelation: "laboratoires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membres_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nom: string | null
          prenom: string | null
          role: string | null
          statut: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          statut?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          statut?: string | null
        }
        Relationships: []
      }
      projets: {
        Row: {
          created_at: string
          date_debut: string | null
          date_fin: string | null
          description: string | null
          equipe_id: string | null
          id: string
          laboratoire_id: string | null
          titre: string
        }
        Insert: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          equipe_id?: string | null
          id?: string
          laboratoire_id?: string | null
          titre: string
        }
        Update: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          equipe_id?: string | null
          id?: string
          laboratoire_id?: string | null
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "projets_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projets_laboratoire_id_fkey"
            columns: ["laboratoire_id"]
            isOneToOne: false
            referencedRelation: "laboratoires"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          annee: number | null
          auteurs: string | null
          created_at: string
          equipe_id: string | null
          id: string
          laboratoire_id: string | null
          membre_id: string | null
          titre: string
          type: string | null
        }
        Insert: {
          annee?: number | null
          auteurs?: string | null
          created_at?: string
          equipe_id?: string | null
          id?: string
          laboratoire_id?: string | null
          membre_id?: string | null
          titre: string
          type?: string | null
        }
        Update: {
          annee?: number | null
          auteurs?: string | null
          created_at?: string
          equipe_id?: string | null
          id?: string
          laboratoire_id?: string | null
          membre_id?: string | null
          titre?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publications_laboratoire_id_fkey"
            columns: ["laboratoire_id"]
            isOneToOne: false
            referencedRelation: "laboratoires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publications_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "membres"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_existing_lab_request: {
        Args: { p_email: string; p_lab: string }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
