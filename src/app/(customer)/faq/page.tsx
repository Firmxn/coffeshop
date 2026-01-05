import { Metadata } from "next";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Coffee, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "FAQ - Pertanyaan Umum | ARCoffee",
    description: "Temukan jawaban untuk pertanyaan umum tentang ARCoffee, menu, pemesanan, dan layanan kami.",
};

const faqs = [
    {
        category: "Pemesanan",
        items: [
            {
                question: "Bagaimana cara memesan di ARCoffee?",
                answer: "Anda dapat memesan melalui website kami dengan memilih menu, menambahkan ke keranjang, dan melakukan checkout. Kami juga menerima pemesanan langsung di toko.",
            },
            {
                question: "Apakah bisa pesan untuk take away?",
                answer: "Ya, semua menu kami tersedia untuk take away. Pilih opsi 'Take Away' saat checkout.",
            },
            {
                question: "Berapa lama waktu pembuatan pesanan?",
                answer: "Rata-rata waktu pembuatan adalah 5-10 menit tergantung kompleksitas pesanan dan antrian.",
            },
        ],
    },
    {
        category: "Menu & Kustomisasi",
        items: [
            {
                question: "Apakah bisa request custom menu?",
                answer: "Tentu! Anda bisa kustomisasi level gula, es, dan menambahkan topping sesuai selera saat memesan.",
            },
            {
                question: "Apakah ada menu untuk vegetarian/vegan?",
                answer: "Ya, kami memiliki beberapa pilihan menu non-dairy dan vegan. Cek bagian menu untuk detail lebih lanjut.",
            },
            {
                question: "Apakah biji kopi yang digunakan?",
                answer: "Kami menggunakan biji kopi premium dari berbagai daerah di Indonesia, termasuk Aceh Gayo, Toraja, dan Bali Kintamani.",
            },
        ],
    },
    {
        category: "Pembayaran",
        items: [
            {
                question: "Metode pembayaran apa saja yang diterima?",
                answer: "Kami menerima pembayaran tunai, kartu debit/kredit, dan e-wallet (GoPay, OVO, Dana, ShopeePay).",
            },
            {
                question: "Apakah ada biaya tambahan?",
                answer: "Tidak ada biaya tambahan untuk pemesanan di toko. Untuk delivery, akan ada biaya pengiriman sesuai jarak.",
            },
        ],
    },
    {
        category: "Lainnya",
        items: [
            {
                question: "Apakah ARCoffee buka setiap hari?",
                answer: "Ya, kami buka setiap hari dari pukul 08.00 - 22.00 WIB.",
            },
            {
                question: "Apakah ada program loyalitas?",
                answer: "Saat ini kami sedang mengembangkan program loyalitas untuk pelanggan setia. Stay tuned!",
            },
            {
                question: "Bagaimana cara memberikan feedback?",
                answer: "Anda bisa menghubungi kami melalui halaman Kontak atau media sosial kami. Kami sangat menghargai setiap masukan!",
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            {/* Hero Section */}
            <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <MessageCircle className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Pertanyaan Umum
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang ARCoffee
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl space-y-12">
                        {faqs.map((category, idx) => (
                            <div key={idx}>
                                <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                                    {category.category}
                                </h2>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {category.items.map((faq, faqIdx) => (
                                        <AccordionItem
                                            key={faqIdx}
                                            value={`item-${idx}-${faqIdx}`}
                                            className="rounded-lg border bg-card px-6"
                                        >
                                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <Coffee className="mx-auto h-12 w-12 text-primary" />
                        <h2 className="mt-6 font-heading text-3xl font-bold">
                            Masih Ada Pertanyaan?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami!
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
