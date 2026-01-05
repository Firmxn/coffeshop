"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyOrderButton({ orderId }: { orderId: string }) {
    const [copied, setCopied] = useState(false);

    const copyOrderId = async () => {
        await navigator.clipboard.writeText(orderId);
        setCopied(true);
        toast.success("Order ID disalin!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="outline" size="sm" onClick={copyOrderId}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
    );
}
