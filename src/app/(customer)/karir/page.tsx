import { getSettings } from "@/lib/supabase/queries";
import { Metadata } from "next";
import { Briefcase, Users, TrendingUp, Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    return {
        title: "Karir",
        description: `Bergabunglah dengan tim ${cleanStoreName} dan kembangkan karir Anda di industri kopi. Lihat lowongan kerja yang tersedia.`,
    };
}

export default async function KarirPage() {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    const benefits = [
        {
            icon: TrendingUp,
            title: "Pengembangan Karir",
            description: "Program pelatihan dan kesempatan berkembang bersama perusahaan",
        },
        {
            icon: Users,
            title: "Tim yang Solid",
            description: "Bekerja dengan tim yang suportif dan penuh semangat",
        },
        {
            icon: Heart,
            title: "Work-Life Balance",
            description: "Jadwal kerja yang fleksibel dan lingkungan kerja yang nyaman",
        },
        {
            icon: Coffee,
            title: "Kopi Gratis",
            description: "Nikmati kopi premium gratis setiap hari untuk karyawan",
        },
    ];

    const openPositions = [
        {
            title: "Barista",
            location: "Jakarta Selatan",
            type: "Full-time",
            description: "Mencari barista berpengalaman yang passionate tentang kopi dan customer service.",
            requirements: [
                "Pengalaman minimal 1 tahun sebagai barista",
                "Menguasai teknik brewing kopi",
                "Komunikatif dan ramah",
                "Bersedia bekerja shift",
            ],
        },
        {
            title: "Store Manager",
            location: "Bandung",
            type: "Full-time",
            description: "Memimpin operasional toko dan mengembangkan tim untuk memberikan pelayanan terbaik.",
            requirements: [
                "Pengalaman minimal 2 tahun di posisi serupa",
                "Leadership dan management skills",
                "Memahami F&B operations",
                "Berorientasi pada target",
            ],
        },
        {
            title: "Marketing Staff",
            location: "Jakarta Selatan",
            type: "Full-time",
            description: `Mengembangkan strategi marketing dan meningkatkan brand awareness ${cleanStoreName}.`,
            requirements: [
                "Pengalaman di digital marketing",
                "Kreatif dan inovatif",
                "Menguasai social media management",
                "Memiliki portfolio marketing campaign",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Hero Section */}
            <section className="border-b border-border bg-linear-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Briefcase className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Karir di <span className="text-primary">{cleanStoreName}</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Bergabunglah dengan kami dan jadilah bagian dari tim yang passionate tentang kopi
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold">
                            Mengapa Bergabung dengan Kami?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Benefit dan keuntungan menjadi bagian dari keluarga {cleanStoreName}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {benefits.map((benefit, idx) => (
                            <div
                                key={idx}
                                className="group rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg hover:border-primary"
                            >
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <benefit.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-heading text-lg font-bold mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="border-t border-border bg-muted/30 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold">
                            Posisi yang Tersedia
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Temukan posisi yang sesuai dengan keahlian dan passion Anda
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl space-y-6">
                        {openPositions.map((position, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-heading text-2xl font-bold mb-2">
                                            {position.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary">{position.location}</Badge>
                                            <Badge variant="outline">{position.type}</Badge>
                                        </div>
                                    </div>
                                    <Button asChild>
                                        <Link href="/kontak">Lamar Sekarang</Link>
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mb-4">
                                    {position.description}
                                </p>

                                <div>
                                    <h4 className="font-semibold mb-2">Persyaratan:</h4>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        {position.requirements.map((req, reqIdx) => (
                                            <li key={reqIdx} className="flex gap-2">
                                                <span className="text-primary">•</span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <Coffee className="mx-auto h-12 w-12 text-primary" />
                        <h2 className="mt-6 font-heading text-3xl font-bold">
                            Tidak Menemukan Posisi yang Sesuai?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Kirimkan CV dan portfolio Anda. Kami selalu mencari talenta terbaik!
                        </p>
                        <div className="mt-8">
                            <Link href="/kontak">
                                <Button size="lg">
                                    Kirim Lamaran Umum
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
