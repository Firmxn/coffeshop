"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Schema Validation
export const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
    category_id: z.string().uuid("Kategori tidak valid"),
    image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
    is_available: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Create Product
export async function createProduct(data: ProductFormData) {
    const supabase = await createClient();

    try {
        // Validasi input
        const validatedData = productSchema.parse(data);

        // Insert ke DB
        const { error } = await supabase.from("products").insert({
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            category_id: validatedData.category_id,
            image_url: validatedData.image || null,
            is_available: validatedData.is_available,
            slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), // Simple slug gen
        });

        if (error) {
            console.error("Create product DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu"); // Update customer menu view
        return { success: true };

    } catch (error) {
        console.error("Create product unknown error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as any).errors[0].message };
        }
        return { success: false, error: "Gagal membuat produk" };
    }
}

// Update Product
export async function updateProduct(id: string, data: ProductFormData) {
    const supabase = await createClient();

    try {
        const validatedData = productSchema.parse(data);

        const { error } = await supabase
            .from("products")
            .update({
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                category_id: validatedData.category_id,
                image_url: validatedData.image || null,
                is_available: validatedData.is_available,
                // Slug bisa diupdate jika nama berubah, atau biarkan tetap
                slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error("Update product DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true };

    } catch (error) {
        console.error("Update product error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as any).errors[0].message };
        }
        return { success: false, error: "Gagal mengupdate produk" };
    }
}

// Delete Product
export async function deleteProduct(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
            console.error("Delete product DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true };

    } catch (error) {
        console.error("Delete product error:", error);
        return { success: false, error: "Gagal menghapus produk" };
    }
}
