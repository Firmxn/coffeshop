"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter logic
    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (GROUP_LABELS[opt.group_name] || opt.group_name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredOptions.slice(startIndex, endIndex);

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
                            <TableHead className="py-6 pl-6">Nama Opsi</TableHead>
                            <TableHead className="py-6">Grup</TableHead>
                            <TableHead className="py-6">Harga Tambahan</TableHead>
                            <TableHead className="text-right py-6 pr-6 w-[120px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground py-6">
                                    Tidak ada data opsi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentData.map((opt) => (
                                <TableRow key={opt.id}>
                                    <TableCell className="font-medium py-6 pl-6">{opt.name}</TableCell>
                                    <TableCell className="py-6">
                                        <Badge variant="secondary" className="capitalize">
                                            {GROUP_LABELS[opt.group_name] || opt.group_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-6">{opt.extra_price > 0 ? formatPrice(opt.extra_price) : "Gratis"}</TableCell>
                                    <TableCell className="text-right py-6 pr-6">
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

            {/* Pagination Controls */}
            {filteredOptions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Baris per halaman:</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(val) => {
                                setItemsPerPage(Number(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[80px]">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 50, 100].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>
                            {startIndex + 1}-{Math.min(endIndex, filteredOptions.length)} dari {filteredOptions.length}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
