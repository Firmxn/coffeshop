import Link from "next/link";
import { Coffee, Instagram, Facebook, Twitter } from "lucide-react";
import { getSettings } from "@/lib/supabase/queries";

// Link footer
const footerLinks = {
    menu: [
        { label: "Kopi", href: "/menu?category=kopi" },
        { label: "Non-Kopi", href: "/menu?category=non-kopi" },
        { label: "Makanan", href: "/menu?category=makanan" },
    ],
    company: [
        { label: "Tentang Kami", href: "/tentang" },
        { label: "Lokasi", href: "/lokasi" },
        { label: "Karir", href: "/karir" },
    ],
    support: [
        { label: "FAQ", href: "/faq" },
        { label: "Kontak", href: "/kontak" },
        { label: "Kebijakan Privasi", href: "/privasi" },
    ],
};

export default async function Footer() {
    const currentYear = new Date().getFullYear();
    const settings = await getSettings();
    const cleanStoreName = settings.store_name.replace(/\|/g, "");

    // Build social links from settings
    const socialLinks = [
        { icon: Instagram, href: settings.instagram_url || "#", label: "Instagram" },
        { icon: Facebook, href: settings.facebook_url || "#", label: "Facebook" },
        { icon: Twitter, href: settings.twitter_url || "#", label: "Twitter" },
    ].filter(link => link.href !== "#"); // Only show if URL exists

    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Coffee className="h-8 w-8 text-primary" />
                            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                                {settings.store_name.split('|')[0]}
                                <span className="text-primary">{settings.store_name.split('|')[1] || ""}</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                            {settings.store_description}
                        </p>
                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="mt-6 flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <social.icon className="h-5 w-5" />
                                        <span className="sr-only">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Menu Links */}
                    <div>
                        <h3 className="font-heading text-lg font-semibold">Menu</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.menu.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-heading text-lg font-semibold">Perusahaan</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-heading text-lg font-semibold">Bantuan</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} {cleanStoreName}. Semua hak dilindungi.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Dibuat dengan ☕ di Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
