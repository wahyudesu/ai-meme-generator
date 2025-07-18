import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { frustrationsSchema } from '../schemas';
/**
 * Step untuk mengekstrak dan mengkategorikan keluhan pengguna dari input mentah.
 * Menggunakan AI untuk menganalisis input dan mengembalikan data keluhan yang terstruktur.
 */
export const extractFrustrationsStep = createStep({
  id: 'extract-frustrations',
  description:
    'Ekstrak dan kategorikan keluhan pengguna dari input mentah menggunakan AI',
  inputSchema: z.object({
    userInput: z.string().describe('Input mentah pengguna tentang keluhan kerja'),
  }),
  outputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🔍 Menganalisis keluhan pekerjaan Anda...');

      const result = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: frustrationsSchema,
        prompt: `
          Analisis keluhan pekerjaan ini dan ekstrak informasi terstruktur:
          
          "${inputData.userInput}"
          
          Ekstrak:
          - Keluhan individual dengan kategori (rapat, proses, teknologi, komunikasi, manajemen, beban-kerja, lainnya)
          - Mood keseluruhan (frustrasi, kesal, kewalahan, lelah, marah, sarkastik)
          - Kata kunci untuk setiap keluhan
          - Gaya meme yang disarankan
          
          Buatlah analisis yang ringkas dan fokus. Gunakan bahasa Indonesia dalam respon.
        `,
      });

      const frustrations = result.object;

      console.log(
        `✅ Ditemukan ${frustrations.frustrations.length} keluhan, mood: ${frustrations.overallMood}`,
      );

      return {
        ...frustrations,
        analysis: {
          message: `Menganalisis keluhan Anda - masalah utama: ${frustrations.frustrations[0]?.category} (mood ${frustrations.overallMood})`,
        },
      };
    } catch (error) {
      console.error('Error extracting frustrations:', error);
      throw new Error('Gagal menganalisis keluhan');
    }
  },
});