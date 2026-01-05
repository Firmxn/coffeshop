"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Clock,
    ChefHat,
    Package,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Eye,
    RefreshCw
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
import { formatPrice } from "@/data/mock-data";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";

// Konfigurasi status
const statusConfig: Record<OrderStatus, {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
}> = {
    pending: {
        label: "Menunggu",
        icon: Clock,
        variant: "outline",
        color: "text-yellow-500",
    },
    processing: {
        label: "Diproses",
        icon: ChefHat,
        variant: "secondary",
        color: "text-blue-500",
    },
    ready: {
        label: "Siap Diambil",
        icon: Package,
        variant: "default",
        color: "text-green-500",
    },
    completed: {
        label: "Selesai",
        icon: CheckCircle2,
        variant: "secondary",
        color: "text-gray-500",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: XCircle,
        variant: "destructive",
        color: "text-red-500",
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

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Load orders dari localStorage
    const loadOrders = () => {
        const storedOrders = JSON.parse(localStorage.getItem("arcoffee-orders") || "[]");
        setOrders(storedOrders);
        setIsLoading(false);
    };

    useEffect(() => {
        loadOrders();

        // Poll setiap 3 detik untuk update real-time (simulasi)
        const interval = setInterval(loadOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    // Update status pesanan
    const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
        const storedOrders = JSON.parse(localStorage.getItem("arcoffee-orders") || "[]");
        const updatedOrders = storedOrders.map((order: Order) =>
            order.id === orderId
                ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                : order
        );
        localStorage.setItem("arcoffee-orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);

        toast.success(`Status pesanan ${orderId} diubah ke ${statusConfig[newStatus].label}`);
    };

    // Filter orders
    const filteredOrders = orders.filter((order) =>
        filter === "all" ? true : order.status === filter
    );

    // Sort by newest first
    const sortedOrders = [...filteredOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Format date
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">Pesanan</h1>
                    <p className="text-muted-foreground">Kelola semua pesanan masuk</p>
                </div>
                <Button variant="outline" onClick={loadOrders} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

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

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Daftar Pesanan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Memuat pesanan...
                        </div>
                    ) : sortedOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p>Tidak ada pesanan {filter !== "all" ? `dengan status "${statusConfig[filter as OrderStatus].label}"` : ""}</p>
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
                                        const config = statusConfig[(order.status || "pending") as OrderStatus];
                                        const StatusIcon = config.icon;

                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {order.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{order.customerName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.customerPhone}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.items.length} item
                                                </TableCell>
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
                                                                    onClick={() => updateOrderStatus(order.id, "processing")}
                                                                >
                                                                    <ChefHat className="h-4 w-4 mr-2 text-blue-500" />
                                                                    Proses Pesanan
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "ready" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => updateOrderStatus(order.id, "ready")}
                                                                >
                                                                    <Package className="h-4 w-4 mr-2 text-green-500" />
                                                                    Siap Diambil
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "completed" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => updateOrderStatus(order.id, "completed")}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-gray-500" />
                                                                    Selesai
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status !== "cancelled" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => updateOrderStatus(order.id, "cancelled")}
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

            {/* Order Detail Modal (simple version) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Detail Pesanan</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-mono font-bold">{selectedOrder.id}</p>
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
                                        <div key={i} className="flex justify-between p-2 bg-muted rounded">
                                            <div>
                                                <p className="font-medium">{item.quantity}x {item.product.name}</p>
                                                {item.selectedOptions.length > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.selectedOptions.map((o) => o.name).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-medium">{formatPrice(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(selectedOrder.totalPrice)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
