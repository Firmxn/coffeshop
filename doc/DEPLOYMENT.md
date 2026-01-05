# Panduan Deployment ke Vercel

## 1. Persiapan GitHub
Pastikan semua kode sudah di-push ke repository GitHub.
Status saat ini: **Sudah up-to-date** (per commit terakhir).

## 2. Setup di Vercel Dashboard
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **Add New...** > **Project**.
3. Import repository `arcoffee`.
4. Pada bagian **Configure Project**, buka bagian **Environment Variables**.

## 3. Environment Variables (WAJIB)
Anda harus menyalin variabel berikut dari file `.env.local` Anda ke Vercel.

| Nama Variable | Deskripsi | Penting |
|--------------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase Project Anda | Wajib |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Key Supabase | Wajib |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret Key untuk Admin** | **KRUSIAL** |

> **PERINGATAN:** 
> Fitur Upload Gambar dan Manajemen Produk (Tambah/Edit/Hapus) **TIDAK AKAN BERFUNGSI** jika `SUPABASE_SERVICE_ROLE_KEY` tidak dimasukkan. Key ini digunakan untuk mem-bypass Row Level Security (RLS) saat admin melakukan perubahan data.

### Cara mendapatkan keys:
- Buka Supabase Dashboard > Project Settings > API.
- `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` -> `SUPABASE_SERVICE_ROLE_KEY` (Klik "Reveal" untuk melihat)

## 4. Deploy
1. Klik **Deploy**.
2. Tunggu proses build selesai.
3. Setelah selesai, buka aplikasi Anda dan test fitur Admin.

## Catatan
- Jika Anda mengalami error 500 saat upload gambar, pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah benar.
- Jika gambar produk lama tidak muncul, pastikan bucket `products` di Supabase Storage sudah diset ke **Public**.
