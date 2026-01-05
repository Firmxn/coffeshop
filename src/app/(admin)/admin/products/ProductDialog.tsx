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
} from "@/actions/product-actions";
import { productSchema, ProductFormData } from "@/lib/schemas";
import { Category } from "@/types";

interface ProductDialogProps {
    categories: Category[];
    productToEdit?: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
        category_id: string; // use DB naming or mapped? Lets assume mapped prop passed is DB-like or handled
        image?: string | null;
        is_available: boolean;
    };
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ProductDialog({
    categories,
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

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any, // Cast to any to handle coercion types
        defaultValues: {
            name: productToEdit?.name || "",
            description: productToEdit?.description || "",
            price: productToEdit?.price || 0,
            category_id: productToEdit?.category_id || (categories[0]?.id || ""),
            image: productToEdit?.image || "",
            is_available: productToEdit ? productToEdit.is_available : true,
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            let result;
            if (productToEdit) {
                result = await updateProduct(productToEdit.id, data);
            } else {
                result = await createProduct(data);
            }

            if (result.success) {
                toast.success(
                    productToEdit
                        ? "Produk berhasil diperbarui"
                        : "Produk berhasil ditambahkan"
                );
                setOpen(false);
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {productToEdit ? "Edit Produk" : "Tambah Produk Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        Isi detail produk di bawah ini. Klik simpan setelah selesai.
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
                            {form.formState.errors.category_id && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.category_id.message}
                                </p>
                            )}
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

                    <div className="grid gap-2">
                        <Label htmlFor="image">URL Gambar</Label>
                        <Input
                            id="image"
                            {...form.register("image")}
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                            *Masukkan URL gambar eksternal (sementara)
                        </p>
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
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
