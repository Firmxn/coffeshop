"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOption, updateOption } from "@/actions/option-actions";
import { optionSchema, OptionFormData } from "@/lib/schemas";
import type { Option as DbOption } from "@/lib/supabase/types";

interface OptionDialogProps {
    trigger?: React.ReactNode;
    optionToEdit?: DbOption;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

const OPTION_GROUPS = [
    { value: "size", label: "Ukuran (Size)" },
    { value: "ice", label: "Es (Ice)" },
    { value: "sugar", label: "Gula (Sugar)" },
    { value: "addon", label: "Tambahan (Add-on)" },
];

export function OptionDialog({
    trigger,
    optionToEdit,
    onSuccess,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: OptionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
        if (setControlledOpen) {
            setControlledOpen(value);
        } else {
            setInternalOpen(value);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OptionFormData>({
        resolver: zodResolver(optionSchema) as any,
        defaultValues: {
            group_name: (optionToEdit?.group_name as any) || "addon",
            name: optionToEdit?.name || "",
            extra_price: optionToEdit?.extra_price || 0,
        },
    });

    const onSubmit = async (data: OptionFormData) => {
        setIsSubmitting(true);
        try {
            let result;
            if (optionToEdit) {
                result = await updateOption(optionToEdit.id, data);
            } else {
                result = await createOption(data);
            }

            if (result.success) {
                toast.success(
                    optionToEdit
                        ? "Opsi berhasil diperbarui"
                        : "Opsi berhasil ditambahkan"
                );
                setOpen(false);
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {optionToEdit ? "Edit Opsi" : "Tambah Opsi Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        Kelola pilihan tambahan untuk produk Anda.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="group_name">Grup Opsi</Label>
                        <Select
                            onValueChange={(val: any) => form.setValue("group_name", val)}
                            defaultValue={form.getValues("group_name")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih grup" />
                            </SelectTrigger>
                            <SelectContent>
                                {OPTION_GROUPS.map((group) => (
                                    <SelectItem key={group.value} value={group.value}>
                                        {group.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.group_name && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.group_name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Opsi</Label>
                        <Input
                            id="name"
                            {...form.register("name")}
                            placeholder="Contoh: Extra Shot, Less Sugar"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="extra_price">Harga Tambahan (Rp)</Label>
                        <Input
                            id="extra_price"
                            type="number"
                            min="0"
                            step="100"
                            {...form.register("extra_price")}
                        />
                        <p className="text-xs text-muted-foreground">
                            Masukkan 0 jika gratis.
                        </p>
                        {form.formState.errors.extra_price && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.extra_price.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
