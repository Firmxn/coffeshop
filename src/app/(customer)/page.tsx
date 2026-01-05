import Link from "next/link";
import { ArrowRight, Coffee, Star, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/supabase/queries";
import { formatPrice } from "@/lib/utils";

// Revalidasi setiap jam
export const revalidate = 3600;

// USP (Unique Selling Points)
const features = [
    {
        icon: Coffee,
        title: "Biji Kopi Premium",
        description: "100% arabica pilihan dari petani lokal Indonesia",
    },
    {
        icon: Star,
        title: "Kustomisasi Bebas",
        description: "Sesuaikan sweetness, ice level, dan add-ons sesukamu",
    },
    {
        icon: Clock,
        title: "Proses Cepat",
        description: "Pesanan siap dalam 5-10 menit untuk take away",
    },
    {
        icon: Truck,
        title: "Pesan Online",
        description: "Order via web, ambil di tempat tanpa antri",
    },
];

export default async function HomePage() {
    // Fetch data
    const categoriesPromise = getCategories();
    const productsPromise = getProducts();

    const [categories, products] = await Promise.all([
        categoriesPromise,
        productsPromise,
    ]);

    // Featured products (ambil 4 produk pertama)
    const featuredProducts = products.slice(0, 4);

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Hero Content */}
                        <div className="max-w-xl">
                            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Kopi Premium,{" "}
                                <br className="sm:hidden" />
                                <span className="text-gradient-coffee">Sesuai Seleramu</span>
                            </h1>
                            <p className="mt-6 text-base sm:text-lg text-muted-foreground">
                                Nikmati pengalaman kopi yang berbeda. Pilih menu favorit,
                                kustomisasi sesuai selera, dan rasakan kesempurnaan di setiap tegukan.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link href="/menu" className="w-full sm:w-auto">
                                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                                        Lihat Menu
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/tentang" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        Tentang Kami
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image Placeholder */}
                        <div className="relative hidden lg:block">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <Coffee className="h-48 w-48 text-primary/30" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-y border-border bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group flex flex-col items-center text-center p-6 rounded-2xl transition-colors hover:bg-background"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 font-heading text-lg font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Jelajahi Menu Kami
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Pilih kategori favoritmu dan temukan minuman yang sempurna
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/menu?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 transition-all hover:shadow-lg hover:scale-[1.02]"
                            >
                                <div className="relative z-10">
                                    <h3 className="font-heading text-2xl font-bold">
                                        {category.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                                        Lihat Menu
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                                {/* Decorative coffee icon */}
                                <Coffee className="absolute -bottom-4 -right-4 h-32 w-32 text-primary/5 transition-transform group-hover:scale-110" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-heading text-3xl font-bold md:text-4xl">
                                Menu Populer
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Favorit pelanggan kami
                            </p>
                        </div>
                        <Link href="/menu">
                            <Button variant="outline" className="hidden sm:flex gap-2">
                                Lihat Semua
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/menu/${product.slug}`}
                                className="group rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                {/* Product Image Placeholder */}
                                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden relative">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <Coffee className="h-16 w-16 text-primary/30 transition-transform group-hover:scale-110" />
                                    )}
                                </div>
                                {/* Product Info */}
                                <div className="mt-4">
                                    <h3 className="font-heading text-lg font-semibold">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                        {product.description}
                                    </p>
                                    <p className="mt-3 text-lg font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile view all button */}
                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/menu">
                            <Button className="gap-2">
                                Lihat Semua Menu
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl gradient-coffee p-8 text-center text-primary-foreground md:p-16">
                        <div className="relative z-10">
                            <h2 className="font-heading text-3xl font-bold md:text-4xl">
                                Siap Menikmati Kopi Terbaik?
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                                Pesan sekarang dan rasakan perbedaan kopi premium yang dibuat khusus untukmu.
                            </p>
                            <Link href="/menu" className="mt-8 inline-block">
                                <Button size="lg" variant="secondary" className="gap-2">
                                    Pesan Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                    </div>
                </div>
            </section>
        </>
    );
}
