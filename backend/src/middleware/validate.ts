import { z } from 'zod';

export const tripSchema = z.object({
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD.'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD.'),
  accommodation: z.enum(['hotel', 'hostel', 'airbnb', 'tent', 'other']),
  activityLevel: z.enum(['light', 'moderate', 'intense']),
}).refine(
  data => new Date(data.endDate) >= new Date(data.startDate),
  { message: 'endDate must be on or after startDate.', path: ['endDate'] },
);

export const updateListSchema = z.object({
  content: z.record(
    z.string(),
    z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().min(1),
        packed: z.boolean(),
      }),
    ),
  ),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required.'),
  content: z.record(
    z.string(),
    z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().min(1),
        packed: z.boolean(),
      }),
    ),
  ),
});

export type TripSchemaType = z.infer<typeof tripSchema>;
export type UpdateListSchemaType = z.infer<typeof updateListSchema>;
export type TemplateSchemaType = z.infer<typeof templateSchema>;
