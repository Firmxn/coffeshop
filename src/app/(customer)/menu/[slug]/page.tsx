import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProductSlugs } from "@/lib/supabase/queries";
import ProductDetailClient from "./ProductDetailClient";

// Revalidasi setiap jam
export const revalidate = 3600;

// Generate static params untuk semua produk
export async function generateStaticParams() {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

// Generate metadata dinamis
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Produk Tidak Ditemukan",
        };
    }

    return {
        title: product.name,
        description: product.description,
    };
}

// Page component
export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Pass product data to client component
    return <ProductDetailClient product={product} />;
}
