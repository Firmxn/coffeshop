import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// Font untuk body text - clean dan readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Font untuk heading - elegant coffee-shop vibe
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARCoffee - Premium Coffee Experience",
    template: "%s | ARCoffee",
  },
  description: "Nikmati pengalaman kopi premium dengan kustomisasi sesuai selera Anda. Pesan online, ambil di tempat.",
  keywords: ["coffee", "kopi", "coffeeshop", "ARCoffee", "premium coffee"],
  authors: [{ name: "ARCoffee" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ARCoffee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-inter)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
