import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "./admin-shell";
import { getSettings } from "@/lib/supabase/queries";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        redirect("/login");
    }

    const settings = await getSettings();

    return (
        <AdminShell userEmail={user.email} storeName={settings.store_name}>
            {children}
        </AdminShell>
    );
}
