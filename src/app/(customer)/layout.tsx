import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/supabase/queries";

// Layout untuk halaman customer (dengan header dan footer)
export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <div className="flex min-h-screen flex-col">
            <Header storeName={settings.store_name} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
