# Subdomain & Multi-Cabang Routing — Rencana

Catatan diskusi soal kemungkinan pemakaian subdomain untuk CRM/mitra dan landing page per cabang di project ini (Next.js 16.3.3).

## Pertanyaan

1. Apakah bisa subdomain, misalnya `admin.solusidana.com` untuk CRM, dan landing page tiap cabang di `solusidana.com/nama-cabang`?
2. Apakah bisa subdomain `mitra.solusidana.com` untuk login mitra?

## Jawaban

**Ya, keduanya bisa.**

### Landing page per cabang — `solusidana.com/nama-cabang`
Tidak perlu subdomain sama sekali. Cukup dynamic route Next.js:

```
app/[cabang]/page.tsx
```

Bagian ini yang paling sederhana untuk diimplementasikan.

### Subdomain — `admin.solusidana.com` dan `mitra.solusidana.com`
Di Next.js 16, `middleware.js` sudah diganti nama menjadi **`proxy.js`**. Pendekatannya:

- **`proxy.ts`** di root (atau `src/`) — baca header `Host` dari request, lalu `rewrite()` ke folder route yang sesuai (mis. `app/admin/...` untuk host `admin.solusidana.com`, `app/mitra/...` untuk `mitra.solusidana.com`) tanpa mengubah URL yang tampil di browser.
- **Alternatif tanpa proxy**: `rewrites()` di `next.config.ts`, dengan matcher `has: [{ type: 'host', value: 'admin.solusidana.com' }]`.
- **Multi-Zones** (opsional, untuk skala besar): fitur resmi Next.js untuk memecah jadi beberapa app Next.js terpisah — masing-masing bisa dikembangkan dan di-deploy independen — digabung lewat `rewrites()`. Syarat: tiap zona set `assetPrefix`, dan link antar-zona pakai `<a>` biasa (bukan `<Link>`). Cocok kalau CRM/portal mitra ingin benar-benar terpisah dari landing page utama.

### Hal di luar kode
- **DNS**: perlu record untuk tiap subdomain (`admin.`, `mitra.`) mengarah ke hosting yang sama.
- **Hosting**: kalau di Vercel, tinggal tambahkan domain tambahan ke project yang sama — otomatis ditangani oleh proxy/rewrites berbasis host.
- **Auth lintas subdomain**: kalau sesi login perlu dikenali di beberapa subdomain sekaligus, atur cookie domain jadi `.solusidana.com` (bukan `admin.solusidana.com` saja). Kalau admin dan mitra memang punya sistem auth independen, ini tidak perlu.

## Kondisi project saat ini

- `next.config.ts` masih kosong (scaffold default), belum ada `rewrites()`/`redirects()`.
- Belum ada `proxy.ts`/`middleware.ts`.
- `src/app/` masih struktur single-app scaffold bawaan `create-next-app`.
- `readme.txt` menyebut beberapa domain bisnis terkait (adiracabang.id, adirafinance.id, dll) — niat multi-domain sudah ada di rencana bisnis, tapi belum diimplementasikan di kode.

## Status

Ini masih tahap perencanaan/dokumentasi. Implementasi (`proxy.ts`, `rewrites()`, atau Multi-Zones) belum dikerjakan — menunggu keputusan lebih lanjut.
