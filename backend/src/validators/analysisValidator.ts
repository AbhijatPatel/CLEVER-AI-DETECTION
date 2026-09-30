import { z } from 'zod';

export const textAnalysisSchema = z.object({
  text: z.string().min(20, 'Text must be at least 20 characters for meaningful forensic analysis').max(100000, 'Text exceeds 100,000 character limit'),
  title: z.string().min(1).max(200).optional().default('Text Analysis'),
  modality: z.literal('text').optional().default('text'),
  metadata: z.record(z.any()).optional()
});

export const updateAnalysisSchema = z.object({
  title: z.string().min(1).max(200).optional()
});
