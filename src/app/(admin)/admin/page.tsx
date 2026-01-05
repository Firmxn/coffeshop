import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    DollarSign,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getAllOrders, getSettings } from "@/lib/supabase/queries";
import { OrderStatus } from "@/types";

export const revalidate = 0; // Disable cache

export default async function AdminDashboardPage() {
    const orders = await getAllOrders();
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    // Hitung statistik
    const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => (o.status as string) === "pending").length,
        completedOrders: orders.filter((o) => (o.status as string) === "completed").length,
        totalRevenue: orders
            .filter((o) => (o.status as string) === "completed")
            .reduce((sum, o) => sum + o.total_price, 0),
    };

    // Recent orders (5 terakhir)
    const recentOrders = [...orders].slice(0, 5); // getAllOrders sudah desc order

    // Helper untuk status label
    const getStatusLabel = (status: string) => {
        switch (status as OrderStatus) {
            case "pending": return "Menunggu";
            case "processing": return "Diproses";
            case "ready": return "Siap";
            case "completed": return "Selesai";
            case "cancelled": return "Batal";
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status as OrderStatus) {
            case "pending": return "bg-yellow-500/10 text-yellow-500";
            case "processing": return "bg-blue-500/10 text-blue-500";
            case "ready": return "bg-green-500/10 text-green-500";
            case "completed": return "bg-gray-500/10 text-gray-500";
            case "cancelled": return "bg-red-500/10 text-red-500";
            default: return "bg-muted";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-bold md:text-3xl">Dashboard</h1>
                <p className="text-muted-foreground">Selamat datang di panel admin {cleanStoreName}</p>
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
                            Pesanan per status
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
                            Dari pesanan selesai
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
                                            <p className="font-mono font-medium text-sm">{order.order_number}</p>
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status || "")}`}
                                            >
                                                {getStatusLabel(order.status || "")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {order.customer_name} • {order.order_items.length} item
                                        </p>
                                    </div>
                                    <p className="font-bold text-primary">
                                        {formatPrice(order.total_price)}
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
