"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Store, Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter, Globe, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings, type SettingsFormData } from "@/actions/settings-actions";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
    store_name: z.string().min(1, "Nama toko wajib diisi"),
    store_tagline: z.string().min(1, "Tagline wajib diisi"),
    store_description: z.string().min(1, "Deskripsi wajib diisi"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    email: z.string().email("Email tidak valid"),
    address: z.string().min(1, "Alamat wajib diisi"),
    city: z.string().min(1, "Kota wajib diisi"),
    postal_code: z.string().min(1, "Kode pos wajib diisi"),
    operating_hours_text: z.string().min(1, "Jam operasional wajib diisi"),
    instagram_url: z.string().url("URL Instagram tidak valid").optional().or(z.literal("")),
    facebook_url: z.string().url("URL Facebook tidak valid").optional().or(z.literal("")),
    twitter_url: z.string().url("URL Twitter tidak valid").optional().or(z.literal("")),
    google_maps_url: z.string().url("URL Google Maps tidak valid").optional().or(z.literal("")),
    google_maps_embed_url: z.string().optional(),
    whatsapp_number: z.string().optional(),
    about_hero: z.string().optional(),
    about_story: z.string().optional(),
});

interface SettingsFormProps {
    initialData: any;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema) as any,
        defaultValues: {
            store_name: initialData.store_name || "",
            store_tagline: initialData.store_tagline || "",
            store_description: initialData.store_description || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
            address: initialData.address || "",
            city: initialData.city || "",
            postal_code: initialData.postal_code || "",
            operating_hours_text: initialData.operating_hours_text || "",
            instagram_url: initialData.instagram_url || "",
            facebook_url: initialData.facebook_url || "",
            twitter_url: initialData.twitter_url || "",
            google_maps_url: initialData.google_maps_url || "",
            google_maps_embed_url: initialData.google_maps_embed_url || "",
            whatsapp_number: initialData.whatsapp_number || "",
            about_hero: initialData.about_hero || "",
            about_story: initialData.about_story || "",
        },
    });

    const onSubmit = async (data: SettingsFormData) => {
        setIsSubmitting(true);

        try {
            // Extract src from iframe code if user pasted full code
            let processedData = { ...data };
            if (processedData.google_maps_embed_url && processedData.google_maps_embed_url.includes("<iframe")) {
                const match = processedData.google_maps_embed_url.match(/src="([^"]+)"/);
                if (match && match[1]) {
                    processedData.google_maps_embed_url = match[1];
                }
            }

            const result = await updateSettings(processedData);

            if (result.success) {
                toast({
                    title: "Berhasil",
                    description: "Pengaturan toko berhasil diperbarui",
                });
            } else {
                toast({
                    title: "Gagal",
                    description: result.error || "Terjadi kesalahan saat menyimpan",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Terjadi kesalahan yang tidak terduga",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informasi Toko */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Informasi Toko
                    </CardTitle>
                    <CardDescription>
                        Informasi dasar tentang toko Anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="store_name">Nama Toko</Label>
                            <Input
                                id="store_name"
                                {...register("store_name")}
                                placeholder="ARCoffee"
                            />
                            {errors.store_name && (
                                <p className="text-sm text-destructive">{errors.store_name.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Gunakan tanda pipa (|) untuk membedakan warna teks (contoh: ARC|offee).
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="store_tagline">Tagline</Label>
                            <Input
                                id="store_tagline"
                                {...register("store_tagline")}
                                placeholder="Kopi Premium, Sesuai Seleramu"
                            />
                            {errors.store_tagline && (
                                <p className="text-sm text-destructive">{errors.store_tagline.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Gunakan tanda pipa (|) untuk membuat highlight warna pada teks (contoh: Kopi Premium | Sesuai Seleramu).
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="store_description">Deskripsi</Label>
                        <Textarea
                            id="store_description"
                            {...register("store_description")}
                            placeholder="Nikmati pengalaman kopi premium..."
                            rows={3}
                        />
                        {errors.store_description && (
                            <p className="text-sm text-destructive">{errors.store_description.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Kontak */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Informasi Kontak
                    </CardTitle>
                    <CardDescription>
                        Cara pelanggan menghubungi Anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Telepon
                            </Label>
                            <Input
                                id="phone"
                                {...register("phone")}
                                placeholder="+62 812-3456-7890"
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="hello@arcoffee.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp (Opsional)
                        </Label>
                        <Input
                            id="whatsapp_number"
                            {...register("whatsapp_number")}
                            placeholder="+62 812-3456-7890"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Alamat */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Alamat Toko
                    </CardTitle>
                    <CardDescription>
                        Lokasi fisik toko Anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Input
                            id="address"
                            {...register("address")}
                            placeholder="Jl. Kopi Nikmat No. 123"
                        />
                        {errors.address && (
                            <p className="text-sm text-destructive">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="city">Kota</Label>
                            <Input
                                id="city"
                                {...register("city")}
                                placeholder="Jakarta Selatan"
                            />
                            {errors.city && (
                                <p className="text-sm text-destructive">{errors.city.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Kode Pos</Label>
                            <Input
                                id="postal_code"
                                {...register("postal_code")}
                                placeholder="12345"
                            />
                            {errors.postal_code && (
                                <p className="text-sm text-destructive">{errors.postal_code.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="google_maps_url" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Google Maps URL (Opsional)
                        </Label>
                        <Input
                            id="google_maps_url"
                            {...register("google_maps_url")}
                            placeholder="https://maps.google.com/..."
                        />
                        {errors.google_maps_url && (
                            <p className="text-sm text-destructive">{errors.google_maps_url.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="google_maps_embed_url" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Google Maps Embed Code (Untuk Peta Website)
                        </Label>
                        <Textarea
                            id="google_maps_embed_url"
                            {...register("google_maps_embed_url")}
                            placeholder='Paste kode iframe di sini: <iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                            rows={3}
                            className="font-mono text-xs break-all"
                        />
                        {errors.google_maps_embed_url && (
                            <p className="text-sm text-destructive">{errors.google_maps_embed_url.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Cara dapat: Buka Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy HTML. Paste semuanya di sini.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Jam Operasional */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Jam Operasional
                    </CardTitle>
                    <CardDescription>
                        Waktu buka toko
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="operating_hours_text">Jam Operasional</Label>
                        <Input
                            id="operating_hours_text"
                            {...register("operating_hours_text")}
                            placeholder="Setiap hari, 08:00 - 22:00 WIB"
                        />
                        {errors.operating_hours_text && (
                            <p className="text-sm text-destructive">{errors.operating_hours_text.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Contoh: "Senin - Jumat: 08:00 - 22:00, Sabtu - Minggu: 09:00 - 23:00"
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Halaman Tentang Kami */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Halaman Tentang Kami
                    </CardTitle>
                    <CardDescription>
                        Konten untuk halaman Tentang Kami
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="about_hero">Deskripsi Hero</Label>
                        <Textarea
                            id="about_hero"
                            {...register("about_hero")}
                            placeholder="Deskripsi singkat di bawah judul halaman Tentang Kami"
                            rows={3}
                        />
                        {errors.about_hero && (
                            <p className="text-sm text-destructive">{errors.about_hero.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="about_story">Cerita Kami</Label>
                        <Textarea
                            id="about_story"
                            {...register("about_story")}
                            placeholder="Ceritakan sejarah dan perjalanan toko Anda. Gunakan baris baru untuk membuat paragraf."
                            rows={10}
                        />
                        {errors.about_story && (
                            <p className="text-sm text-destructive">{errors.about_story.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Tip: Tekan Enter 2x untuk membuat paragraf baru.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
                <CardHeader>
                    <CardTitle>Media Sosial</CardTitle>
                    <CardDescription>
                        Link ke akun media sosial toko (opsional)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="instagram_url" className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Instagram
                        </Label>
                        <Input
                            id="instagram_url"
                            {...register("instagram_url")}
                            placeholder="https://instagram.com/example"
                        />
                        {errors.instagram_url && (
                            <p className="text-sm text-destructive">{errors.instagram_url.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="facebook_url" className="flex items-center gap-2">
                            <Facebook className="h-4 w-4" />
                            Facebook
                        </Label>
                        <Input
                            id="facebook_url"
                            {...register("facebook_url")}
                            placeholder="https://facebook.com/example"
                        />
                        {errors.facebook_url && (
                            <p className="text-sm text-destructive">{errors.facebook_url.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="twitter_url" className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter / X
                        </Label>
                        <Input
                            id="twitter_url"
                            {...register("twitter_url")}
                            placeholder="https://twitter.com/example"
                        />
                        {errors.twitter_url && (
                            <p className="text-sm text-destructive">{errors.twitter_url.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>
        </form>
    );
}
