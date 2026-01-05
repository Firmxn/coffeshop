"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Provider untuk tema (light/dark mode)
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
