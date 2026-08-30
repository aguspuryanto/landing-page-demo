https://adiracabang.id/cabang/adira-sukomanunggal-surabaya
https://www.adirafinance.id/adira-finance-sukomanunggal-surabaya-081314506138-gadai-bpkb
https://financeadira.id/adira-finance-sukomanunggal/
https://adira-finance.id/
https://www.adirafinance.id/

Website ini dimiliki dan dikelola oleh Agen AXI terdaftar di Adira Finance.

File yang ditambahkan (sesuai plan):

prisma/schema.prisma + prisma.config.ts + prisma/seed.ts — model User/Branch/Customer/LandingPage/BroadcastCampaign/BroadcastLog
src/lib/db.ts, src/lib/auth/{session,dal,actions}.ts, src/lib/wa.ts (Fonnte), src/lib/email.ts (Resend), src/lib/validation.ts
src/proxy.ts — guard optimistic untuk semua route /admin/*
src/app/admin/(auth)/login — login form
src/app/admin/(dashboard)/{dashboard,customers,branches,landing-pages,broadcasts} — CRUD lengkap + compose broadcast
src/app/[cabang]/page.tsx — landing page publik dinamis per cabang (terpisah dari public/demos/*.html yang tidak diubah)
src/components/ui/* — komponen shadcn-style (button, input, select, dialog, table, dll) pakai Tailwind, hanya ter-load di /admin

Yang perlu Anda lakukan sebelum jalan:

Salin .env.example → .env.local, isi DATABASE_URL (Postgres Anda), SESSION_SECRET (openssl rand -base64 32), FONNTE_TOKEN, RESEND_API_KEY, RESEND_FROM_EMAIL, dan SEED_ADMIN_*.
npx prisma migrate dev --name init untuk membuat tabel.
npx prisma db seed untuk membuat akun admin pertama.
npm run dev → buka /admin/login.