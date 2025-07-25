import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { frustrationsSchema } from '../schemas';
/**
 * Step untuk mengekstrak dan mengkategorikan keluhan pengguna dari input.
 * Menggunakan AI untuk menganalisis input dan mengembalikan data keluhan yang terstruktur.
 */
export const extractFrustrationsStep = createStep({
  id: 'masalah',
  description: 'Uraikan masalah dan kategorikan keluhan dari input pengguna',
  inputSchema: z.object({
    userInput: z.string().describe('inputan pengguna tentang keluhan yang dimiliki'),
  }),
  outputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🔍 Menganalisis masalah...');

      const result = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: frustrationsSchema,
        prompt: `
          Analisis keluhan user dan ekstrak informasi:
          
          "${inputData.userInput}"
          
          Uraikan/Identifikasi:
          - Keluhan individual dengan kategori (pemerintah, teknologi, dark jokes, drama artis, beban-kerja, lainnya)
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