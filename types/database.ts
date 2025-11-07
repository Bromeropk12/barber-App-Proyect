// Tipos de base de datos generados desde Supabase Schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      barber_availability: {
        Row: {
          barber_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          is_available: boolean
          reason: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          barber_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          reason?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          barber_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          reason?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_availability_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      barber_service_prices: {
        Row: {
          barber_id: string
          created_at: string
          custom_price: number | null
          id: string
          is_available: boolean
          service_id: string
        }
        Insert: {
          barber_id: string
          created_at?: string
          custom_price?: number | null
          id?: string
          is_available?: boolean
          service_id: string
        }
        Update: {
          barber_id?: string
          created_at?: string
          custom_price?: number | null
          id?: string
          is_available?: boolean
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_service_prices_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      business_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string
          updated_at: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time: string
          updated_at?: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          text_content: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          text_content: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          text_content?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_reservation_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_reservation_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_reservation_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_reservation_id_fkey"
            columns: ["related_reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          amount: number
          id: string
          payment_date: string
          payment_method: string
          reservation_id: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          payment_date?: string
          payment_method: string
          reservation_id: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          payment_date?: string
          payment_method?: string
          reservation_id?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          experience_years: number | null
          full_name: string
          id: string
          is_verified: boolean
          phone: string | null
          role: string
          updated_at: string
          work_shift: string | null
          barber_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          full_name: string
          id: string
          is_verified?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
          work_shift?: string | null
          barber_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_verified?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
          work_shift?: string | null
          barber_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations: {
        Row: {
          barber_id: string
          client_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          reservation_date: string
          service_id: string
          start_time: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          barber_id: string
          client_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          reservation_date: string
          service_id: string
          start_time: string
          status?: string
          total_price: number
          updated_at?: string
        }
        Update: {
          barber_id?: string
          client_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          reservation_date?: string
          service_id?: string
          start_time?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price: number
          category: string
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_slots: {
        Args: {
          p_barber_id: string
          p_date: string
          p_service_id?: string
        }
        Returns: {
          start_time: string
          end_time: string
          is_available: boolean
        }[]
      }
      get_dashboard_stats: {
        Args: {
          p_user_id: string
          p_role: string
        }
        Returns: Json
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      handle_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_email_available: {
        Args: {
          p_email: string
          p_exclude_user_id?: string
        }
        Returns: boolean
      }
      is_phone_available: {
        Args: {
          p_phone: string
          p_exclude_user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}