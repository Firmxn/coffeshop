"use server";

import { createOrder } from "@/lib/supabase/queries";
import { z } from "zod";

// Validasi input
const checkoutSchema = z.object({
    customerName: z.string().min(3, "Nama terlalu pendek"),
    customerPhone: z.string().min(10, "Nomor telepon tidak valid"),
    notes: z.string().optional(),
    items: z.array(
        z.object({
            productId: z.string(),
            productName: z.string(),
            productPrice: z.number(),
            quantity: z.number().min(1),
            subtotal: z.number(),
            notes: z.string().optional(),
            options: z.array(
                z.object({
                    optionId: z.string(),
                    optionName: z.string(),
                    extraPrice: z.number(),
                })
            ),
        })
    ),
    totalPrice: z.number(),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function submitOrder(data: CheckoutInput) {
    // Validasi data di server
    const result = checkoutSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            error: "Data pesanan tidak valid: " + result.error.message,
        };
    }

    try {
        // Simpan ke database
        const order = await createOrder(data);

        if (!order.success) {
            return { success: false, error: order.error };
        }

        return { success: true, orderNumber: order.orderNumber };
    } catch (error) {
        console.error("Submit order error:", error);
        return { success: false, error: "Terjadi kesalahan sistem" };
    }
}
