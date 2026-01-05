import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getSettings } from "@/lib/supabase/queries";
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

// Gunakan generateMetadata untuk data dinamis
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const cleanStoreName = settings.store_name.replace(/\|/g, "");

  return {
    title: {
      default: `${cleanStoreName} - Premium Coffee Experience`,
      template: `%s | ${cleanStoreName}`,
    },
    description: settings.store_description || "Nikmati pengalaman kopi premium dengan kustomisasi sesuai selera Anda. Pesan online, ambil di tempat.",
    keywords: ["coffee", "kopi", "coffeeshop", cleanStoreName, "premium coffee"],
    authors: [{ name: cleanStoreName }],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: cleanStoreName,
    },
  };
}

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
