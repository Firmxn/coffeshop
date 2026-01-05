import { Metadata } from "next";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSettings } from "@/lib/supabase/queries";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    return {
        title: "Lokasi Toko",
        description: `Temukan lokasi cabang ${cleanStoreName} terdekat dari Anda. Kunjungi kami untuk pengalaman kopi terbaik.`,
    };
}

export default async function LokasiPage() {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    const locations = [
        {
            name: `${cleanStoreName} (Pusat)`,
            address: settings.address,
            city: `${settings.city}, ${settings.postal_code}`,
            phone: settings.phone,
            hours: settings.operating_hours_text,
            mapUrl: settings.google_maps_url,
            isMain: true,
        },
        // Placeholder branches
        {
            name: `${cleanStoreName} Bandung`,
            address: "Jl. Braga No. 45, Sumur Bandung",
            city: "Bandung, Jawa Barat 40111",
            phone: "+62 821-9876-5432",
            hours: "08.00 - 22.00 WIB",
            isMain: false,
        },
        {
            name: `${cleanStoreName} Surabaya`,
            address: "Jl. Tunjungan No. 88, Genteng",
            city: "Surabaya, Jawa Timur 60275",
            phone: "+62 813-2468-1357",
            hours: "08.00 - 22.00 WIB",
            isMain: false,
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
                                <MapPin className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Lokasi <span className="text-primary">Kami</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Kunjungi cabang {cleanStoreName} terdekat dan nikmati pengalaman kopi premium
                        </p>
                    </div>
                </div>
            </section>

            {/* Locations Grid */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {locations.map((location, idx) => (
                            <div
                                key={idx}
                                className={`group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg ${location.isMain ? "ring-2 ring-primary" : ""
                                    }`}
                            >
                                {location.isMain && (
                                    <div className="absolute top-4 right-4">
                                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                            Cabang Utama
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                </div>

                                <h3 className="font-heading text-xl font-bold mb-3">
                                    {location.name}
                                </h3>

                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex gap-2">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p>{location.address}</p>
                                            <p>{location.city}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                                        <p>{location.phone}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-foreground">Jam Operasional</p>
                                            <p>{location.hours}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                                        <a
                                            href={location.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(location.address + ", " + location.city)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Navigation className="h-4 w-4" />
                                            Petunjuk Arah
                                        </a>
                                    </Button>
                                    <Button variant="default" size="sm" className="flex-1" asChild>
                                        <a href={`tel:${location.phone.replace(/\s/g, "")}`}>
                                            Hubungi
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-heading text-3xl font-bold">
                            Belum Menemukan Lokasi Terdekat?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Kami terus berkembang! Segera hadir di kota Anda.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/kontak">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Hubungi Kami
                                </Button>
                            </Link>
                            <Link href="/menu">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Lihat Menu
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
