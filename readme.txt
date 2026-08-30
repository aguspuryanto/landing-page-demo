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

---
Lokasi Cabang Jatim
Ponorogo - Pacitan
Jl. Panglima Sudirman no. 151 RT/RW 02/01, Baleharjo, Pacitan, Kab Pacitan, Jawa Timur, 63571

Madiun - Ngawi
Jl. Yos Sudarso no. 28, Margomulyo, Ngawi, Kab Ngawi, Jawa Timur, 63217

Madiun-Semeru
Jl. H. Agus Salim No. 176 Rt/Rw 18/05, Pangongangan, Manguharjo, Kota Madiun, Jawa Timur, 63129

Ponorogo-Jend. Sudirman
Jl. Panglima Besar Sudirman no. 55, Mangkujayan, Ponorogo, Kab Ponorogo, Jawa Timur, 63473

Bojonegoro-Veteran
Jl. Veteran No 188, Wedi, Kapas, Kab Bojonegoro, Jawa Timur, 62115

Tulungagung - Trenggalek
Jl. Soekarno-Hatta Komplek Ruko Hayam Wuruk no. A2-A3, Ngantru, Trenggalek, Kab Trenggalek, Jawa Timur, 66316

Kediri - Nganjuk
Jl. Gatot Subroto, Kauman, Nganjuk, Kab Nganjuk, Jawa Timur, 64314


Tuban-Lukman Hakim
Jl. Lukman Hakim no. 43 Tuban RT 03/RW 04, Doromukti, Tuban, Tuban , Jawa Timur, 62316


Tulungagung-Hasanudin
Komp. Panglima Sudirman Trade Centre Blok B5 - 7, Jl. S. Hasanudin, Kenayan, Tulungagung, Kab Tulungagung, Jawa Timur, 66125


Kediri-Erlangga Syariah
Jl. Erlangga 39 RT 02 RW 10, Banjaran, Kota, Kota Kediri, Jawa Timur, 64122


Kediri-Erlangga
Jl. Erlangga 39 RT 02 RW 10, Banjaran, Kediri Kota, Kediri, Jawa Timur, 64122


Mojokerto- Jombang
Jl. Soekarno. Hatta no. 3 Komp. Ruko Cempaka Mas Blok A no. 19-20 , Kepuhkembeng, Peterongan, Kab Jombang, Jawa Timur, 61326


Gresik - Lamongan
Ruko Lamongan Trade Center Blok B 9-10, Jl. Sunan Giri, Tumenggungan, Lamongan, Kab Lamongan, Jawa Timur, 62215


Blitar-Melati
Jl. Raya Melati no. 1, Ruko A - D, Kepanjenkidul, Kepanjenkidul, Kota Blitar, Jawa Timur, 66121


Mojokerto-Yos Sudarso
Jl. Yos Sudarso no. 29-35, Mojokerto, Mentikan, Prajuritkulon, Kota Mojokerto, Jawa Timur, 61323


Blitar - Wlingi
Jl. Panglima Sudirman, RT 01 / RW 05, Beru, Wlingi, Kab Blitar, Jawa Timur, 66184


Mojokerto - Mojosari
Komp Ruko Royal RE-2 Jl. Airlangga, Seduri, Mojosari, Kab Mojokerto, Jawa Timur, 61382


Gresik-Kartini
Ruko Building KaRTini Jl. R.A. KaRTini no. 236/A1, Sidomoro, Kebomas, Kab Gresik, Jawa Timur, 61122


Surabaya 4-Sukomanunggal
Ruko Satellite Town Square Blok B 16 - 18, Jl. Sukomanunggal, Sukomanunggal, Sukomanunggal, Kota Surabaya, Jawa Timur, 60188


Surabaya 2 - Bangkalan
Jl. R. E. MaRTadinata no. 28, Mlajah, Bangkalan, Kab Bangkalan, Jawa Timur, 69116


Sidoarjo-Hangtuah
Jl. Hangtuah no.2, RT.07,RW.02 Sidomukti, Sidokumpul, Sidoarjo, Kab Sidoarjo, Jawa Timur, 61212


Surabaya 3 Car-Kayon
Jl. Kayon no. 2C- D, Embong Kaliasin, Genteng, Kota Surabaya, Jawa Timur, 60262


Surabaya 5 - Surabaya Durable
Jl. Margorejo 63 A - B, Ruko Margo Indah Shop House, Margorejo, Wonocolo, Kota Surabaya, Jawa Timur, 60238


Surabaya 1 - Margorejo
Jl. Margorejo 63 A - B, Ruko Margo Indah Shop House, Margorejo, Wonocolo, Kota Surabaya, Jawa Timur, 60238


Pasuruan - Pandaan
Jl. Raya Kalitengah no. 11 RT.6/5, Karangjati, Pandaan, Kab Pasuruan, Jawa Timur, 67156


Surabaya 2- Ir Soekarno
Ruko Icon 21 Blok S10-11, Jalan Dr. Ir. H. Soekarno. 001/001, Klampis Ngasem, Sukolilo, Kota Surabaya, Jawa Timur, 60117


Surabaya 2- Ir Soekarno Syariah
Ruko Icon 21 Blok S10-11, Jalan Dr. Ir. H. Soekarno. 001/001, Klampis Ngasem, Sukolilo, Kota Surabaya, Jawa Timur, 60117


Kepanjen-Ahmad Yani
Jl. Ahmad Yani no.4 RT/RW 4B/02, Ardirejo, Kepanjen, Kab Malang, Jawa Timur, 65163


Malang-Ja. Suprapto
Jl. Jaksa Agung Suprapto no. 56, Klojen, Klojen, Kota Malang, Jawa Timur, 65111


Malang 2 Car-Tumenggung Suryo
Ruko Jl. R Tumenggung Suryo 30 A dan B , Bunulrejo, Blimbing, Kota Malang, Jawa Timur, 65115


Pasuruan-Soekarno Hatta
Jl. Sokarno. Hatta Pasuruan no. 9 A, Gadingrejo, Gadingrejo, Kota Pasuruan, Jawa Timur, 67134


Pasuruan-Soekarno Hatta Syariah
Jl. Sokarno. Hatta Pasuruan no. 9 A, Gadingrejo, Gadingrejo, Pasuruan, Jawa Timur, 67134


Pamekasan - Sampang
Jl. Diponogoro RT/RW 03/03, Banyuanyar, Sampang, Kab Sampang, Jawa Timur, 69217


Probolinggo - Gatot Subroto
Jl. Gatot Subroto no. 65 - 67 Probolinggo RT 01 RW 03, Mangunharjo, Mayangan, Kota Probolinggo, Jawa Timur, 67217


Probolinggo - Lumajang
Jl. Wahid Hasyim 80 Lumajang, Tompokersan, Lumajang, Kab Lumajang, Jawa Timur, 67311


Pamekasan-Pintugerbang Syariah
Jl. Pintu Gerbang no. 21, RT 02 / RW 03, Bugih, Pamekasan, Pamekasan, Jawa Timur, 69316


Pamekasan-Pintu Gerbang
Jl. Pintu Gerbang no. 21, RT 02 / RW 03, Bugih, Pamekasan, Kab Pamekasan, Jawa Timur, 69316


Jember - Balung
Jl. Rambipuji no. 120, Balunglor, Balung, Kab Jember, Jawa Timur, 68161


Pamekasan- Sumenep
Jl. Pahlawan no. 28, Talango, Talango, Kab Sumenep, Jawa Timur, 69412


Jember-Gajah Mada
Jl. Gajah Mada no. 229, RT 004 / RW 002, Kaliwates, Kaliwates, Kab Jember, Jawa Timur, 68133


Jember-Gajah Mada Syariah
Jl. Gajah Mada no. 229, RT 004 / RW 002, Kaliwates, Kaliwates, Jember, Jawa Timur, 68133


Situbondo - Bondowoso
Ruko Crown Plaza, Wahid Hasyim 168, Blindungan, Bondowoso, Kab Bondowoso, Jawa Timur, 68212


Situbondo-Basuki Rahmat
Jl. Basuki Rahmat no. 128, Mimbaan, Panji, Kab Situbondo, Jawa Timur, 68322


Banyuwangi - Genteng
Jl. Hasanuddin no. 81, RT 03 / RW 04, Gentengwetan, Genteng, Kab Banyuwangi, Jawa Timur, 68465


Banyuwangi-S. Parman
Jl. S. Parman no. 33 Komp. Perkantoran Gardenia Estate Kav. 5,6,7, Pakis, Banyuwangi, Kab Banyuwangi, Jawa Timur, 68419
