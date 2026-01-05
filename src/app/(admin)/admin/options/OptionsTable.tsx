"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { deleteOption } from "@/actions/option-actions";
import { OptionDialog } from "./OptionDialog";
import { toast } from "sonner";
import type { Option as DbOption } from "@/lib/supabase/types";

const GROUP_LABELS: Record<string, string> = {
    size: "Ukuran",
    ice: "Es",
    sugar: "Gula",
    addon: "Add-on",
};

interface OptionsTableProps {
    options: DbOption[];
}

export default function OptionsTable({ options }: OptionsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Filter logic
    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (GROUP_LABELS[opt.group_name] || opt.group_name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus opsi "${name}"?`)) return;
        setIsDeleting(id);
        const res = await deleteOption(id);
        setIsDeleting(null);
        if (res.success) toast.success("Opsi dihapus");
        else toast.error(res.error);
    }

    return (
        <div className="space-y-4">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari opsi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <OptionDialog
                    trigger={
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Tambah Opsi
                        </Button>
                    }
                />
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Opsi</TableHead>
                            <TableHead>Grup</TableHead>
                            <TableHead>Harga Tambahan</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data opsi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOptions.map((opt) => (
                                <TableRow key={opt.id}>
                                    <TableCell className="font-medium">{opt.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {GROUP_LABELS[opt.group_name] || opt.group_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{opt.extra_price > 0 ? formatPrice(opt.extra_price) : "Gratis"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <OptionDialog
                                                optionToEdit={opt}
                                                trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(opt.id, opt.name)}
                                                disabled={isDeleting === opt.id}
                                            >
                                                {isDeleting === opt.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
