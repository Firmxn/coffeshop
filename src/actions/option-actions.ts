"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { optionSchema, OptionFormData } from "@/lib/schemas";

// Create Option
export async function createOption(data: OptionFormData) {
    const supabase = createAdminClient();

    try {
        const validated = optionSchema.parse(data);

        const { error } = await supabase.from("options").insert({
            group_name: validated.group_name,
            name: validated.name,
            extra_price: validated.extra_price,
        });

        if (error) {
            console.error("Create option DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/options");
        return { success: true };

    } catch (error) {
        console.error("Create option error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as any).errors[0].message };
        }
        return { success: false, error: "Gagal membuat opsi" };
    }
}

// Update Option
export async function updateOption(id: string, data: OptionFormData) {
    const supabase = createAdminClient();

    try {
        const validated = optionSchema.parse(data);

        const { error } = await supabase
            .from("options")
            .update({
                group_name: validated.group_name,
                name: validated.name,
                extra_price: validated.extra_price,
            })
            .eq("id", id);

        if (error) {
            console.error("Update option DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/options");
        return { success: true };

    } catch (error) {
        console.error("Update option error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as any).errors[0].message };
        }
        return { success: false, error: "Gagal mengupdate opsi" };
    }
}

// Delete Option
export async function deleteOption(id: string) {
    const supabase = createAdminClient();

    try {
        // Cek dependencies? Jika opsi dipake di product, product_options akan constraint error?
        // Supabase biasanya restrict delete jika ada FK.
        // Kita harap cascade delete atau error. Defaultnya usually restrict.

        const { error } = await supabase.from("options").delete().eq("id", id);

        if (error) {
            console.error("Delete option DB error:", error);
            // Translate common FK error
            if (error.code === "23503") { // foreign_key_violation
                return { success: false, error: "Opsi ini sedang digunakan oleh produk dan tidak bisa dihapus." };
            }
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/options");
        return { success: true };

    } catch (error) {
        console.error("Delete option error:", error);
        return { success: false, error: "Gagal menghapus opsi" };
    }
}
