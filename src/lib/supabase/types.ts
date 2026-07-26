// Hand-written to match supabase/schema.sql. Once your project is live you
// can replace this with the real generated types:
//   npx supabase gen types typescript --project-id lsqzyjwetjdilnblmhck > src/lib/supabase/types.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: "customer" | "staff";
          staff_role: "owner" | "manager" | "staff" | null;
          has_ordered_before: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      categories: {
        Row: {
          slug: string;
          name: string;
          tagline: string | null;
          icon: string | null;
          is_collection: boolean | null;
          seo: unknown | null;
          archived: boolean | null;
          banner_image: string | null;
          banner_3d_shape: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      products: {
        Row: {
          slug: string;
          category_slug: string | null;
          name: string;
          tagline: string | null;
          description: string | null;
          base_price: number;
          currency: string;
          accent: string | null;
          badges: string[] | null;
          print_time_hrs_min: number | null;
          print_time_hrs_max: number | null;
          rating: number | null;
          review_count: number | null;
          inventory: "in-stock" | "made-to-order" | "low-stock";
          options: unknown;
          media: unknown | null;
          specs: unknown | null;
          materials_used: string[] | null;
          seo: unknown | null;
          featured: boolean | null;
          archived: boolean | null;
          stock_count: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      coupons: {
        Row: {
          code: string;
          type: "percentage" | "fixed" | "free-shipping" | "bxgy";
          value: number;
          description: string | null;
          min_order_value: number | null;
          usage_limit: number | null;
          one_time_use: boolean | null;
          expires_at: string | null;
          first_order_only: boolean | null;
          stackable: boolean | null;
        };
        Insert: Partial<Database["public"]["Tables"]["coupons"]["Row"]> & { code: string; type: string };
        Update: Partial<Database["public"]["Tables"]["coupons"]["Row"]>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string | null;
          pincode: string;
          phone: string;
          is_default: boolean | null;
        };
        Insert: Partial<Database["public"]["Tables"]["addresses"]["Row"]> & {
          user_id: string;
          line1: string;
          city: string;
          pincode: string;
          phone: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          guest_email: string | null;
          date: string;
          status: "processing" | "in-production" | "shipped" | "delivered";
          items: unknown;
          subtotal: number;
          discount: number;
          shipping: number;
          tax: number;
          total: number;
          coupon_code: string | null;
          billing_name: string | null;
          billing_address: string | null;
          billing_city: string | null;
          billing_pincode: string | null;
          billing_phone: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_slug: string | null;
          name: string;
          location: string | null;
          rating: number;
          text: string | null;
          date: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & { name: string; rating: number };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
    };
  };
};
