"use client";

import Link from "next/link";
import { useState } from "react";
import { Coffee, Menu, ShoppingBag, Package } from "lucide-react";
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

// Link navigasi utama
const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Tentang", href: "/tentang" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Coffee className="h-7 w-7 text-primary" />
                    <span className="font-heading text-xl font-bold tracking-tight">
                        AR<span className="text-accent">Coffee</span>
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
                        <SheetContent side="right" className="w-[280px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Coffee className="h-6 w-6 text-primary" />
                                    <span className="font-heading">ARCoffee</span>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center py-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
