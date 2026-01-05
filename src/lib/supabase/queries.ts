import { createClient } from "@/lib/supabase/server";

// Definisi tipe data secara lokal karena file types.ts bermasalah (bukan sebuah modul)
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    created_at: string;
}

export interface ProductWithOptions {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: string;
    created_at: string;
    options: any[];
}

export interface OrderWithItems {
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone?: string;
    notes?: string;
    created_at: string;
    status: string;
    total_price: number;
    user_id: string;
    order_items: any[];
}

// ========================
// CATEGORIES
// ========================

// Ambil semua kategori
export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data || [];
}

// ========================
// PRODUCTS
// ========================

// Ambil semua produk dengan kategori
export async function getProducts(): Promise<ProductWithOptions[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      categories (*),
      product_options (
        options (*)
      )
    `)
        .eq("is_available", true)
        .order("name");

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return (data || []) as ProductWithOptions[];
}

// Ambil produk berdasarkan kategori
export async function getProductsByCategory(categorySlug: string): Promise<ProductWithOptions[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      categories!inner (*),
      product_options (
        options (*)
      )
    `)
        .eq("categories.slug", categorySlug)
        .eq("is_available", true)
        .order("name");

    if (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }

    return (data || []) as ProductWithOptions[];
}

// Ambil produk berdasarkan slug
export async function getProductBySlug(slug: string): Promise<ProductWithOptions | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      categories (*),
      product_options (
        options (*)
      )
    `)
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }

    return data as ProductWithOptions;
}

// Ambil semua slug produk (untuk generateStaticParams)
export async function getAllProductSlugs(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select("slug")
        .eq("is_available", true);

    if (error) {
        console.error("Error fetching product slugs:", error);
        return [];
    }

    return (data || []).map((p) => p.slug);
}

// ========================
// ORDERS
// ========================

// Generate order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ARC-${timestamp}${random}`;
}

// Buat pesanan baru
export async function createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    notes?: string;
    items: {
        productId: string;
        productName: string;
        productPrice: number;
        quantity: number;
        subtotal: number;
        notes?: string;
        options: {
            optionId: string;
            optionName: string;
            extraPrice: number;
        }[];
    }[];
    totalPrice: number;
}): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
    const supabase = await createClient();
    const orderNumber = generateOrderNumber();

    // Insert order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            order_number: orderNumber,
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            notes: orderData.notes,
            total_price: orderData.totalPrice,
            status: "pending",
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error("Error creating order:", orderError);
        return { success: false, error: "Gagal membuat pesanan" };
    }

    // Insert order items
    for (const item of orderData.items) {
        const { data: orderItem, error: itemError } = await supabase
            .from("order_items")
            .insert({
                order_id: order.id,
                product_id: item.productId,
                product_name: item.productName,
                product_price: item.productPrice,
                quantity: item.quantity,
                subtotal: item.subtotal,
                notes: item.notes,
            })
            .select()
            .single();

        if (itemError || !orderItem) {
            console.error("Error creating order item:", itemError);
            continue;
        }

        // Insert order item options
        if (item.options.length > 0) {
            const { error: optionError } = await supabase
                .from("order_item_options")
                .insert(
                    item.options.map((opt) => ({
                        order_item_id: orderItem.id,
                        option_id: opt.optionId,
                        option_name: opt.optionName,
                        extra_price: opt.extraPrice,
                    }))
                );

            if (optionError) {
                console.error("Error creating order item options:", optionError);
            }
        }
    }

    return { success: true, orderNumber };
}

// Ambil pesanan berdasarkan order number
export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (
        *,
        order_item_options (
          option_name,
          extra_price
        )
      )
    `)
        .eq("order_number", orderNumber)
        .single();

    if (error) {
        console.error("Error fetching order:", error);
        return null;
    }

    return data as OrderWithItems;
}

// Ambil semua pesanan (untuk admin)
export async function getAllOrders(): Promise<OrderWithItems[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (
        *,
        order_item_options (
          option_name,
          extra_price
        )
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return (data || []) as OrderWithItems[];
}

// Update status pesanan
export async function updateOrderStatus(
    orderId: string,
    status: string
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return false;
    }

    return true;
}

// ========================
// OPTIONS (ADD-ONS)
// ========================

// Ambil semua opsi (untuk admin management & helper)
export async function getOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("options")
        .select("*")
        .order("group_name", { ascending: true })
        .order("extra_price", { ascending: true });

    if (error) {
        console.error("Error fetching options:", error);
        return [];
    }

    return data || [];
}

// ========================
// SETTINGS
// ========================

// Ambil settings toko (hanya ada 1 row)
export async function getSettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single(); // Hanya ada 1 row settings

    if (error) {
        console.error("Error fetching settings:", error);
        // Return default values if error
        return {
            id: "00000000-0000-0000-0000-000000000001",
            store_name: "ARCoffee",
            store_tagline: "Kopi Premium, Sesuai Seleramu",
            store_description: "Nikmati pengalaman kopi premium dengan kustomisasi sesuai selera Anda.",
            phone: "+62 812-3456-7890",
            email: "hello@arcoffee.com",
            address: "Jl. Kopi Nikmat No. 123",
            city: "Jakarta Selatan",
            postal_code: "12345",
            operating_hours: {},
            operating_hours_text: "Setiap hari, 08:00 - 22:00 WIB",
            instagram_url: "https://instagram.com/arcoffee",
            facebook_url: "https://facebook.com/arcoffee",
            twitter_url: "https://twitter.com/arcoffee",
            google_maps_url: null,
            whatsapp_number: null,
            about_hero: "ARCoffee adalah coffeeshop lokal yang lahir dari kecintaan mendalam terhadap kopi Indonesia. Kami percaya bahwa setiap cangkir kopi memiliki cerita, dan kami hadir untuk membuat momen ngopi Anda menjadi lebih bermakna.",
            about_story: "Berawal dari sebuah mimpi kecil, ARCoffee didirikan oleh sekelompok pecinta kopi yang ingin menghadirkan pengalaman ngopi yang berbeda di tengah hiruk-pikuk kota.\n\nKami bekerja sama langsung dengan petani kopi dari berbagai daerah di Indonesia - dari Aceh, Toraja, hingga Papua - untuk memastikan setiap biji yang kami sajikan memiliki kualitas terbaik dan mendukung kesejahteraan petani lokal.\n\nDengan barista yang terlatih dan menu yang dapat dikustomisasi sesuai selera, kami berkomitmen untuk memberikan pengalaman yang personal dan memorable di setiap kunjungan Anda.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }

    return data;
}
