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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          company: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          address: string
          full_address: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          image_url: string | null
          images: string[] | null
          amenities: string[] | null
          features: string[] | null
          opening_hours: Json | null
          capacity: Json | null
          rating: number | null
          available: boolean
          status: string | null
          popular: boolean
          contact_phone: string | null
          contact_email: string | null
          google_maps_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          address: string
          full_address?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          images?: string[] | null
          amenities?: string[] | null
          features?: string[] | null
          opening_hours?: Json | null
          capacity?: Json | null
          rating?: number | null
          available?: boolean
          status?: string | null
          popular?: boolean
          contact_phone?: string | null
          contact_email?: string | null
          google_maps_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          address?: string
          full_address?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          images?: string[] | null
          amenities?: string[] | null
          features?: string[] | null
          opening_hours?: Json | null
          capacity?: Json | null
          rating?: number | null
          available?: boolean
          status?: string | null
          popular?: boolean
          contact_phone?: string | null
          contact_email?: string | null
          google_maps_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          type: 'day_pass' | 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room'
          description: string | null
          features: string[] | null
          pricing: Json
          stripe_product_id: string | null
          stripe_price_ids: Json | null
          popular: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'day_pass' | 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room'
          description?: string | null
          features?: string[] | null
          pricing: Json
          stripe_product_id?: string | null
          stripe_price_ids?: Json | null
          popular?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'day_pass' | 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room'
          description?: string | null
          features?: string[] | null
          pricing?: Json
          stripe_product_id?: string | null
          stripe_price_ids?: Json | null
          popular?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      add_ons: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          type: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          currency?: string
          type?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          type?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          location_id: string
          plan_id: string
          start_date: string
          end_date: string
          start_time: string | null
          end_time: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          currency: string
          payment_method: string | null
          payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          esewa_transaction_id: string | null
          khalti_transaction_id: string | null
          notes: string | null
          contact_info: Json | null
          add_ons: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          location_id: string
          plan_id: string
          start_date: string
          end_date: string
          start_time?: string | null
          end_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          currency?: string
          payment_method?: string | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          esewa_transaction_id?: string | null
          khalti_transaction_id?: string | null
          notes?: string | null
          contact_info?: Json | null
          add_ons?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location_id?: string
          plan_id?: string
          start_date?: string
          end_date?: string
          start_time?: string | null
          end_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount?: number
          currency?: string
          payment_method?: string | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          esewa_transaction_id?: string | null
          khalti_transaction_id?: string | null
          notes?: string | null
          contact_info?: Json | null
          add_ons?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          gateway_response: Json | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          amount: number
          currency?: string
          payment_method: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          gateway_response?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          gateway_response?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

