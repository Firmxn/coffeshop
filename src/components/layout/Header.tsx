"use client";

import Link from "next/link";
import { useState } from "react";
import { Coffee, Menu, ShoppingBag, Package, Home, UtensilsCrossed, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { usePathname } from "next/navigation";

// Link navigasi utama dengan icon
const navLinks = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Menu", href: "/menu", icon: UtensilsCrossed },
    { label: "Tentang", href: "/tentang", icon: Info },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Coffee className="h-7 w-7 text-primary" />
                    <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                        ARC<span className="text-red-600">offee</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Track Order Button - Desktop */}
                    <Link href="/track" className="hidden md:block">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Package className="h-4 w-4" />
                            Lacak
                        </Button>
                    </Link>

                    {/* Cart Button */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <Badge
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    variant="default"
                                >
                                    {totalItems > 99 ? "99+" : totalItems}
                                </Badge>
                            )}
                            <span className="sr-only">Keranjang belanja</span>
                        </Button>
                    </Link>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Mobile Menu Toggle */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] p-0">
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <SheetHeader className="border-b border-border px-6 py-4">
                                    <SheetTitle className="flex items-center gap-2">
                                        <Coffee className="h-6 w-6 text-primary" />
                                        <span className="font-heading text-foreground">ARC<span className="text-red-600">offee</span></span>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Navigation Links */}
                                <nav className="flex-1 p-4 space-y-2">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href ||
                                            (link.href !== "/" && pathname.startsWith(link.href));

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                            >
                                                <link.icon className="h-5 w-5" />
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Footer Actions */}
                                <div className="p-4 border-t border-border space-y-2">
                                    <Link href="/track" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start gap-3">
                                            <Package className="h-5 w-5" />
                                            Lacak Pesanan
                                        </Button>
                                    </Link>
                                    <Link href="/cart" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="default" className="w-full justify-start gap-3">
                                            <ShoppingBag className="h-5 w-5" />
                                            Keranjang {totalItems > 0 && `(${totalItems})`}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
