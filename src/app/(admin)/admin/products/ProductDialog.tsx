"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    createProduct,
    updateProduct,
    uploadProductImage,
} from "@/actions/product-actions";
import { productSchema, ProductFormData } from "@/lib/schemas";
import { Category } from "@/types";
import { Option as DbOption } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";

interface ProductDialogProps {
    categories: Category[];
    options?: DbOption[]; // Available master options
    productToEdit?: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
        category_id: string;
        image?: string | null;
        is_available: boolean;
        option_ids?: string[];
    };
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

const GROUP_LABELS: Record<string, string> = {
    size: "Ukuran (Size)",
    ice: "Es (Ice)",
    sugar: "Gula (Sugar)",
    addon: "Topping / Add-on",
};

export function ProductDialog({
    categories,
    options,
    productToEdit,
    trigger,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess,
}: ProductDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
        if (isControlled) {
            if (setControlledOpen) setControlledOpen(value);
        } else {
            setInternalOpen(value);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: productToEdit?.name || "",
            description: productToEdit?.description || "",
            price: productToEdit?.price || 0,
            category_id: productToEdit?.category_id || (categories[0]?.id || ""),
            image: productToEdit?.image || "",
            is_available: productToEdit ? productToEdit.is_available : true,
            options: productToEdit?.option_ids || [],
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            let imageUrl = data.image;

            // Jika user memilih file baru, upload dulu
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await uploadProductImage(formData);
                if (!uploadRes.success || !uploadRes.url) {
                    throw new Error(uploadRes.error || "Gagal mengupload gambar");
                }
                imageUrl = uploadRes.url;
            }

            // Update URL image di payload data
            const productData = { ...data, image: imageUrl };

            let result;
            if (productToEdit) {
                result = await updateProduct(productToEdit.id, productData);
            } else {
                result = await createProduct(productData);
            }

            if (result.success) {
                toast.success(
                    productToEdit
                        ? "Produk berhasil diperbarui"
                        : "Produk berhasil ditambahkan"
                );
                setOpen(false);
                form.reset();
                setSelectedFile(null);
                setFilePreview(null);
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group options for display
    const groupedOptions = (options || []).reduce((acc, opt) => {
        const group = opt.group_name;
        if (!acc[group]) acc[group] = [];
        acc[group].push(opt);
        return acc;
    }, {} as Record<string, DbOption[]>);

    // Order groups: size, sugar, ice, addon
    const groupOrder = ["size", "sugar", "ice", "addon"];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {productToEdit ? "Edit Produk" : "Tambah Produk Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        Isi detail produk dan opsi yang tersedia.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input id="name" {...form.register("name")} placeholder="Contoh: Kopi Susu Aren" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input
                                id="price"
                                type="number"
                                {...form.register("price")}
                            />
                            {form.formState.errors.price && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.price.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                                onValueChange={(val) => form.setValue("category_id", val)}
                                defaultValue={form.getValues("category_id")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Jelaskan rasa dan komposisi produk..."
                        />
                    </div>

                    {/* Options Selection */}
                    {options && options.length > 0 && (
                        <div className="grid gap-2">
                            <Label>Opsi & Add-ons Tersedia</Label>
                            <div className="border rounded-md p-4 max-h-[250px] overflow-y-auto space-y-4 bg-muted/20">
                                {groupOrder.map((groupKey) => {
                                    const opts = groupedOptions[groupKey];
                                    if (!opts || opts.length === 0) return null;

                                    return (
                                        <div key={groupKey}>
                                            <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-10 w-full border-b">
                                                {GROUP_LABELS[groupKey] || groupKey}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {opts.map((opt) => (
                                                    <div key={opt.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`opt-${opt.id}`}
                                                            checked={form.watch("options")?.includes(opt.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = form.getValues("options") || [];
                                                                if (checked) {
                                                                    form.setValue("options", [...current, opt.id]);
                                                                } else {
                                                                    form.setValue("options", current.filter((id) => id !== opt.id));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={`opt-${opt.id}`} className="text-sm cursor-pointer font-normal flex justify-between w-full">
                                                            <span>{opt.name}</span>
                                                            {opt.extra_price > 0 && (
                                                                <span className="text-muted-foreground text-xs ml-1">
                                                                    +{formatPrice(opt.extra_price)}
                                                                </span>
                                                            )}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Centang opsi yang bisa dipilih customer untuk produk ini.</p>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Gambar Produk</Label>

                        {/* Preview Area */}
                        {(filePreview || form.watch("image")) && (
                            <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={filePreview || form.watch("image") || ""}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="file-upload" className="text-xs text-muted-foreground">Upload Gambar Baru</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setSelectedFile(file);
                                        setFilePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="image" className="text-xs text-muted-foreground">Atau masukkan URL Manual</Label>
                            <Input
                                id="image"
                                {...form.register("image")}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_available"
                            checked={form.watch("is_available")}
                            onCheckedChange={(checked) =>
                                form.setValue("is_available", checked as boolean)
                            }
                        />
                        <Label htmlFor="is_available">Tersedia untuk dipesan</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Produk
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
