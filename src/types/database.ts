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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          shelf: string | null;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          shelf?: string | null;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          shelf?: string | null;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          category_id: string | null;
          price_inr: number;
          compare_at_price_inr: number | null;
          is_customizable: boolean;
          is_premium: boolean;
          stock: number;
          status: 'active' | 'draft' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          category_id?: string | null;
          price_inr: number;
          compare_at_price_inr?: number | null;
          is_customizable?: boolean;
          is_premium?: boolean;
          stock?: number;
          status?: 'active' | 'draft' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          category_id?: string | null;
          price_inr?: number;
          compare_at_price_inr?: number | null;
          is_customizable?: boolean;
          is_premium?: boolean;
          stock?: number;
          status?: 'active' | 'draft' | 'archived';
          created_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          type: 'select' | 'color' | 'text' | 'radio';
          values: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          type: 'select' | 'color' | 'text' | 'radio';
          values?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          type?: 'select' | 'color' | 'text' | 'radio';
          values?: Json;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal_inr: number;
          shipping_inr: number;
          total_inr: number;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          address_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal_inr?: number;
          shipping_inr?: number;
          total_inr?: number;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          address_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal_inr?: number;
          shipping_inr?: number;
          total_inr?: number;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          address_json?: Json;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          qty: number;
          unit_price_inr: number;
          options_json: Json;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          qty?: number;
          unit_price_inr: number;
          options_json?: Json;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          qty?: number;
          unit_price_inr?: number;
          options_json?: Json;
        };
      };
    };
  };
}
