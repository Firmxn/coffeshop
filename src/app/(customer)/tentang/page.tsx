import { Metadata } from "next";
import { Coffee, MapPin, Clock, Phone, Mail, Heart, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Tentang Kami",
    description: "Kenali ARCoffee lebih dekat. Coffeeshop lokal dengan kopi premium dan pengalaman terbaik.",
};

// Nilai-nilai kami
const values = [
    {
        icon: Heart,
        title: "Passion",
        description: "Setiap cangkir dibuat dengan cinta dan dedikasi tinggi terhadap kopi.",
    },
    {
        icon: Award,
        title: "Kualitas",
        description: "Hanya menggunakan biji kopi arabica pilihan dari petani lokal Indonesia.",
    },
    {
        icon: Users,
        title: "Komunitas",
        description: "Membangun hubungan erat dengan pelanggan dan masyarakat sekitar.",
    },
];

// Info kontak
const contactInfo = [
    {
        icon: MapPin,
        label: "Alamat",
        value: "Jl. Kopi Nikmat No. 123, Jakarta Selatan",
    },
    {
        icon: Clock,
        label: "Jam Operasional",
        value: "Setiap hari, 07:00 - 22:00 WIB",
    },
    {
        icon: Phone,
        label: "Telepon",
        value: "(021) 123-4567",
    },
    {
        icon: Mail,
        label: "Email",
        value: "hello@arcoffee.id",
    },
];

export default function TentangPage() {
    return (
        <div className="py-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-3xl">
                        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Coffee className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="font-heading text-4xl font-bold md:text-5xl">
                            Tentang <span className="text-primary">ARCoffee</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                            ARCoffee adalah coffeeshop lokal yang lahir dari kecintaan mendalam
                            terhadap kopi Indonesia. Kami percaya bahwa setiap cangkir kopi
                            memiliki cerita, dan kami hadir untuk membuat momen ngopi Anda
                            menjadi lebih bermakna.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Image Placeholder */}
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Coffee className="h-32 w-32 text-primary/30" />
                        </div>

                        {/* Story Content */}
                        <div>
                            <h2 className="font-heading text-3xl font-bold">Cerita Kami</h2>
                            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Berawal dari sebuah mimpi kecil di tahun 2020, ARCoffee didirikan
                                    oleh sekelompok pecinta kopi yang ingin menghadirkan pengalaman
                                    ngopi yang berbeda di tengah hiruk-pikuk kota.
                                </p>
                                <p>
                                    Kami bekerja sama langsung dengan petani kopi dari berbagai
                                    daerah di Indonesia - dari Aceh, Toraja, hingga Papua - untuk
                                    memastikan setiap biji yang kami sajikan memiliki kualitas terbaik
                                    dan mendukung kesejahteraan petani lokal.
                                </p>
                                <p>
                                    Dengan barista yang terlatih dan menu yang dapat dikustomisasi
                                    sesuai selera, kami berkomitmen untuk memberikan pengalaman
                                    yang personal dan memorable di setiap kunjungan Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold">Nilai-Nilai Kami</h2>
                        <p className="mt-2 text-muted-foreground">
                            Prinsip yang kami pegang teguh dalam setiap cangkir kopi
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl bg-card border border-border transition-all hover:shadow-lg hover:border-primary/20"
                            >
                                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <value.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-heading text-xl font-semibold">
                                    {value.title}
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold">Kunjungi Kami</h2>
                        <p className="mt-2 text-muted-foreground">
                            Datang dan nikmati kopi terbaik bersama kami
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <info.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{info.label}</p>
                                        <p className="font-medium">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center rounded-3xl gradient-coffee p-8 md:p-16 text-primary-foreground">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Siap Mencoba?
                        </h2>
                        <p className="mt-4 text-primary-foreground/80 max-w-md mx-auto">
                            Pesan sekarang dan rasakan pengalaman kopi yang berbeda.
                        </p>
                        <Link href="/menu" className="mt-8 inline-block">
                            <Button size="lg" variant="secondary">
                                Lihat Menu Kami
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
