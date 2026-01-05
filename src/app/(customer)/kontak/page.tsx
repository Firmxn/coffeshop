import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSettings } from "@/lib/supabase/queries";
import Link from "next/link"; // Added Link import

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    return {
        title: "Kontak Kami",
        description: `Hubungi ${cleanStoreName} untuk pertanyaan, saran, atau kerjasama. Kami siap melayani Anda.`,
    };
}

export default async function ContactPage() {
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    const contactMethods = [
        {
            icon: Phone,
            title: "Telepon & WhatsApp",
            details: [settings.phone],
            action: "Hubungi Sekarang",
            href: `tel:${settings.phone}`,
        },
        {
            icon: Mail,
            title: "Email",
            details: [settings.email],
            action: "Kirim Email",
            href: `mailto:${settings.email}`,
        },
        {
            icon: MapPin,
            title: "Lokasi",
            details: [settings.address, `${settings.city}, ${settings.postal_code}`],
            action: "Lihat di Maps",
            href: settings.google_maps_url || "#",
            target: "_blank",
        },
        {
            icon: Clock,
            title: "Jam Operasional",
            details: [settings.operating_hours_text],
            action: "Lihat Status",
            href: "#",
        },
    ];

    const socialMedia = [
        { icon: Instagram, name: "Instagram", url: settings.instagram_url },
        { icon: Facebook, name: "Facebook", url: settings.facebook_url },
        { icon: Twitter, name: "Twitter", url: settings.twitter_url },
    ].filter(social => social.url); // Only show if URL exists

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            {/* Hero Section */}
            <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Hubungi <span className="text-primary">Kami</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Kami senang mendengar dari Anda. Kirimkan pertanyaan, saran, atau feedback Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-12 lg:gap-16">
                        {/* Contact Information Cards */}
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
                                Informasi Kontak
                            </h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {contactMethods.map((info, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center rounded-2xl bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50"
                                    >
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            <info.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-heading text-lg font-bold">{info.title}</h3>
                                        <div className="mb-6 space-y-1 text-muted-foreground line-clamp-2">
                                            {info.details.map((detail, detailIdx) => (
                                                <p key={detailIdx}>{detail}</p>
                                            ))}
                                        </div>
                                        <Button variant="outline" className="mt-auto w-full" asChild>
                                            <Link href={info.href} target={info.target ? info.target : undefined}>
                                                {info.action}
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media & Form Grid */}
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                            {/* Social Media Side */}
                            <div className="flex flex-col justify-center h-full">
                                {socialMedia.length > 0 && (
                                    <div className="text-center lg:text-left">
                                        <h2 className="font-heading text-2xl font-bold mb-6">
                                            Ikuti Kami
                                        </h2>
                                        <p className="text-muted-foreground mb-8">
                                            Temukan kami di media sosial untuk update terbaru,
                                            promo spesial, dan cerita di balik setiap cangkir kopi kami.
                                        </p>
                                        <div className="flex justify-center lg:justify-start gap-4">
                                            {socialMedia.map((social, idx) => (
                                                <a
                                                    key={idx}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 rounded-full bg-muted/30 hover:bg-primary hover:text-primary-foreground transition-colors group"
                                                    aria-label={social.name}
                                                >
                                                    <social.icon className="h-6 w-6" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Form */}
                            <div className="rounded-lg border bg-card p-8 shadow-sm">
                                <h2 className="font-heading text-2xl font-bold mb-6">
                                    Kirim Pesan
                                </h2>
                                <form className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input id="name" placeholder="John Doe" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                                        <Input id="phone" type="tel" placeholder="+62 812-3456-7890" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subjek</Label>
                                        <Input id="subject" placeholder="Perihal pesan Anda" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Pesan</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tulis pesan Anda di sini..."
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" size="lg" className="w-full">
                                        Kirim Pesan
                                    </Button>
                                    <p className="text-sm text-muted-foreground text-center">
                                        Kami akan merespons dalam 1-2 hari kerja
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section (Placeholder) */}
            <section className="border-t border-border bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="font-heading text-3xl font-bold text-center mb-8">
                        Lokasi Kami
                    </h2>
                    <div className="mx-auto max-w-4xl rounded-lg border bg-card overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Peta lokasi akan ditampilkan di sini
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
