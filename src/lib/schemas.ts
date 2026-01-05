import { z } from "zod";

// Schema Validation untuk Produk
export const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
    category_id: z.string().uuid("Kategori tidak valid"),
    image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
    is_available: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
