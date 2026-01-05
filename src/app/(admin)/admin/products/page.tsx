import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/supabase/queries";
import ProductsTable, { AdminProduct } from "./ProductsTable";

export const revalidate = 0;

export default async function AdminProductsPage() {
    const supabase = await createClient();

    // Fetch Products with Category Name
    const { data: products, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        // Handle error UI? For now just empty list or throw
    }

    // Fetch Categories for dropdown
    const categoriesRaw = await getCategories();
    const categories = categoriesRaw.map(cat => ({
        ...cat,
        description: cat.description || undefined,
        image: cat.image_url || undefined
    }));

    // Mapping data if necessary, though Supabase result should match AdminProduct largely
    // AdminProduct expects: categories: { name: string } | null
    // Supabase result: categories: { name: string } | null | undefined (depends on relationship)

    const mappedProducts: AdminProduct[] = (products || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category_id: p.category_id,
        image: p.image,
        is_available: p.is_available,
        slug: p.slug,
        categories: Array.isArray(p.categories) ? p.categories[0] : p.categories, // Handle potential array return if relationship is inferred differently
    })) as AdminProduct[];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                        Produk
                    </h1>
                    <p className="text-muted-foreground">Kelola menu dan produk</p>
                </div>
            </div>

            <ProductsTable products={mappedProducts} categories={categories} />
        </div>
    );
}
