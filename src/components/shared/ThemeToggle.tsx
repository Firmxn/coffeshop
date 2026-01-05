"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tombol toggle dark/light mode
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hindari hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 transition-transform hover:rotate-45" />
            ) : (
                <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />
            )}
            <span className="sr-only">Toggle tema</span>
        </Button>
    );
}
