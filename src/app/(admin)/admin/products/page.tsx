import { createClient } from "@/lib/supabase/server";
import { getCategories, getOptions } from "@/lib/supabase/queries";
import ProductsTable, { AdminProduct } from "./ProductsTable";

export const revalidate = 0;

export default async function AdminProductsPage() {
    const supabase = await createClient();

    // Fetch All Data (Parallel)
    const [options, productsResult, categoriesRaw] = await Promise.all([
        getOptions(),
        supabase
            .from("products")
            .select("*, categories(name), product_options(option_id)")
            .order("created_at", { ascending: false }),
        getCategories()
    ]);

    const { data: products, error } = productsResult;

    if (error) {
        console.error("Error fetching products:", error);
    }

    const categories = categoriesRaw.map(cat => ({
        ...cat,
        description: cat.description || undefined,
        image: cat.image_url || undefined
    }));

    // Mapping to AdminProduct
    const mappedProducts: AdminProduct[] = (products || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: p.price,
        category_id: p.category_id,
        image: p.image_url,
        is_available: p.is_available,
        slug: p.slug,
        categories: Array.isArray(p.categories) ? p.categories[0] : p.categories,
        option_ids: (p.product_options as any[])?.map((po) => po.option_id) || [],
    })) as AdminProduct[];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                        Produk
                    </h1>
                    <p className="text-muted-foreground">Kelola menu dan produk</p>
                </div>
            </div>

            <ProductsTable
                products={mappedProducts}
                categories={categories}
                options={options}
            />
        </div>
    );
}
