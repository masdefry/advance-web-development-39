import * as zod from 'zod';
import { Genre } from '../../../generated/prisma';

export class BookValidation {
  static readonly CREATE = zod.object({
    body: zod.object({
      title: zod
        .string()
        .trim()
        .min(1, 'Title is required field')
        .max(255, 'Title have maximum 255 characters'),

      description: zod.string().trim().min(1, 'Description is required field'),

      author: zod
        .string()
        .trim()
        .min(1, 'Author is required field')
        .max(100, 'Author have maximum 100 characters'),

      isbn: zod
        .string()
        .trim()
        .min(1, 'ISBN is required field')
        .max(100, 'ISBN have maximum 100 characters'),

      genre: zod.enum(Genre, {
        error: 'Genre is invalid',
      }),

      stocks: zod.coerce
        .number({
          error: 'Stocks must be a number',
        })
        .int('Stocks must be an integer')
        .min(0, 'Stocks cannot be negative'),
    }),
  });
}

export type BookCreateInput = zod.infer<typeof BookValidation.CREATE>;
