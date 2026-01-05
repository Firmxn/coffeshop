"use client";

import { useState } from "react";
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, categories, formatPrice } from "@/data/mock-data";

export default function AdminProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

    // Filter produk
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">Produk</h1>
                    <p className="text-muted-foreground">Kelola menu dan produk</p>
                </div>
                <Button className="gap-2" disabled>
                    <Plus className="h-4 w-4" />
                    Tambah Produk
                    <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2">
                    <Button
                        variant={categoryFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("all")}
                    >
                        Semua
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={categoryFilter === cat.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter(cat.id)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                    const category = categories.find((c) => c.id === product.categoryId);

                    return (
                        <Card key={product.id} className="relative overflow-hidden">
                            {/* Product Image Placeholder */}
                            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                <Coffee className="h-12 w-12 text-primary/30" />
                            </div>

                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-heading font-semibold">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {product.description}
                                        </p>
                                    </div>
                                    <Badge variant={product.isAvailable ? "default" : "secondary"}>
                                        {product.isAvailable ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {category?.name}
                                        </p>
                                    </div>

                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" disabled>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" disabled className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 font-heading text-lg font-semibold">
                        Produk tidak ditemukan
                    </h3>
                    <p className="text-muted-foreground">
                        Coba ubah filter atau kata kunci pencarian
                    </p>
                </div>
            )}

            {/* Info Banner */}
            <Card className="bg-muted/50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-heading font-semibold">Fitur CRUD Produk</h3>
                            <p className="text-sm text-muted-foreground">
                                Fitur tambah, edit, dan hapus produk akan tersedia setelah integrasi dengan Supabase.
                                Data produk saat ini menggunakan mock data.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
