export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          location: string | null;
          linkedin: string | null;
          github: string | null;
          skills: string | null;
          portfolio: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          location?: string | null;
          linkedin?: string | null;
          github?: string | null;
          skills?: string | null;
          portfolio?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };

      educations: {
        Row: {
          id: number;
          school: string;
          degree: string;
          major: string;
          minor: string;
          gpa: string;
          startDate: string;
          endDate: string;
          coursework: string[];
          profileid: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['educations']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['educations']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'education_profileid_fkey';
            columns: ['profileid'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // ✅ New work_ex table
      experiences: {
        Row: {
          id: number;
          company: string;
          role: string;
          location: string;
          from: string;
          to: string;
          currently: boolean;
          summary: string;
          bullets: string[];
          suggestions: string[];
          showSuggestions: boolean;
          profileid: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['experiences']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['experiences']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'work_ex_profileid_fkey';
            columns: ['profileid'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      projects: {
        Row: {
          id: number;
          name: string;
          from: string;
          to: string;
          summary: string;
          bullets: string[];
          profileid: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'projects_profileid_fkey';
            columns: ['profileid'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
export type ResumeData = {
  profile: {
    name: ProfileRow["full_name"]
    email: ProfileRow["email"]
    phone: ProfileRow["phone"]
    address: ProfileRow["location"]
    linkedin: ProfileRow["linkedin"]
    github: ProfileRow["github"]
    portfolio: ProfileRow["portfolio"]
  }
  education: {
    institution: string
    degree: string
    major: string
    minor: string
    gpa: string
    from: string
    to: string
    coursework: string[]
  }[]
  experience: {
    company: string
    role: string
    location: string
    from: string
    to: string
    currently: boolean
    summary: string
    bullets: string[]
  }[]
  projects: {
    title: string
    technologies: string
    description: string
  }[]
  skills: {
    name: string
  }[]
}