import { createClient } from "@supabase/supabase-js";

// Client ini menggunakan SERVICE_ROLE_KEY untuk bypass RLS
// HANYA gunakan ini di Server Actions (backend), jangan di Client Component!
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing env variables for admin client:", {
            url: !!supabaseUrl,
            key: !!serviceRoleKey
        });
        throw new Error("Konfigurasi server (Service Role Key) belum lengkap.");
    }

    return createClient(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
