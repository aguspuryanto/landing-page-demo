import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.email({ error: 'Masukkan email yang valid.' }).trim(),
  password: z.string().min(1, { error: 'Password wajib diisi.' }),
});

export const BranchSchema = z.object({
  name: z.string().min(2, { error: 'Nama cabang minimal 2 karakter.' }).trim(),
  slug: z
    .string()
    .min(2, { error: 'Slug minimal 2 karakter.' })
    .regex(/^[a-z0-9-]+$/, { error: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.' })
    .trim(),
  address: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  mapEmbed: z.string().trim().optional().or(z.literal('')),
});

export const CustomerStatusValues = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;

export const CustomerSchema = z.object({
  name: z.string().min(2, { error: 'Nama minimal 2 karakter.' }).trim(),
  phone: z.string().min(6, { error: 'Nomor telepon tidak valid.' }).trim(),
  email: z.email({ error: 'Email tidak valid.' }).trim().optional().or(z.literal('')),
  status: z.enum(CustomerStatusValues),
  notes: z.string().trim().optional().or(z.literal('')),
  source: z.string().trim().optional().or(z.literal('')),
  branchId: z.string().trim().optional().or(z.literal('')),
});

export const LandingPageSchema = z.object({
  heroTitle: z.string().min(2, { error: 'Judul hero wajib diisi.' }).trim(),
  heroSubtitle: z.string().trim().optional().or(z.literal('')),
  seoTitle: z.string().trim().optional().or(z.literal('')),
  seoDescription: z.string().trim().optional().or(z.literal('')),
  ogImage: z.url({ error: 'URL gambar tidak valid.' }).trim().optional().or(z.literal('')),
  published: z.coerce.boolean().optional(),
});

export const BroadcastTypeValues = ['WHATSAPP', 'EMAIL'] as const;

export const BroadcastComposeSchema = z.object({
  type: z.enum(BroadcastTypeValues),
  subject: z.string().trim().optional().or(z.literal('')),
  message: z.string().min(2, { error: 'Isi pesan wajib diisi.' }).trim(),
  filterBranchId: z.string().trim().optional().or(z.literal('')),
  filterStatus: z.enum(CustomerStatusValues).optional().or(z.literal('')),
});
