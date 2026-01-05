import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    ChefHat,
    Package,
    XCircle,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getOrderByNumber } from "@/lib/supabase/queries";
import { CopyOrderButton } from "./OrderActions";
import { OrderStatus } from "@/types";

interface PageProps {
    params: Promise<{ orderId: string }>;
}

// Konfigurasi status order
const statusConfig: Record<OrderStatus, {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
}> = {
    pending: {
        label: "Menunggu Konfirmasi",
        icon: Clock,
        color: "bg-yellow-500",
        description: "Pesanan Anda sedang menunggu konfirmasi dari barista.",
    },
    processing: {
        label: "Sedang Diproses",
        icon: ChefHat,
        color: "bg-blue-500",
        description: "Barista sedang menyiapkan pesanan Anda.",
    },
    ready: {
        label: "Siap Diambil",
        icon: Package,
        color: "bg-green-500",
        description: "Pesanan Anda sudah siap! Silakan ambil di counter.",
    },
    completed: {
        label: "Selesai",
        icon: CheckCircle2,
        color: "bg-gray-500",
        description: "Terima kasih! Pesanan telah selesai.",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: XCircle,
        color: "bg-red-500",
        description: "Pesanan dibatalkan.",
    },
};

// Urutan status untuk progress indicator
const statusOrder: OrderStatus[] = ["pending", "processing", "ready", "completed"];

export default async function OrderStatusPage({ params }: PageProps) {
    const { orderId } = await params;

    // Fetch order from Supabase
    const order = await getOrderByNumber(orderId);

    if (!order) {
        return (
            <div className="py-20 text-center">
                <XCircle className="mx-auto h-16 w-16 text-destructive/50" />
                <h3 className="mt-4 font-heading text-xl font-semibold">
                    Pesanan tidak ditemukan
                </h3>
                <p className="mt-2 text-muted-foreground">
                    Order ID: {orderId} tidak ditemukan dalam sistem.
                </p>
                <Link href="/menu" className="mt-6 inline-block">
                    <Button>Kembali ke Menu</Button>
                </Link>
            </div>
        );
    }

    const currentStatus = (order.status || "pending") as OrderStatus;
    const config = statusConfig[currentStatus];
    const StatusIcon = config.icon;
    const currentStatusIndex = statusOrder.indexOf(currentStatus);

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Pesan Lagi
                    </Link>
                </div>

                {/* Order Status Card */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    {/* Status Header */}
                    <div className={`${config.color} p-6 text-white text-center`}>
                        <StatusIcon className="mx-auto h-16 w-16 mb-4" />
                        <h1 className="font-heading text-2xl font-bold">{config.label}</h1>
                        <p className="mt-2 text-white/80">{config.description}</p>
                    </div>

                    {/* Order Info */}
                    <div className="p-6">
                        {/* Order ID */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-mono font-bold text-lg">{orderId}</p>
                            </div>
                            <CopyOrderButton orderId={orderId} />
                        </div>

                        {/* Progress Indicator */}
                        {currentStatus !== "cancelled" && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    {statusOrder.slice(0, -1).map((status, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        const isActive = index === currentStatusIndex;
                                        const StepIcon = statusConfig[status].icon;

                                        return (
                                            <div key={status} className="flex-1 relative">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                            } ${isActive ? "ring-4 ring-primary/20" : ""}`}
                                                    >
                                                        <StepIcon className="h-5 w-5" />
                                                    </div>
                                                    <p
                                                        className={`mt-2 text-xs text-center ${isCompleted
                                                            ? "text-foreground font-medium"
                                                            : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {statusConfig[status].label.split(" ")[0]}
                                                    </p>
                                                </div>
                                                {/* Connector line */}
                                                {index < statusOrder.length - 2 && (
                                                    <div
                                                        className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${index < currentStatusIndex
                                                            ? "bg-primary"
                                                            : "bg-muted"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Customer Info */}
                        <div className="border-t border-border pt-6 mb-6">
                            <h3 className="font-heading font-semibold mb-3">Data Pelanggan</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nama</span>
                                    <span className="font-medium">{order.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Telepon</span>
                                    <a
                                        href={`tel:${order.customer_phone}`}
                                        className="font-medium text-primary flex items-center gap-1"
                                    >
                                        <Phone className="h-3 w-3" />
                                        {order.customer_phone}
                                    </a>
                                </div>
                                {order.notes && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Catatan</span>
                                        <span className="font-medium text-right max-w-[200px]">
                                            {order.notes}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-border pt-6 mb-6">
                            <h3 className="font-heading font-semibold mb-3">Rincian Pesanan</h3>
                            <div className="space-y-3">
                                {order.order_items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between py-2 border-b border-border last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.quantity}x {item.product_name}
                                            </p>
                                            {item.order_item_options.length > 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    {item.order_item_options
                                                        .map((opt) => opt.option_name)
                                                        .join(", ")}
                                                </p>
                                            )}
                                            {item.notes && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    "{item.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-medium">
                                            {formatPrice(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-border pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">
                                    {formatPrice(order.total_price)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/menu" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Pesan Lagi
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button className="w-full">Kembali ke Beranda</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
