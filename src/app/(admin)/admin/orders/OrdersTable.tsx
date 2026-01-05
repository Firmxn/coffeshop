"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Clock,
    ChefHat,
    Package,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Eye,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/actions/admin-actions";

// Konfigurasi status
const statusConfig: Record<OrderStatus, {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: "default" | "secondary" | "destructive" | "outline";
}> = {
    pending: {
        label: "Menunggu",
        icon: Clock,
        variant: "outline",
    },
    processing: {
        label: "Diproses",
        icon: ChefHat,
        variant: "secondary",
    },
    ready: {
        label: "Siap Diambil",
        icon: Package,
        variant: "default",
    },
    completed: {
        label: "Selesai",
        icon: CheckCircle2,
        variant: "secondary",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: XCircle,
        variant: "destructive",
    },
};

// Filter status
const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
    { label: "Semua", value: "all" },
    { label: "Menunggu", value: "pending" },
    { label: "Diproses", value: "processing" },
    { label: "Siap", value: "ready" },
    { label: "Selesai", value: "completed" },
];

interface OrdersTableProps {
    initialOrders: Order[];
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sync orders when props change (e.g. after refresh)
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    // Handle refresh manual
    const handleRefresh = () => {
        router.refresh();
        toast.info("Memuat ulang data...");
    };

    // Update status pesanan
    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            // Optimistic update
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );

            const result = await updateOrderStatusAction(orderId, newStatus);

            if (result.success) {
                toast.success(`Status pesanan diubah ke ${statusConfig[newStatus].label}`);
                router.refresh(); // Refresh server data
            } else {
                // Revert if failed
                toast.error(result.error || "Gagal mengupdate status");
                router.refresh();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Terjadi kesalahan sistem");
            router.refresh();
        } finally {
            setIsUpdating(false);
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((order) =>
        filter === "all" ? true : order.status === filter
    );

    // Data sudah disort dari server (newest first), tapi kita sort ulang client-side just in case
    const sortedOrders = [...filteredOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((item) => {
                        const count =
                            item.value === "all"
                                ? orders.length
                                : orders.filter((o) => o.status === item.value).length;

                        return (
                            <Button
                                key={item.value}
                                variant={filter === item.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(item.value)}
                                className="gap-2"
                            >
                                {item.label}
                                <Badge variant="secondary" className="ml-1">
                                    {count}
                                </Badge>
                            </Button>
                        );
                    })}
                </div>

                <Button variant="outline" onClick={handleRefresh} className="gap-2" disabled={isUpdating}>
                    <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Daftar Pesanan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p>
                                Tidak ada pesanan{" "}
                                {filter !== "all"
                                    ? `dengan status "${statusConfig[filter as OrderStatus].label}"`
                                    : ""}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedOrders.map((order) => {
                                        const config =
                                            statusConfig[(order.status || "pending") as OrderStatus];
                                        const StatusIcon = config.icon;

                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {order.orderNumber || order.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{order.customerName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.customerPhone}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{order.items.length} item</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatPrice(order.totalPrice)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={config.variant} className="gap-1">
                                                        <StatusIcon className="h-3 w-3" />
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(order.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Lihat Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                                                            {order.status !== "processing" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleUpdateStatus(order.id, "processing")
                                                                    }
                                                                >
                                                                    <ChefHat className="h-4 w-4 mr-2 text-blue-500" />
                                                                    Proses Pesanan
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "ready" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleUpdateStatus(order.id, "ready")
                                                                    }
                                                                >
                                                                    <Package className="h-4 w-4 mr-2 text-green-500" />
                                                                    Siap Diambil
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "completed" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleUpdateStatus(order.id, "completed")
                                                                    }
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-gray-500" />
                                                                    Selesai
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "cancelled" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleUpdateStatus(order.id, "cancelled")
                                                                    }
                                                                    className="text-destructive"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                    Batalkan
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Detail Pesanan</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-mono font-bold">{selectedOrder.orderNumber || selectedOrder.id}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama</p>
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telepon</p>
                                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                                </div>
                            </div>
                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Catatan</p>
                                    <p>{selectedOrder.notes}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Items</p>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between p-2 bg-muted rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.quantity}x {item.product.name}
                                                </p>
                                                {item.selectedOptions.length > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.selectedOptions.map((o) => o.name).join(", ")}
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
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">
                                    {formatPrice(selectedOrder.totalPrice)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
