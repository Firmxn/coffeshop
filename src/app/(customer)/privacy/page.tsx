import { Metadata } from "next";
import { Shield } from "lucide-react";
import { getSettings } from "@/lib/supabase/queries";

export const metadata: Metadata = {
    title: "Kebijakan Privasi",
    description: "Kebijakan privasi mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda.",
};

export default async function PrivasiPage() {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Hero Section */}
            <section className="border-b border-border bg-linear-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Kebijakan Privasi
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Terakhir diperbarui: Januari 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
                        <div className="space-y-8 text-muted-foreground">
                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    1. Pendahuluan
                                </h2>
                                <p>
                                    {cleanStoreName} ("kami", "kita", atau "milik kami") berkomitmen untuk melindungi
                                    privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
                                    menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan
                                    layanan kami.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    2. Informasi yang Kami Kumpulkan
                                </h2>
                                <p className="mb-3">Kami dapat mengumpulkan informasi berikut:</p>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li>Nama lengkap dan informasi kontak (email, nomor telepon)</li>
                                    <li>Alamat pengiriman untuk pesanan delivery</li>
                                    <li>Informasi pembayaran (diproses melalui gateway pembayaran yang aman)</li>
                                    <li>Riwayat pesanan dan preferensi menu</li>
                                    <li>Data penggunaan website dan cookies</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    3. Penggunaan Informasi
                                </h2>
                                <p className="mb-3">Kami menggunakan informasi Anda untuk:</p>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li>Memproses dan mengirimkan pesanan Anda</li>
                                    <li>Berkomunikasi dengan Anda tentang pesanan dan layanan</li>
                                    <li>Meningkatkan pengalaman pengguna di website kami</li>
                                    <li>Mengirimkan promosi dan penawaran khusus (dengan persetujuan Anda)</li>
                                    <li>Menganalisis tren dan perilaku pengguna untuk meningkatkan layanan</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    4. Perlindungan Data
                                </h2>
                                <p>
                                    Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai
                                    untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau
                                    pengungkapan yang tidak sah. Data pembayaran Anda dienkripsi dan diproses
                                    melalui gateway pembayaran yang aman dan tersertifikasi.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    5. Berbagi Informasi
                                </h2>
                                <p className="mb-3">
                                    Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.
                                    Kami hanya membagikan informasi Anda dengan:
                                </p>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li>Penyedia layanan pembayaran untuk memproses transaksi</li>
                                    <li>Layanan pengiriman untuk mengirimkan pesanan Anda</li>
                                    <li>Pihak ketiga yang membantu operasional bisnis kami (dengan perjanjian kerahasiaan)</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    6. Cookies
                                </h2>
                                <p>
                                    Website kami menggunakan cookies untuk meningkatkan pengalaman browsing Anda.
                                    Cookies adalah file kecil yang disimpan di perangkat Anda yang membantu kami
                                    mengingat preferensi Anda dan menganalisis penggunaan website. Anda dapat
                                    mengatur browser Anda untuk menolak cookies, namun ini mungkin mempengaruhi
                                    fungsionalitas website.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    7. Hak Anda
                                </h2>
                                <p className="mb-3">Anda memiliki hak untuk:</p>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li>Mengakses dan memperbarui informasi pribadi Anda</li>
                                    <li>Meminta penghapusan data pribadi Anda</li>
                                    <li>Menolak penggunaan data untuk tujuan marketing</li>
                                    <li>Menarik persetujuan penggunaan data kapan saja</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    8. Perubahan Kebijakan
                                </h2>
                                <p>
                                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan
                                    akan dipublikasikan di halaman ini dengan tanggal "Terakhir diperbarui" yang
                                    baru. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                                    9. Hubungi Kami
                                </h2>
                                <p>
                                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin
                                    menggunakan hak Anda terkait data pribadi, silakan hubungi kami di:
                                </p>
                                <div className="mt-4 rounded-lg border bg-card p-4">
                                    <p className="font-semibold text-foreground">{cleanStoreName}</p>
                                    <p>Email: {settings.email}</p>
                                    <p>Telepon: {settings.phone}</p>
                                    <p>Alamat: {settings.address}, {settings.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
