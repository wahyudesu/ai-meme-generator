import { z } from 'zod';

// Schema untuk ekstraksi keluhan/frustrasi
export const frustrationsSchema = z.object({
  frustrations: z.array(
    z.object({
      text: z.string().describe('Keluhan spesifik yang disebutkan'),
      category: z
        .enum([
          'pemerintah',
          'teknologi',
          'dark jokes',
          'drama atis',
          'beban-kerja',
          'lainnya',
        ])
        .describe('Kategori keluhan'),
      severity: z
        .enum(['ringan', 'sedang', 'berat'])
        .describe('Seberapa parah keluhan ini'),
      // department: z
      //   .enum([
      //     'engineering',
      //     'sales',
      //     'marketing',
      //     'hr',
      //     'finance',
      //     'operasional',
      //     'umum',
      //   ])
      //   .describe('Departemen yang terkait dengan keluhan ini'),
      keywords: z
        .array(z.string())
        .describe('Kata kunci yang bisa digunakan untuk pencarian meme'),
    }),
  ),
  overallMood: z
    .enum([
      'frustrasi',
      'kesal',
      'kewalahan',
      'lelah',
      'marah',
      'sarkastik',
    ])
    .describe('Nada emosional secara keseluruhan'),
  suggestedMemeStyle: z
    .enum([
      'klasik',
      'modern',
      'korporat',
      'developer',
      'rapat',
      'kerja-remote',
    ])
    .describe('Gaya meme yang disarankan berdasarkan keluhan'),
});