"use client";

import { Settings, Bell, Palette, Store, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Daftar pengaturan yang akan tersedia
const settingsSections = [
    {
        icon: Store,
        title: "Informasi Toko",
        description: "Nama toko, alamat, jam operasional, dan kontak",
        status: "coming-soon",
    },
    {
        icon: Palette,
        title: "Tampilan",
        description: "Tema warna, logo, dan branding",
        status: "coming-soon",
    },
    {
        icon: Bell,
        title: "Notifikasi",
        description: "Pengaturan notifikasi pesanan masuk",
        status: "coming-soon",
    },
    {
        icon: Database,
        title: "Database",
        description: "Koneksi Supabase dan sinkronisasi data",
        status: "coming-soon",
    },
];

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-bold md:text-3xl">Pengaturan</h1>
                <p className="text-muted-foreground">Konfigurasi aplikasi ARCoffee</p>
            </div>

            {/* Settings List */}
            <div className="space-y-4">
                {settingsSections.map((section, index) => (
                    <Card key={index} className="opacity-60">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <section.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="secondary">Coming Soon</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Separator />

            {/* App Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Informasi Aplikasi
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Versi</span>
                        <span className="font-mono">0.1.0-dev</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Framework</span>
                        <span>Next.js 16</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">UI Library</span>
                        <span>shadcn/ui + Tailwind CSS</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Database</span>
                        <span className="text-yellow-500">Belum terhubung (localStorage)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
