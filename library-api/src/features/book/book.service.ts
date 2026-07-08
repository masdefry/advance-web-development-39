import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/prisma-client.config';
import { ResponseError } from '../../utils/response-error.util';
import { BookCreateInput, BookListQueryInput } from './book.validation';
import { CloudinaryUtil } from '../../utils/cloudinary.util';
import { Prisma } from '../../../generated/prisma';
import redisClient from '../../configs/redis-client.config';

export class BookService {
  static async create({ body }: BookCreateInput, files: Express.Multer.File[]) {
    const existingBook = await prisma.book.findMany({
      where: {
        OR: [
          {
            title: body.title,
          },
          {
            isbn: body.isbn,
          },
        ],
      },
    });

    if (existingBook.length)
      throw new ResponseError(
        StatusCodes.CONFLICT,
        'Book title/isbn already exist',
      );

    return await prisma.$transaction(async (tx) => {
      const createdBook = await tx.book.create({
        data: {
          title: body.title,
          description: body.description,
          isbn: body.isbn,
          stocks: body.stocks,
          author: body.author,
          genre: body.genre,
        },
      });

      /*
        [
            {imageUrl, bookId: createdBook.id}, 
            {imageurl, bookId: createdBook.id}
        ]
    */
      /* IF USING DISK STORAGE */
      // const bookImageToCreate = files?.map((image) => {
      //   const destination = image.destination.split('/').slice(-2).join('/');
      //   return {
      //     imageUrl: `${destination}/${image?.filename}`,
      //     bookId: createdBook.id,
      //   };
      // });

      /* IF USING MEMORY STORAGE & CLOUDINARY */
      const uploadedImageFiles = files?.map(async (image) => {
        const secureUrl = await CloudinaryUtil.uploadStream(image.buffer);
        return {
          imageUrl: secureUrl,
          bookId: createdBook.id,
        };
      });

      const bookImagesToCreate = await Promise.all(uploadedImageFiles);

      await tx.bookImage.createMany({
        data: bookImagesToCreate,
      });

      return createdBook;
    });
  }

  static async getAll({ query }: BookListQueryInput) {
    const skip = (query.page - 1) * query.limit; // offset
    const take = query.limit; // limit

    const where: Prisma.BookWhereInput = {};

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (!query.search) {
      const cache = await redisClient.get(`books:page:${query.page}`);

      if (cache) {
        const cacheBooks = JSON.parse(cache);
        return {
          cache: true,
          books: cacheBooks,
          meta: {
            page: query.page,
            limit: take,
            totalData: cacheBooks.length,
            totalPage: Math.ceil(cacheBooks.length / take),
          },
        };
      }
    }

    const [books, totalBooks] = await Promise.all([
      await prisma.book.findMany({
        where,
        skip,
        take,
        include: {
          book_images: true,
        },
      }),

      await prisma.book.count({
        where,
      }),
    ]);

    if(query.search){
      await redisClient.set(`books:page:${query.page}`, JSON.stringify(books));
    }

    return {
      cache: false,
      books,
      meta: {
        page: query.page,
        limit: take,
        totalData: totalBooks,
        totalPage: Math.ceil(totalBooks / take),
      },
    };
  }
}
