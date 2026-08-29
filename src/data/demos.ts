// src/data/demos.ts

export type BadgeType = 'yellow' | 'white' | 'blue' | 'green';
export type Category = 'adirafinance' | 'danacepat' | 'modern' | 'cro';

export interface Demo {
  id: string;
  num: number;
  file: string;
  title: string;
  desc: string;
  categories: Category[];
  tags: Array<{ label: string; variant: 'default' | 'blue' | 'yellow' | 'green' | 'purple' }>;
  icon: string;
  gradient: string;
  badgeLabel: string;
  badgeType: BadgeType;
  featured?: boolean;
}

export const DEMOS: Demo[] = [
  {
    id: 'demo',
    num: 1,
    file: '/demos/demo.html',
    title: 'Gadai BPKB Surabaya · Adira Finance Sukomanunggal',
    desc: 'Landing page utama Adira Finance cabang Sukomanunggal Surabaya. Halaman terlengkap dengan konten informatif, FAQ, testimonial, kalkulator cicilan, dan form pengajuan via WhatsApp.',
    categories: ['adirafinance'],
    tags: [
      { label: 'Bootstrap 5', variant: 'blue' },
      { label: 'Adira Finance', variant: 'yellow' },
      { label: 'Full-Featured', variant: 'green' },
      { label: 'SEO', variant: 'default' },
      { label: '75 KB', variant: 'default' },
    ],
    icon: 'bi-building-check',
    gradient: 'linear-gradient(135deg,#001466 0%,#0033A0 60%,#0040c8 100%)',
    badgeLabel: '⭐ Featured — Utama',
    badgeType: 'yellow',
    featured: true,
  },
  {
    id: 'demo1',
    num: 2,
    file: '/demos/demo1.html',
    title: 'SolusiDana · Dana Tunai Jaminan BPKB',
    desc: 'Tampilan modern berfokus pada kemudahan pengajuan dana tunai. Tenor fleksibel, proses mudah, kendaraan tetap bisa dipakai sehari-hari.',
    categories: ['modern'],
    tags: [
      { label: 'Bootstrap 5', variant: 'blue' },
      { label: 'SolusiDana', variant: 'purple' },
      { label: '50 KB', variant: 'default' },
    ],
    icon: 'bi-wallet2',
    gradient: 'linear-gradient(135deg,#0d2460 0%,#1a3a8a 100%)',
    badgeLabel: '📱 Mobile-first',
    badgeType: 'white',
  },
  {
    id: 'demo2',
    num: 3,
    file: '/demos/demo2.html',
    title: 'DanaKilat · Finance Modern',
    desc: 'Desain segar dengan palet biru-tosca modern. Tampilan clean dan minimalis, cocok untuk target pasar muda urban yang melek digital.',
    categories: ['modern'],
    tags: [
      { label: 'DanaKilat', variant: 'blue' },
      { label: 'Minimalis', variant: 'default' },
      { label: '18 KB', variant: 'default' },
    ],
    icon: 'bi-lightning-charge',
    gradient: 'linear-gradient(135deg,#0a58ca 0%,#00b4d8 100%)',
    badgeLabel: '🎨 Finance Modern',
    badgeType: 'white',
  },
  {
    id: 'demo3',
    num: 4,
    file: '/demos/demo3.html',
    title: 'DanaCepat · Gadai BPKB Motor & Mobil Cepat & Aman',
    desc: 'Menonjolkan keamanan BPKB dan kecepatan proses pencairan. Plus Jakarta Sans dengan layout terstruktur dan trust signals yang kuat.',
    categories: ['danacepat'],
    tags: [
      { label: 'DanaCepat', variant: 'green' },
      { label: 'Bootstrap 5', variant: 'blue' },
      { label: 'Jakarta Sans', variant: 'default' },
      { label: '36 KB', variant: 'default' },
    ],
    icon: 'bi-shield-check',
    gradient: 'linear-gradient(135deg,#0d3d26 0%,#1a6640 100%)',
    badgeLabel: '✅ Cepat & Aman',
    badgeType: 'green',
  },
  {
    id: 'demo4',
    num: 5,
    file: '/demos/demo4.html',
    title: 'DanaCepat · Solusi Gadai BPKB Motor & Mobil Cepat Cair',
    desc: 'Versi yang menekankan kecepatan pencairan dana dengan elemen urgensi yang kuat. Desain energik untuk mendorong konversi lebih tinggi.',
    categories: ['danacepat'],
    tags: [
      { label: 'DanaCepat', variant: 'green' },
      { label: 'Urgensi', variant: 'default' },
      { label: '32 KB', variant: 'default' },
    ],
    icon: 'bi-cash-coin',
    gradient: 'linear-gradient(135deg,#7a2e00 0%,#c14a00 100%)',
    badgeLabel: '⏱ Cepat Cair',
    badgeType: 'white',
  },
  {
    id: 'demo5',
    num: 6,
    file: '/demos/demo5.html',
    title: 'DanaCepat · Dana Tunai Gadai BPKB Resmi & Cepat Cair',
    desc: 'Menonjolkan legalitas dan keresmiian lembaga keuangan. Bunga rendah mulai 0.8%, proses 1 jam cair, tanpa perantara, BPKB aman.',
    categories: ['danacepat'],
    tags: [
      { label: 'DanaCepat', variant: 'green' },
      { label: '0.8% Bunga', variant: 'yellow' },
      { label: '31 KB', variant: 'default' },
    ],
    icon: 'bi-patch-check',
    gradient: 'linear-gradient(135deg,#3d0066 0%,#6a0dad 100%)',
    badgeLabel: '🏛 Resmi',
    badgeType: 'blue',
  },
  {
    id: 'demo6',
    num: 7,
    file: '/demos/demo6.html',
    title: 'DanaCepat · Dana Tunai BPKB Resmi v2 (A/B Test)',
    desc: 'Variasi kedua dari demo5 untuk keperluan A/B testing. Konten identik, tampilan berbeda untuk mengukur performa konversi terbaik.',
    categories: ['danacepat'],
    tags: [
      { label: 'DanaCepat', variant: 'green' },
      { label: 'A/B Test', variant: 'default' },
      { label: '31 KB', variant: 'default' },
    ],
    icon: 'bi-fire',
    gradient: 'linear-gradient(135deg,#4a0000 0%,#7a0000 100%)',
    badgeLabel: '🔀 A/B Variant',
    badgeType: 'white',
  },
  {
    id: 'demo7',
    num: 8,
    file: '/demos/demo7.html',
    title: 'DanaKilat · CRO Landing Page',
    desc: 'Landing page yang dirancang dengan prinsip Conversion Rate Optimization. Setiap elemen ditempatkan strategis untuk mendorong pengguna melakukan aksi konversi.',
    categories: ['cro', 'modern'],
    tags: [
      { label: 'DanaKilat', variant: 'blue' },
      { label: 'CRO', variant: 'purple' },
      { label: 'High-Convert', variant: 'default' },
      { label: '22 KB', variant: 'default' },
    ],
    icon: 'bi-graph-up-arrow',
    gradient: 'linear-gradient(135deg,#0d6efd 0%,#00b4d8 100%)',
    badgeLabel: '📈 CRO',
    badgeType: 'blue',
  },
  {
    id: 'demo8',
    num: 9,
    file: '/demos/demo8.html',
    title: 'AdiraKilat · CRO Landing Page (Official Brand Colors)',
    desc: 'CRO landing page dengan warna brand resmi Adira Finance — biru #0033A0 dan kuning #FFCD00. Paling sesuai panduan identitas visual official Adira Finance.',
    categories: ['adirafinance', 'cro'],
    tags: [
      { label: 'Adira Brand', variant: 'yellow' },
      { label: 'CRO', variant: 'blue' },
      { label: 'Official Colors', variant: 'green' },
      { label: '23 KB', variant: 'default' },
    ],
    icon: 'bi-bank',
    gradient: 'linear-gradient(135deg,#0033A0 0%,#001466 100%)',
    badgeLabel: '⭐ Official Brand',
    badgeType: 'yellow',
  },
  {
    id: 'demo9',
    num: 10,
    file: '/demos/demo9.html',
    title: 'Gadai BPKB Mobil & Motor Surabaya · Konsultasi WhatsApp',
    desc: 'Versi terbaru landing page Adira Finance Surabaya dengan tema merah. Dilengkapi kalkulator estimasi dana, simulasi angsuran interaktif, dan konsultasi langsung via WhatsApp.',
    categories: ['adirafinance'],
    tags: [
      { label: 'Bootstrap 5', variant: 'blue' },
      { label: 'Adira Finance', variant: 'yellow' },
      { label: 'Kalkulator', variant: 'green' },
      { label: 'WA Konsultasi', variant: 'default' },
      { label: '76 KB', variant: 'default' },
    ],
    icon: 'bi-geo-alt-fill',
    gradient: 'linear-gradient(135deg,#7a0010 0%,#c0001b 60%,#e30613 100%)',
    badgeLabel: '⭐ Full-Featured',
    badgeType: 'yellow',
    featured: true,
  },
  {
    id: 'demo10',
    num: 11,
    file: '/demos/demo10.html',
    title: 'DanaCepat · Dana Tunai Gadai BPKB Resmi & Cepat Cair v3',
    desc: 'Versi ketiga DanaCepat dengan desain yang lebih disempurnakan. Pinjaman dana tunai jaminan BPKB resmi, bunga rendah mulai 0.8%, proses 1 jam cair tanpa perantara.',
    categories: ['danacepat'],
    tags: [
      { label: 'DanaCepat', variant: 'green' },
      { label: '0.8% Bunga', variant: 'yellow' },
      { label: 'v3', variant: 'default' },
      { label: '31 KB', variant: 'default' },
    ],
    icon: 'bi-patch-check-fill',
    gradient: 'linear-gradient(135deg,#1b4332 0%,#2d6a4f 100%)',
    badgeLabel: '⚡ v3 Terbaru',
    badgeType: 'green',
  },
];

export const FILTER_OPTIONS = [
  { key: 'all', label: 'Semua', icon: 'bi-grid-3x3-gap-fill' },
  { key: 'adirafinance', label: 'Adira Finance', icon: 'bi-building' },
  { key: 'danacepat', label: 'DanaCepat', icon: 'bi-lightning-fill' },
  { key: 'modern', label: 'Modern UI', icon: 'bi-stars' },
  { key: 'cro', label: 'CRO', icon: 'bi-graph-up-arrow' },
] as const;

export type FilterKey = (typeof FILTER_OPTIONS)[number]['key'];

export const FILTER_LABELS: Record<FilterKey, { lbl: string; title: string }> = {
  all: { lbl: 'Semua Demo', title: 'Semua Landing Page Demo (11)' },
  adirafinance: { lbl: 'Adira Finance', title: 'Demo Brand Adira Finance' },
  danacepat: { lbl: 'DanaCepat', title: 'Demo Brand DanaCepat' },
  modern: { lbl: 'Modern UI', title: 'Demo Modern UI' },
  cro: { lbl: 'CRO Optimized', title: 'Demo CRO Landing Page' },
};
