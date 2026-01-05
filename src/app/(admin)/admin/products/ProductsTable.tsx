"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Coffee, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { deleteProduct } from "@/actions/product-actions";
import { ProductDialog } from "./ProductDialog";
import { toast } from "sonner";
import { Category } from "@/types";
import { Option as DbOption } from "@/lib/supabase/types";

// Type definition for product data from DB
export interface AdminProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image: string | null;
    is_available: boolean;
    categories: { name: string } | null; // Joined relation
    slug: string;
    option_ids?: string[];
}

interface ProductsTableProps {
    products: AdminProduct[];
    categories: Category[];
    options?: DbOption[];
}

export default function ProductsTable({ products, categories, options }: ProductsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter logic
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredProducts.slice(startIndex, endIndex);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

        setIsDeleting(id);
        const result = await deleteProduct(id);
        setIsDeleting(null);

        if (result.success) {
            toast.success("Produk berhasil dihapus");
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </div>

                    {/* Category Query */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory("all")}
                        >
                            Semua
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Add Button */}
                <ProductDialog
                    categories={categories}
                    options={options}
                    trigger={
                        <Button className="w-full sm:w-auto gap-2">
                            <Plus className="h-4 w-4" /> Product
                        </Button>
                    }
                />
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentData.map((product) => (
                    <Card key={product.id} className="relative overflow-hidden group p-0 gap-0">
                        {/* Aspect Ratio Image */}
                        {/* Aspect Ratio Image: Force 1:1 Square */}
                        <div className="relative w-full pt-[100%] bg-muted overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
                                    <Coffee className="h-12 w-12 text-primary/30" />
                                </div>
                            )}
                        </div>

                        {/* Availability Badge */}
                        <div className="absolute top-2 right-2">
                            <Badge
                                variant={product.is_available ? "default" : "destructive"}
                                className="shadow-sm"
                            >
                                {product.is_available ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>

                        <CardContent className="p-4">
                            <div className="mb-2">
                                <h3 className="font-heading font-semibold truncate" title={product.name}>{product.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {product.description || "Tidak ada deskripsi"}
                                </p>
                            </div>

                            <div className="flex items-end justify-between mt-4">
                                <div>
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.categories?.name || "Uncategorized"}
                                    </p>
                                </div>

                                <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Edit Button */}
                                    <ProductDialog
                                        categories={categories}
                                        options={options}
                                        productToEdit={product}
                                        trigger={
                                            <Button variant="secondary" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        }
                                    />

                                    {/* Delete Button */}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDelete(product.id, product.name)}
                                        disabled={isDeleting === product.id}
                                    >
                                        {isDeleting === product.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Baris per halaman:</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(val) => {
                                setItemsPerPage(Number(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[80px]">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 50, 100].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>
                            {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} dari {filteredProducts.length}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
