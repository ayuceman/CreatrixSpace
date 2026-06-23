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
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          full_address: string | null
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
          full_address?: string | null
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
          full_address?: string | null
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
        Relationships: []
      }
      location_rooms: {
        Row: {
          id: string
          location_id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          capacity: number | null
          status: 'available' | 'booked' | 'maintenance'
          tags: string[] | null
          amenities: string[] | null
          size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          capacity?: number | null
          status?: 'available' | 'booked' | 'maintenance'
          tags?: string[] | null
          amenities?: string[] | null
          size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          capacity?: number | null
          status?: 'available' | 'booked' | 'maintenance'
          tags?: string[] | null
          amenities?: string[] | null
          size?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          name: string
          type:
            | 'day_pass'
            | 'hot_desk'
            | 'dedicated_desk'
            | 'private_office'
            | 'meeting_room'
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
          type:
            | 'day_pass'
            | 'hot_desk'
            | 'dedicated_desk'
            | 'private_office'
            | 'meeting_room'
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
          type?:
            | 'day_pass'
            | 'hot_desk'
            | 'dedicated_desk'
            | 'private_office'
            | 'meeting_room'
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
        Relationships: []
      }
      location_plan_pricing: {
        Row: {
          id: string
          location_id: string
          plan_id: string
          pricing: Json
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_id: string
          plan_id: string
          pricing: Json
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          plan_id?: string
          pricing?: Json
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_plan_pricing: {
        Row: {
          id: string
          room_id: string
          plan_id: string
          pricing: Json
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          plan_id: string
          pricing: Json
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          plan_id?: string
          pricing?: Json
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      manual_admin_entries: {
        Row: {
          id: string
          entry_type: 'booking' | 'membership'
          data: Json
          created_by: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          entry_type: 'booking' | 'membership'
          data: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          entry_type?: 'booking' | 'membership'
          data?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          location_id: string
          room_id: string | null
          plan_id: string
          start_date: string
          end_date: string
          start_time: string | null
          end_time: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          currency: string
          payment_method: string | null
          payment_status:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'refunded'
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
          room_id?: string | null
          plan_id: string
          start_date: string
          end_date: string
          start_time?: string | null
          end_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          currency?: string
          payment_method?: string | null
          payment_status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'refunded'
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
          room_id?: string | null
          plan_id?: string
          start_date?: string
          end_date?: string
          start_time?: string | null
          end_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount?: number
          currency?: string
          payment_method?: string | null
          payment_status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'refunded'
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
        Relationships: []
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
          status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'refunded'
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
          status?:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'failed'
            | 'refunded'
          transaction_id?: string | null
          gateway_response?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      amenities: {
        Row: {
          id: string
          title: string
          description: string
          icon: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_tour_content: {
        Row: {
          id: string
          step1_headline: string
          step1_description: string
          step2_headline: string
          confirmation_eyebrow: string
          confirmation_tour_details: string
          time_slots: Json
          interest_options: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step1_headline?: string
          step1_description?: string
          step2_headline?: string
          confirmation_eyebrow?: string
          confirmation_tour_details?: string
          time_slots?: Json
          interest_options?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step1_headline?: string
          step1_description?: string
          step2_headline?: string
          confirmation_eyebrow?: string
          confirmation_tour_details?: string
          time_slots?: Json
          interest_options?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cta_content: {
        Row: {
          id: string
          eyebrow: string
          headline_1: string
          headline_em: string
          headline_2: string
          description: string
          rooms: Json
          features: Json
          form_name_label: string
          form_email_label: string
          form_room_label: string
          form_button_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          eyebrow?: string
          headline_1?: string
          headline_em?: string
          headline_2?: string
          description?: string
          rooms?: Json
          features?: Json
          form_name_label?: string
          form_email_label?: string
          form_room_label?: string
          form_button_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          eyebrow?: string
          headline_1?: string
          headline_em?: string
          headline_2?: string
          description?: string
          rooms?: Json
          features?: Json
          form_name_label?: string
          form_email_label?: string
          form_room_label?: string
          form_button_text?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          form_type: string
          name: string
          email: string
          phone: string | null
          room: string | null
          selected_date: string | null
          time_slot: string | null
          interest: string | null
          notes: string | null
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          form_type: string
          name: string
          email: string
          phone?: string | null
          room?: string | null
          selected_date?: string | null
          time_slot?: string | null
          interest?: string | null
          notes?: string | null
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          form_type?: string
          name?: string
          email?: string
          phone?: string | null
          room?: string | null
          selected_date?: string | null
          time_slot?: string | null
          interest?: string | null
          notes?: string | null
          message?: string | null
          created_at?: string
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          id: string
          images: Json
          pricing: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          images?: Json
          pricing?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          images?: Json
          pricing?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_companies: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          italic: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          italic?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          italic?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      membership_content: {
        Row: {
          id: string
          tabs: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tabs?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tabs?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          id: string
          label: string
          value: string
          suffix: string | null
          meta: string | null
          sort_order: number | null
          section: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          value: string
          suffix?: string | null
          meta?: string | null
          sort_order?: number | null
          section?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          value?: string
          suffix?: string | null
          meta?: string | null
          sort_order?: number | null
          section?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      spaces_content: {
        Row: {
          id: string
          cards: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cards?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cards?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          quote: string
          author_name: string
          author_role: string | null
          author_initials: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote: string
          author_name: string
          author_role?: string | null
          author_initials?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote?: string
          author_name?: string
          author_role?: string | null
          author_initials?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
