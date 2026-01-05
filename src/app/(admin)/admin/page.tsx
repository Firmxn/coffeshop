"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    DollarSign,
    TrendingUp,
    Coffee
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/data/mock-data";
import { Order } from "@/types";

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load orders dari localStorage
    useEffect(() => {
        const loadOrders = () => {
            const storedOrders = JSON.parse(localStorage.getItem("arcoffee-orders") || "[]");
            setOrders(storedOrders);
            setIsLoading(false);
        };

        loadOrders();

        // Poll setiap 5 detik untuk update real-time (simulasi)
        const interval = setInterval(loadOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    // Hitung statistik
    const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "completed").length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    };

    // Recent orders (5 terakhir)
    const recentOrders = [...orders].reverse().slice(0, 5);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Coffee className="h-8 w-8 animate-pulse text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-bold md:text-3xl">Dashboard</h1>
                <p className="text-muted-foreground">Selamat datang di panel admin ARCoffee</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pesanan
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Sepanjang waktu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Menunggu Proses
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Perlu segera diproses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Selesai
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Pesanan selesai
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pendapatan
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Sepanjang waktu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Pesanan Terbaru
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p>Belum ada pesanan</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono font-medium text-sm">{order.id}</p>
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${order.status === "pending"
                                                        ? "bg-yellow-500/10 text-yellow-500"
                                                        : order.status === "processing"
                                                            ? "bg-blue-500/10 text-blue-500"
                                                            : order.status === "ready"
                                                                ? "bg-green-500/10 text-green-500"
                                                                : order.status === "completed"
                                                                    ? "bg-gray-500/10 text-gray-500"
                                                                    : "bg-red-500/10 text-red-500"
                                                    }`}
                                            >
                                                {order.status === "pending"
                                                    ? "Menunggu"
                                                    : order.status === "processing"
                                                        ? "Diproses"
                                                        : order.status === "ready"
                                                            ? "Siap"
                                                            : order.status === "completed"
                                                                ? "Selesai"
                                                                : "Batal"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {order.customerName} • {order.items.length} item
                                        </p>
                                    </div>
                                    <p className="font-bold text-primary">
                                        {formatPrice(order.totalPrice)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
