export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          email: string | null
          full_name: string | null
          phone: string | null
          location: string | null
          linkedin: string | null
          github: string | null
          skills: string | null
          portfolio: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin?: string | null
          github?: string | null
          skills?: string | null
          portfolio?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin?: string | null
          github?: string | null
          skills?: string | null
          portfolio?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
