import * as z from 'zod';
import { Genre } from '../../../generated/prisma';

export class BookValidation {
  static readonly CREATE = z.object({
    body: z.object({
      title: z
        .string()
        .trim()
        .min(1, 'Title is required field')
        .max(255, 'Title have maximum 255 characters'),

      description: z.string().trim().min(1, 'Description is required field'),

      author: z
        .string()
        .trim()
        .min(1, 'Author is required field')
        .max(100, 'Author have maximum 100 characters'),

      isbn: z
        .string()
        .trim()
        .min(1, 'ISBN is required field')
        .max(100, 'ISBN have maximum 100 characters'),

      genre: z.enum(Genre, {
        error: 'Genre is invalid',
      }),

      stocks: z.coerce
        .number({
          error: 'Stocks must be a number',
        })
        .int('Stocks must be an integer')
        .min(0, 'Stocks cannot be negative'),
    }),
  });

  static readonly LIST_QUERY = z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(10),

      search: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().trim().optional(),
      ),
    }),
  });
}

export type BookCreateInput = z.infer<typeof BookValidation.CREATE>;
export type BookListQueryInput = z.infer<typeof BookValidation.LIST_QUERY>;
