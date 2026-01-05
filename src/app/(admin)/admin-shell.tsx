"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Coffee,
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings,
    LogOut,
    Menu,
    X,
    Layers,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { logoutAction } from "@/actions/auth-actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
    { label: "Produk", href: "/admin/products", icon: Package },
    { label: "Opsi & Adds-on", href: "/admin/options", icon: Layers },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface AdminShellProps {
    children: React.ReactNode;
    userEmail: string;
}

export default function AdminShell({ children, userEmail }: AdminShellProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Ambil inisial dari email (misal: admin@... -> AD)
    const initials = userEmail.slice(0, 2).toUpperCase();
    const displayName = userEmail.split("@")[0]; // Tampilkan bagian depan email sebagai nama sementara

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                        <Link href="/admin" className="flex items-center gap-2">
                            <Coffee className="h-7 w-7 text-primary" />
                            <span className="font-heading text-lg font-bold text-foreground">
                                ARC<span className="text-primary">offee</span>
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== "/admin" && pathname.startsWith(link.href));

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsSidebarOpen(false)}
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

                    {/* Footer */}
                    <div className="p-4 border-t border-border">
                        <Link href="/" className="w-full block">
                            <Button variant="outline" className="w-full justify-start gap-3 text-muted-foreground">
                                <LogOut className="h-5 w-5 rotate-180" />
                                Ke Store Customer
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border flex items-center px-4 lg:px-6 justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-auto py-2 px-4 w-auto rounded-full hover:bg-muted hover:text-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-foreground capitalize">{displayName}</p>
                                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                                    </div>
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none capitalize">{displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href="/">
                                <DropdownMenuItem className="group cursor-pointer focus:bg-primary focus:text-primary-foreground">
                                    <UserCircle className="mr-2 h-4 w-4 group-focus:text-primary-foreground" />
                                    <span>Lihat Store</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="group text-destructive focus:bg-destructive focus:text-white cursor-pointer" onClick={() => logoutAction()}>
                                <LogOut className="mr-2 h-4 w-4 group-focus:text-white" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
