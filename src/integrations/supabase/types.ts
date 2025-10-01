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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      notification_configs: {
        Row: {
          created_at: string
          created_by: string
          delivery_methods: Database["public"]["Enums"]["delivery_method"][]
          form_id: string
          form_name: string
          form_type: string
          id: string
          is_active: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipients: Database["public"]["Enums"]["recipient_group"][]
          rrule: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          delivery_methods?: Database["public"]["Enums"]["delivery_method"][]
          form_id: string
          form_name: string
          form_type: string
          id?: string
          is_active?: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipients?: Database["public"]["Enums"]["recipient_group"][]
          rrule: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          delivery_methods?: Database["public"]["Enums"]["delivery_method"][]
          form_id?: string
          form_name?: string
          form_type?: string
          id?: string
          is_active?: boolean
          notification_type?: Database["public"]["Enums"]["notification_type"]
          recipients?: Database["public"]["Enums"]["recipient_group"][]
          rrule?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_executions: {
        Row: {
          completed: boolean
          config_id: string
          created_at: string
          delivery_methods: Database["public"]["Enums"]["delivery_method"][]
          error_message: string | null
          executed_at: string | null
          form_id: string
          form_name: string
          id: string
          metadata: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipients: Database["public"]["Enums"]["recipient_group"][]
          scheduled_time: string
          status: string
        }
        Insert: {
          completed?: boolean
          config_id: string
          created_at?: string
          delivery_methods: Database["public"]["Enums"]["delivery_method"][]
          error_message?: string | null
          executed_at?: string | null
          form_id: string
          form_name: string
          id?: string
          metadata?: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipients: Database["public"]["Enums"]["recipient_group"][]
          scheduled_time: string
          status?: string
        }
        Update: {
          completed?: boolean
          config_id?: string
          created_at?: string
          delivery_methods?: Database["public"]["Enums"]["delivery_method"][]
          error_message?: string | null
          executed_at?: string | null
          form_id?: string
          form_name?: string
          id?: string
          metadata?: Json | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          recipients?: Database["public"]["Enums"]["recipient_group"][]
          scheduled_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_executions_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "notification_configs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_method: "email" | "sms"
      notification_type: "pre_inspection" | "due_reminder" | "missed_reminder"
      recipient_group: "operator" | "maintainer" | "admin"
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
    Enums: {
      delivery_method: ["email", "sms"],
      notification_type: ["pre_inspection", "due_reminder", "missed_reminder"],
      recipient_group: ["operator", "maintainer", "admin"],
    },
  },
} as const
