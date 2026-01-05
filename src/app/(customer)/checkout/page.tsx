"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, User, Phone, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { submitOrder } from "@/actions/order-actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema validasi form checkout
const checkoutSchema = z.object({
    customerName: z.string().min(3, "Nama minimal 3 karakter"),
    customerPhone: z
        .string()
        .min(10, "Nomor telepon minimal 10 digit")
        .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka"),
    notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const totalPrice = getTotalPrice();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form dengan Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            notes: "",
        },
    });

    // Handle submit pesanan
    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true);

        try {
            // Mapping data untuk dikirim ke server action
            const orderPayload = {
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                notes: data.notes,
                totalPrice: totalPrice,
                items: items.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    productPrice: item.product.price,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    notes: item.notes,
                    options: item.selectedOptions.map((opt) => ({
                        optionId: opt.id,
                        optionName: opt.name,
                        extraPrice: opt.extraPrice,
                    })),
                })),
            };

            // Call server action
            const result = await submitOrder(orderPayload);

            if (!result.success || !result.orderNumber) {
                throw new Error(result.error || "Gagal membuat pesanan");
            }

            // Sukses
            toast.success("Pesanan berhasil dibuat!", {
                description: `Order ID: ${result.orderNumber}`,
            });

            // Simpan Order ID ke localStorage untuk history (opsional)
            const history = JSON.parse(localStorage.getItem("arcoffee-history") || "[]");
            localStorage.setItem("arcoffee-history", JSON.stringify([...history, result.orderNumber]));

            // Clear cart
            clearCart();

            // Redirect ke halaman status order
            router.push(`/order/${result.orderNumber}`);

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Gagal memproses pesanan", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan sistem",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    // Redirect jika cart kosong
    if (items.length === 0) {
        return (
            <div className="py-20 text-center">
                <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground/30" />
                <h3 className="mt-6 font-heading text-xl font-semibold">
                    Keranjang kosong
                </h3>
                <p className="mt-2 text-muted-foreground">
                    Tambahkan item ke keranjang untuk melanjutkan checkout.
                </p>
                <Link href="/menu" className="mt-6 inline-block">
                    <Button>Lihat Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Keranjang
                    </Link>
                    <h1 className="font-heading text-3xl font-bold md:text-4xl">
                        Checkout
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Lengkapi data untuk menyelesaikan pesanan
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Info */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Data Pelanggan
                                </h2>

                                <div className="space-y-4">
                                    {/* Nama */}
                                    <div>
                                        <label
                                            htmlFor="customerName"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Nama Lengkap <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            id="customerName"
                                            type="text"
                                            placeholder="Masukkan nama Anda"
                                            className={`w-full rounded-lg border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.customerName
                                                ? "border-destructive"
                                                : "border-input bg-background"
                                                }`}
                                            {...register("customerName")}
                                        />
                                        {errors.customerName && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {errors.customerName.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Telepon */}
                                    <div>
                                        <label
                                            htmlFor="customerPhone"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Nomor Telepon <span className="text-destructive">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input
                                                id="customerPhone"
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                                className={`w-full rounded-lg border pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.customerPhone
                                                    ? "border-destructive"
                                                    : "border-input bg-background"
                                                    }`}
                                                {...register("customerPhone")}
                                            />
                                        </div>
                                        {errors.customerPhone && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {errors.customerPhone.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Catatan */}
                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Catatan Pesanan{" "}
                                            <span className="text-muted-foreground">(opsional)</span>
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <textarea
                                                id="notes"
                                                placeholder="Catatan tambahan untuk pesanan..."
                                                rows={3}
                                                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                {...register("notes")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Summary */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                    Rincian Pesanan ({items.length} item)
                                </h2>

                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.quantity}x {item.product.name}
                                                </p>
                                                {item.selectedOptions.length > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.selectedOptions.map((opt) => opt.name).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-medium">{formatPrice(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                                <h3 className="font-heading text-lg font-semibold mb-4">
                                    Ringkasan Pembayaran
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Biaya Layanan</span>
                                        <span>{formatPrice(0)}</span>
                                    </div>
                                    <div className="border-t border-border pt-3">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method (Dummy) */}
                                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">Bayar di Tempat</p>
                                            <p className="text-xs text-muted-foreground">
                                                Pembayaran saat mengambil pesanan
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full mt-6"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>Buat Pesanan</>
                                    )}
                                </Button>

                                <p className="mt-4 text-center text-xs text-muted-foreground">
                                    Dengan memesan, Anda menyetujui syarat dan ketentuan yang berlaku.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
