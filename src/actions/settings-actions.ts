"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface SettingsFormData {
    store_name: string;
    store_tagline: string;
    store_description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
    operating_hours_text: string;
    instagram_url: string;
    facebook_url: string;
    twitter_url: string;
    google_maps_url?: string;
    google_maps_embed_url?: string;
    whatsapp_number?: string;
    about_hero?: string;
    about_story?: string;
}

export async function updateSettings(data: SettingsFormData) {
    try {
        const supabase = createAdminClient();

        const { error } = await supabase
            .from("settings")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("id", "00000000-0000-0000-0000-000000000001");

        if (error) {
            console.error("Error updating settings:", error);
            return { success: false, error: error.message };
        }

        // Revalidate all pages that use settings
        revalidatePath("/", "layout");
        revalidatePath("/about");
        revalidatePath("/contact");
        revalidatePath("/locations");
        revalidatePath("/admin/settings");

        return { success: true };
    } catch (error) {
        console.error("Unexpected error updating settings:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
