import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/prisma-client.config';
import { ResponseError } from '../../utils/response-error.util';
import { BookCreateInput } from './book.validation';

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

      const bookImageToCreate = files?.map((image) => {
        const destination = image.destination.split('/').slice(-2).join('/');
        return {
          imageUrl: `${destination}/${image?.filename}`,
          bookId: createdBook.id,
        };
      });

      await tx.bookImage.createMany({
        data: bookImageToCreate,
      });

      return createdBook;
    });
  }
}
