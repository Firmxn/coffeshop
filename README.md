# ARCoffee

ARCoffee adalah aplikasi coffee shop berbasis Next.js yang menyediakan pengalaman pemesanan untuk pelanggan sekaligus panel admin untuk mengelola menu, pesanan, opsi kustomisasi, dan pengaturan toko. Aplikasi menggunakan Supabase sebagai backend (auth + database) dengan dukungan mock data untuk pengembangan lokal.

## Fitur Utama

### Pelanggan
- Jelajah menu per kategori, detail produk, dan opsi kustomisasi.
- Keranjang belanja, checkout, dan pembuatan pesanan.
- Halaman pelacakan status pesanan.
- Halaman informasi seperti About, FAQ, Careers, Privacy, Contact, dan Locations.

### Admin
- Login admin melalui Supabase Auth.
- Dashboard ringkas (statistik pesanan, pendapatan, dan pesanan terbaru).
- Manajemen produk, kategori, dan opsi kustomisasi.
- Manajemen pesanan serta pengaturan toko.

## Teknologi

- **Next.js App Router** untuk SSR/SSG dan routing.
- **React 19** + **TypeScript**.
- **Tailwind CSS** + Radix UI components.
- **Supabase** (Auth + Postgres).
- **Zustand** untuk state keranjang.
- **React Hook Form** + **Zod** untuk validasi form.

## Struktur Direktori

```
src/
  actions/          # Server actions (auth, dll.)
  app/              # App Router routes
    (customer)/     # Halaman pelanggan
    (admin)/admin/  # Panel admin
    (auth)/         # Login admin
  components/       # UI + shared components
  data/             # Mock data untuk development
  lib/              # Helper & integrasi Supabase
  stores/           # Zustand store (cart)
  types/            # Tipe data TypeScript
supabase/
  migrations/       # Migrasi DB
  schema.sql        # Skema database
```

## Prasyarat

- Node.js 18+ (atau sesuai standar Next.js terbaru).
- Akun Supabase (untuk auth dan database).

## Konfigurasi Environment

Buat file `.env.local` di root proyek dengan variabel berikut:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Menjalankan Aplikasi

Install dependencies:

```bash
npm install
```

Jalankan server development:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## Script Penting

- `npm run dev` — Menjalankan server development.
- `npm run build` — Build aplikasi untuk produksi.
- `npm run start` — Menjalankan hasil build.
- `npm run lint` — Menjalankan ESLint.

## Catatan Development

- Data mock tersedia di `src/data/mock-data.ts` untuk mempermudah pengembangan UI tanpa Supabase.
- Untuk penggunaan penuh, pastikan tabel dan relasi Supabase sesuai dengan `supabase/schema.sql`.

## Deployment

Aplikasi dapat di-deploy ke Vercel atau hosting lain yang mendukung Next.js. Pastikan env var Supabase diset di environment hosting.
