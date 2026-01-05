import { getSettings } from "@/lib/supabase/queries";
import SettingsForm from "./SettingsForm";

export const metadata = {
    title: "Pengaturan Toko",
    description: "Kelola informasi toko, kontak, dan pengaturan lainnya",
};

export default async function AdminSettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold">Pengaturan Toko</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola informasi toko yang akan ditampilkan di website
                </p>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
