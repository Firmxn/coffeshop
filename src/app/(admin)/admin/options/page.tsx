import { getOptions } from "@/lib/supabase/queries";
import OptionsTable from "./OptionsTable";

export const revalidate = 0;

export default async function AdminOptionsPage() {
    const options = await getOptions();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                        Opsi & Add-ons
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola variasi produk (ukuran, gula, es, topping)
                    </p>
                </div>
            </div>

            <OptionsTable options={options} />
        </div>
    );
}
