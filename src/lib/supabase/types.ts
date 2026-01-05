// TypeScript types untuk Supabase database
// Auto-generated dari schema database

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
                    description: string | null;
                    image_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    image_url: string | null;
                    category_id: string | null;
                    is_available: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    price: number;
                    image_url?: string | null;
                    category_id?: string | null;
                    is_available?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    price?: number;
                    image_url?: string | null;
                    category_id?: string | null;
                    is_available?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            options: {
                Row: {
                    id: string;
                    group_name: string;
                    name: string;
                    extra_price: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    group_name: string;
                    name: string;
                    extra_price?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    group_name?: string;
                    name?: string;
                    extra_price?: number;
                    created_at?: string;
                };
            };
            product_options: {
                Row: {
                    id: string;
                    product_id: string | null;
                    option_id: string | null;
                };
                Insert: {
                    id?: string;
                    product_id?: string | null;
                    option_id?: string | null;
                };
                Update: {
                    id?: string;
                    product_id?: string | null;
                    option_id?: string | null;
                };
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    customer_name: string;
                    customer_phone: string;
                    notes: string | null;
                    status: string;
                    total_price: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_number: string;
                    customer_name: string;
                    customer_phone: string;
                    notes?: string | null;
                    status?: string;
                    total_price: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    order_number?: string;
                    customer_name?: string;
                    customer_phone?: string;
                    notes?: string | null;
                    status?: string;
                    total_price?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string | null;
                    product_id: string | null;
                    product_name: string;
                    product_price: number;
                    quantity: number;
                    subtotal: number;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id?: string | null;
                    product_id?: string | null;
                    product_name: string;
                    product_price: number;
                    quantity?: number;
                    subtotal: number;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string | null;
                    product_id?: string | null;
                    product_name?: string;
                    product_price?: number;
                    quantity?: number;
                    subtotal?: number;
                    notes?: string | null;
                    created_at?: string;
                };
            };
            order_item_options: {
                Row: {
                    id: string;
                    order_item_id: string | null;
                    option_id: string | null;
                    option_name: string;
                    extra_price: number;
                };
                Insert: {
                    id?: string;
                    order_item_id?: string | null;
                    option_id?: string | null;
                    option_name: string;
                    extra_price?: number;
                };
                Update: {
                    id?: string;
                    order_item_id?: string | null;
                    option_id?: string | null;
                    option_name?: string;
                    extra_price?: number;
                };
            };
        };
    };
}

// Helper types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Option = Database["public"]["Tables"]["options"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

// Product dengan relasi
export interface ProductWithCategory extends Product {
    categories: Category | null;
}

// Product dengan opsi
export interface ProductWithOptions extends Product {
    categories: Category | null;
    product_options: {
        options: Option;
    }[];
}

// Order dengan items
export interface OrderWithItems extends Order {
    order_items: (OrderItem & {
        order_item_options: {
            option_name: string;
            extra_price: number;
        }[];
    })[];
}
