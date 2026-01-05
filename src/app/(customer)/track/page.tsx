"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Package, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TrackOrderPage() {
    const router = useRouter();
    const [orderId, setOrderId] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderId.trim()) {
            toast.error("Masukkan Order ID");
            return;
        }

        setIsSearching(true);

        // Langsung redirect ke halaman order detail
        // Detail order akan di-fetch di sana (SSR)
        router.push(`/order/${orderId.trim()}`);
    };

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 max-w-lg">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Beranda
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                        Lacak Pesanan
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Masukkan Order ID untuk melihat status pesanan Anda
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="orderId" className="block text-sm font-medium mb-2">
                            Order ID
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                id="orderId"
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                placeholder="Contoh: ARC-M1X2Y3Z"
                                className="w-full rounded-lg border border-input bg-background pl-11 pr-4 py-3 text-lg font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                autoComplete="off"
                                autoFocus
                            />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Order ID diberikan setelah Anda menyelesaikan checkout
                        </p>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <>
                                <Coffee className="h-5 w-5 animate-pulse mr-2" />
                                Mencari...
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5 mr-2" />
                                Lacak Pesanan
                            </>
                        )}
                    </Button>
                </form>

                {/* Info */}
                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                    <h3 className="font-medium mb-2">Tidak punya Order ID?</h3>
                    <p className="text-sm text-muted-foreground">
                        Order ID dikirimkan setelah Anda menyelesaikan proses checkout.
                        Jika Anda belum memesan, silakan{" "}
                        <Link href="/menu" className="text-primary hover:underline">
                            lihat menu kami
                        </Link>{" "}
                        dan buat pesanan baru.
                    </p>
                </div>
            </div>
        </div>
    );
}
