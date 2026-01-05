"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { productSchema, ProductFormData } from "@/lib/schemas";


// Upload Image
export async function uploadProductImage(formData: FormData) {
    const supabase = createAdminClient();
    const file = formData.get("file") as File;

    if (!file) return { success: false, error: "Tidak ada file yang diunggah" };

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload ke bucket 'products'
    const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        // Jika error karena bucket belum ada, coba buat bucket baru
        if (uploadError.message.includes("not found") || uploadError.message.includes("Bucket")) { // Supabase error message varies
            const { error: createBucketError } = await supabase.storage.createBucket("products", {
                public: true,
            });

            if (createBucketError) {
                console.error("Gagal membuat bucket:", createBucketError);
                return { success: false, error: "Gagal konfigurasi storage" };
            }

            // Retry upload
            const { error: retryError } = await supabase.storage
                .from("products")
                .upload(filePath, file, { upsert: false, contentType: file.type });

            if (retryError) {
                return { success: false, error: retryError.message };
            }
        } else {
            console.error("Upload error:", uploadError);
            return { success: false, error: uploadError.message };
        }
    }

    // Get Public URL
    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
}

// Create Product
export async function createProduct(data: ProductFormData) {
    const supabase = createAdminClient();

    try {
        // Validasi input
        const validatedData = productSchema.parse(data);

        // Insert ke DB
        const { data: newProduct, error } = await supabase.from("products").insert({
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            category_id: validatedData.category_id,
            image_url: validatedData.image || null,
            is_available: validatedData.is_available,
            slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), // Simple slug gen
        }).select().single(); // Select to get ID

        if (error) {
            console.error("Create product DB error:", error);
            return { success: false, error: error.message };
        }

        // Insert Product Options
        if (validatedData.options && validatedData.options.length > 0) {
            const optionsPayload = validatedData.options.map((optId) => ({
                product_id: newProduct.id,
                option_id: optId,
            }));

            const { error: optError } = await supabase.from("product_options").insert(optionsPayload);
            if (optError) {
                console.error("Error adding product options:", optError);
                // Non-fatal error? Should we rollback product?
                // For simplicity, we just log it. RLS might block if not admin (but here we are admin).
            }
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        revalidatePath("/"); // Update featured products on home
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
    const supabase = createAdminClient();

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

        // Update Options: Delete all existing -> Insert new
        const { error: deleteError } = await supabase.from("product_options").delete().eq("product_id", id);
        if (deleteError) {
            console.error("Error clearing old options:", deleteError);
        } else if (validatedData.options && validatedData.options.length > 0) {
            const optionsPayload = validatedData.options.map((optId) => ({
                product_id: id,
                option_id: optId,
            }));

            const { error: insertError } = await supabase.from("product_options").insert(optionsPayload);
            if (insertError) console.error("Error inserting new options:", insertError);
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        revalidatePath("/");
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
    const supabase = createAdminClient();

    try {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
            console.error("Delete product DB error:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        revalidatePath("/");
        return { success: true };

    } catch (error) {
        console.error("Delete product error:", error);
        return { success: false, error: "Gagal menghapus produk" };
    }
}
