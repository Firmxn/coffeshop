import Link from "next/link";
import { Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategories, getProducts, getProductsByCategory } from "@/lib/supabase/queries";
import { formatPrice } from "@/lib/utils";

// Props untuk searchParams dari URL
interface MenuPageProps {
    searchParams: Promise<{ category?: string }>;
}

// Revalidasi data setiap 60 detik
export const revalidate = 60;

export default async function MenuPage({ searchParams }: MenuPageProps) {
    const params = await searchParams;
    const activeCategory = params.category || null;

    // Fetch categories
    const categories = await getCategories();

    // Fetch products berdasarkan filter
    const products = activeCategory
        ? await getProductsByCategory(activeCategory)
        : await getProducts();

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                    <h1 className="font-heading text-3xl font-bold md:text-4xl">
                        Menu Kami
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Pilih minuman atau makanan favoritmu
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <Link href="/menu">
                        <Badge
                            variant={!activeCategory ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm"
                        >
                            Semua
                        </Badge>
                    </Link>
                    {categories.map((category) => (
                        <Link key={category.id} href={`/menu?category=${category.slug}`}>
                            <Badge
                                variant={activeCategory === category.slug ? "default" : "outline"}
                                className="cursor-pointer px-4 py-2 text-sm"
                            >
                                {category.name}
                            </Badge>
                        </Link>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/menu/${product.slug}`}
                            className="group rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-lg hover:border-primary/20"
                        >
                            {/* Product Image Placeholder */}
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden relative">
                                {product.image_url ? (
                                    // Jika ada image_url nanti
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                ) : (
                                    <Coffee className="h-20 w-20 text-primary/30 transition-transform group-hover:scale-110" />
                                )}

                                {/* Sale Badge if needed */}
                                {/* <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500">Sale</Badge>
                </div> */}
                            </div>

                            {/* Product Info */}
                            <div className="mt-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-heading text-lg font-semibold line-clamp-1">
                                        {product.name}
                                    </h3>
                                    {!product.is_available && (
                                        <Badge variant="secondary" className="text-xs">
                                            Habis
                                        </Badge>
                                    )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                    {product.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        disabled={!product.is_available}
                                    >
                                        Pilih
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="py-20 text-center">
                        <Coffee className="mx-auto h-16 w-16 text-muted-foreground/30" />
                        <h3 className="mt-4 font-heading text-xl font-semibold">
                            Tidak ada menu
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Tidak ada menu dalam kategori ini
                        </p>
                        <Link href="/menu" className="mt-4 inline-block">
                            <Button>Lihat Semua Menu</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
