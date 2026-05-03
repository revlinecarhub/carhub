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
      cars: {
        Row: {
          id: string;
          slug: string;
          marque: string;
          modele: string;
          type: string | null;
          annee: number | null;
          pays_constructeur: string;
          exemplaires_produits: number | null;
          phase_generation: string | null;
          carburant: string;
          config_moteur: string | null;
          cylindree_cm3: number | null;
          puissance_ch: number | null;
          roues_motrices: string | null;
          boite_vitesse: string | null;
          nb_vitesses: number | null;
          alimentation: string | null;
          position_moteur: string | null;
          video_url: string | null;
          video_public_id: string | null;
          cover_image_url: string | null;
          situation: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          marque: string;
          modele: string;
          type?: string | null;
          annee?: number | null;
          pays_constructeur: string;
          exemplaires_produits?: number | null;
          phase_generation?: string | null;
          carburant: string;
          config_moteur?: string | null;
          cylindree_cm3?: number | null;
          puissance_ch?: number | null;
          roues_motrices?: string | null;
          boite_vitesse?: string | null;
          nb_vitesses?: number | null;
          alimentation?: string | null;
          position_moteur?: string | null;
          video_url?: string | null;
          video_public_id?: string | null;
          cover_image_url?: string | null;
          situation?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          marque?: string;
          modele?: string;
          type?: string | null;
          annee?: number | null;
          pays_constructeur?: string;
          exemplaires_produits?: number | null;
          phase_generation?: string | null;
          carburant?: string;
          config_moteur?: string | null;
          cylindree_cm3?: number | null;
          puissance_ch?: number | null;
          roues_motrices?: string | null;
          boite_vitesse?: string | null;
          nb_vitesses?: number | null;
          alimentation?: string | null;
          position_moteur?: string | null;
          video_url?: string | null;
          video_public_id?: string | null;
          cover_image_url?: string | null;
          situation?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      car_images: {
        Row: {
          id: string;
          car_id: string | null;
          cloudinary_url: string;
          cloudinary_public_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          car_id?: string | null;
          cloudinary_url: string;
          cloudinary_public_id: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string | null;
          cloudinary_url?: string;
          cloudinary_public_id?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          bio: string | null;
          club_association: string | null;
          type_voiture_prefere: string | null;
          social_links: { platform: string; url: string }[];
          avatar_url: string | null;
          avatar_public_id: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          bio?: string | null;
          club_association?: string | null;
          type_voiture_prefere?: string | null;
          social_links?: { platform: string; url: string }[];
          avatar_url?: string | null;
          avatar_public_id?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          bio?: string | null;
          club_association?: string | null;
          type_voiture_prefere?: string | null;
          social_links?: { platform: string; url: string }[];
          avatar_url?: string | null;
          avatar_public_id?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      car_likes: {
        Row: {
          user_id: string;
          car_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          car_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          car_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      car_comments: {
        Row: {
          id: string;
          car_id: string;
          user_id: string;
          body: string;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          car_id: string;
          user_id: string;
          body: string;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string;
          user_id?: string;
          body?: string;
          rating?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "car_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      car_views: {
        Row: {
          car_id: string;
          view_key: string;
          created_at: string;
        };
        Insert: {
          car_id: string;
          view_key: string;
          created_at?: string;
        };
        Update: {
          car_id?: string;
          view_key?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          follower_id: string;
          followee_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          followee_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          followee_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          body: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          body: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          body?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          location_name: string;
          lat: number;
          lng: number;
          event_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          location_name: string;
          lat: number;
          lng: number;
          event_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          location_name?: string;
          lat?: number;
          lng?: number;
          event_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      profile_stats: {
        Row: {
          owner_id: string | null;
          cars_count: number;
          views_count: number;
          likes_count: number;
        };
        Relationships: [];
      };
      top_liked_cars: {
        Row: {
          id: string;
          slug: string;
          marque: string;
          modele: string;
          annee: number | null;
          cover_image_url: string | null;
          like_count: number;
        };
        Relationships: [];
      };
      top_viewed_cars: {
        Row: {
          id: string;
          slug: string;
          marque: string;
          modele: string;
          annee: number | null;
          cover_image_url: string | null;
          view_count: number;
        };
        Relationships: [];
      };
    };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
