import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
    title: "Kontak Kami | ARCoffee",
    description: "Hubungi ARCoffee untuk pertanyaan, saran, atau kerjasama. Kami siap melayani Anda.",
};

const contactInfo = [
    {
        icon: Phone,
        title: "Telepon",
        details: ["+62 812-3456-7890", "+62 821-9876-5432"],
    },
    {
        icon: Mail,
        title: "Email",
        details: ["hello@arcoffee.com", "support@arcoffee.com"],
    },
    {
        icon: MapPin,
        title: "Alamat",
        details: ["Jl. Kopi Nikmat No. 123", "Jakarta Selatan, DKI Jakarta 12345"],
    },
    {
        icon: Clock,
        title: "Jam Operasional",
        details: ["Senin - Minggu", "08.00 - 22.00 WIB"],
    },
];

const socialMedia = [
    { icon: Instagram, name: "Instagram", handle: "@arcoffee", url: "https://instagram.com/arcoffee" },
    { icon: Facebook, name: "Facebook", handle: "ARCoffee", url: "https://facebook.com/arcoffee" },
    { icon: Twitter, name: "Twitter", handle: "@arcoffee", url: "https://twitter.com/arcoffee" },
];

export default function KontakPage() {
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
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Information */}
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-8">
                                Informasi Kontak
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <info.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{info.title}</h3>
                                            {info.details.map((detail, detailIdx) => (
                                                <p key={detailIdx} className="text-muted-foreground">
                                                    {detail}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Media */}
                            <div className="mt-12">
                                <h3 className="font-semibold mb-4">Ikuti Kami</h3>
                                <div className="flex gap-4">
                                    {socialMedia.map((social, idx) => (
                                        <a
                                            key={idx}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                            title={social.name}
                                        >
                                            <social.icon className="h-5 w-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="rounded-lg border bg-card p-8">
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
