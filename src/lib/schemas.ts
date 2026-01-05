import { z } from "zod";

// Schema Validation untuk Produk
export const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
    category_id: z.string().uuid("Kategori tidak valid"),
    image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
    is_available: z.boolean().default(true),
    options: z.array(z.string()).optional(), // Array of Option IDs
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema Validation untuk Opsi/Add-on
export const optionSchema = z.object({
    group_name: z.enum(["size", "ice", "sugar", "addon"]),
    name: z.string().min(1, "Nama opsi wajib diisi"),
    extra_price: z.coerce.number().min(0, "Harga tambahan tidak boleh negatif"),
});

export type OptionFormData = z.infer<typeof optionSchema>;
