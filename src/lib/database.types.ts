export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          name: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string | null;
          role?: 'user' | 'admin';
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          owner_user_id: string;
          name: string;
          geom: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          name: string;
          geom: unknown;
          created_at?: string;
        };
        Update: {
          name?: string;
          geom?: unknown;
        };
      };
      zones: {
        Row: {
          id: string;
          name: string;
          geom: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          geom: unknown;
          created_at?: string;
        };
        Update: {
          name?: string;
          geom?: unknown;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: 'user' | 'admin';
    };
  };
};
