// npx supabase gen types typescript --project-id {reference id} > src/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      following: {
        Row: {
          follow_id: string;
          followed_user_id: string;
          user_id: string;
        };
        Insert: {
          follow_id?: string;
          followed_user_id: string;
          user_id: string;
        };
        Update: {
          follow_id?: string;
          followed_user_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "following_followed_user_id_fkey";
            columns: ["followed_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "following_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      likes: {
        Row: {
          like_id: string;
          liked_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          like_id?: string;
          liked_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          like_id?: string;
          liked_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["post_id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      posts: {
        Row: {
          content_id: string | null;
          content_type: number;
          created_at: string;
          description: string | null;
          post_id: string;
          user_id: string;
        };
        Insert: {
          content_id?: string | null;
          content_type: number;
          created_at?: string;
          description?: string | null;
          post_id?: string;
          user_id: string;
        };
        Update: {
          content_id?: string | null;
          content_type?: number;
          created_at?: string;
          description?: string | null;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      profiles: {
        Row: {
          first_name: string;
          is_premium: boolean;
          last_name: string;
          num_followers: number;
          num_following: number;
          num_posts: number;
          user_id: string;
          user_name: string;
        };
        Insert: {
          first_name: string;
          is_premium?: boolean;
          last_name: string;
          num_followers?: number;
          num_following?: number;
          num_posts?: number;
          user_id: string;
          user_name: string;
        };
        Update: {
          first_name?: string;
          is_premium?: boolean;
          last_name?: string;
          num_followers?: number;
          num_following?: number;
          num_posts?: number;
          user_id?: string;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      workout_templates: {
        Row: {
          created_at: string;
          exercises: Json;
          sets: Json;
          template_id: string;
          user_id: string;
          workout_state: Json;
        };
        Insert: {
          created_at?: string;
          exercises: Json;
          sets: Json;
          template_id?: string;
          user_id: string;
          workout_state: Json;
        };
        Update: {
          created_at?: string;
          exercises?: Json;
          sets?: Json;
          template_id?: string;
          user_id?: string;
          workout_state?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "workout_templates_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
