"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coffee, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Option as OptionType, OptionGroup } from "@/types"; // Use global types
import { ProductWithOptions, Option as DbOption } from "@/lib/supabase/types";
import { toast } from "sonner";

// Mapping group ke label
const groupLabels: Record<string, string> = {
    size: "Ukuran",
    ice: "Level Es",
    sugar: "Level Gula",
    addon: "Tambahan",
};

interface ProductDetailClientProps {
    product: ProductWithOptions;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);

    // Transform data product options dari DB structure ke flat array of options
    const allOptions = product.product_options.map((po) => po.options);

    // State untuk kustomisasi
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<DbOption[]>([]);
    const [notes, setNotes] = useState("");

    // Grup opsi yang tersedia untuk produk ini
    const availableGroups = [...new Set(allOptions.map((opt) => opt.group_name))];

    // Ambil opsi berdasarkan grup dari produk
    const getOptionsByGroup = (group: string) => {
        return allOptions.filter((opt) => opt.group_name === group);
    };

    // Handle pilih opsi
    const handleSelectOption = (option: DbOption, isMultiple: boolean = false) => {
        setSelectedOptions((prev) => {
            if (isMultiple) {
                // Untuk addon: toggle
                const exists = prev.find((o) => o.id === option.id);
                if (exists) {
                    return prev.filter((o) => o.id !== option.id);
                }
                return [...prev, option];
            } else {
                // Untuk size/ice/sugar: replace dalam grup yang sama
                const filtered = prev.filter((o) => o.group_name !== option.group_name);
                return [...filtered, option];
            }
        });
    };

    // Cek apakah opsi dipilih
    const isOptionSelected = (optionId: string) => {
        return selectedOptions.some((o) => o.id === optionId);
    };

    // Hitung total harga
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.extra_price, 0);
    const totalPrice = (product.price + optionsPrice) * quantity;

    // Handle tambah ke keranjang
    const handleAddToCart = () => {
        // Convert DbOption to global types OptionType for cart store compatibility
        const cartSelectedOptions: OptionType[] = selectedOptions.map(opt => ({
            id: opt.id,
            group: opt.group_name as OptionGroup,
            name: opt.name,
            extraPrice: opt.extra_price
        }));

        // Convert product data for cart store
        const cartProduct = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            price: product.price,
            image: product.image_url || "",
            categoryId: product.category_id || "",
            isAvailable: product.is_available,
            options: product.product_options.map(po => ({
                productId: product.id,
                optionId: po.options.id,
                option: {
                    id: po.options.id,
                    group: po.options.group_name as OptionGroup,
                    name: po.options.name,
                    extraPrice: po.options.extra_price
                }
            }))
        };

        addItem(cartProduct, quantity, cartSelectedOptions, notes || undefined);

        toast.success(`${product.name} ditambahkan ke keranjang`, {
            description: `${quantity}x - ${formatPrice(totalPrice)}`,
            action: {
                label: "Lihat Keranjang",
                onClick: () => router.push("/cart"),
            },
        });
    };

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Menu
                </Link>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Image */}
                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden relative">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Coffee className="h-32 w-32 text-primary/30" />
                        )}
                    </div>

                    {/* Product Info & Customization */}
                    <div>
                        {/* Basic Info */}
                        <div className="mb-6">
                            {!product.is_available && (
                                <Badge variant="destructive" className="mb-2">
                                    Tidak Tersedia
                                </Badge>
                            )}
                            <h1 className="font-heading text-3xl font-bold md:text-4xl">
                                {product.name}
                            </h1>
                            <p className="mt-3 text-lg text-muted-foreground">
                                {product.description}
                            </p>
                            <p className="mt-4 text-2xl font-bold text-primary">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {/* Customization Options */}
                        {availableGroups.length > 0 && (
                            <div className="space-y-6">
                                {availableGroups.map((group) => {
                                    const groupOptions = getOptionsByGroup(group);
                                    // Sort options by extra_price (asc)
                                    groupOptions.sort((a, b) => a.extra_price - b.extra_price);

                                    const isMultiple = group === "addon";

                                    return (
                                        <div key={group} className="border-t border-border pt-6">
                                            <h3 className="font-heading font-semibold mb-3">
                                                {groupLabels[group] || group}
                                                {!isMultiple && (
                                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                                        (Pilih satu)
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {groupOptions.map((option) => {
                                                    const isSelected = isOptionSelected(option.id);
                                                    return (
                                                        <Button
                                                            key={option.id}
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={() => handleSelectOption(option, isMultiple)}
                                                        >
                                                            {isSelected && <Check className="h-3 w-3" />}
                                                            {option.name}
                                                            {option.extra_price > 0 && (
                                                                <span className="text-xs opacity-70">
                                                                    +{formatPrice(option.extra_price)}
                                                                </span>
                                                            )}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Notes */}
                        <div className="border-t border-border pt-6 mt-6">
                            <h3 className="font-heading font-semibold mb-3">
                                Catatan
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    (Opsional)
                                </span>
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Jangan terlalu manis, pisahkan es..."
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                rows={2}
                            />
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="border-t border-border pt-6 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">Jumlah</span>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-bold text-lg">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full gap-2"
                                onClick={handleAddToCart}
                                disabled={!product.is_available}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Tambah ke Keranjang - {formatPrice(totalPrice)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
