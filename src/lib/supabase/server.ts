import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client untuk server (server-side, Server Components, Route Handlers)
// Supabase client untuk server (server-side, Server Components, Route Handlers)
export async function createClient(useCookies = true) {
    if (useCookies) {
        try {
            const cookieStore = await cookies();
            return createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return cookieStore.getAll();
                        },
                        setAll(cookiesToSet) {
                            try {
                                cookiesToSet.forEach(({ name, value, options }) => {
                                    cookieStore.set(name, value, options);
                                });
                            } catch {
                                // Ignore - Server Component context, cookies are read-only
                            }
                        },
                    },
                }
            );
        } catch (error) {
            // Fallback jika cookies() gagal (misal di generateStaticParams)
            console.warn("Cookies not available, creating generic client");
        }
    }

    // Client tanpa cookies handling (stateless)
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return [];
                },
                setAll(cookiesToSet) {
                    // No-op
                },
            },
        }
    );
}
