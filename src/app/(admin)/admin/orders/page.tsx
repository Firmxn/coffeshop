import { getAllOrders } from "@/lib/supabase/queries";
import OrdersTable from "./OrdersTable";
import { Order, OrderStatus } from "@/types";
import { ShoppingBag, RefreshCw } from "lucide-react"; // Import icon just in case needed for skeleton/loading UI
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Disable cache for admin real-time

export default async function AdminOrdersPage() {
    const ordersData = await getAllOrders();

    // Mapping DB data ke App Types
    const mappedOrders: Order[] = ordersData.map((order) => ({
        id: order.id, // Use UUID for operations
        orderNumber: order.order_number, // Display ID
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        totalPrice: order.total_price,
        status: (order.status as OrderStatus) || "pending",
        notes: order.notes || undefined,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: order.order_items.map((item) => ({
            id: item.id,
            product: {
                id: item.product_id || "deleted",
                name: item.product_name,
                price: item.product_price,
                slug: "", // Not needed for admin table
                description: "",
                image: "",
                categoryId: "",
                isAvailable: true,
                options: []
            },
            quantity: item.quantity,
            subtotal: item.subtotal, // Use stored subtotal directly
            notes: item.notes || undefined,
            selectedOptions: item.order_item_options.map((opt) => ({
                id: (opt as any).id || crypto.randomUUID(), // Fallback if type issue
                name: opt.option_name,
                extraPrice: opt.extra_price,
                group: "addon" as any // Dummy cast
            })),
        })),
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                        Pesanan
                    </h1>
                    <p className="text-muted-foreground">Kelola semua pesanan masuk</p>
                </div>
            </div>

            <OrdersTable initialOrders={mappedOrders} />
        </div>
    );
}
