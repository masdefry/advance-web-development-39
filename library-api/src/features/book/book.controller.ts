import { Request, Response } from 'express';
import { validate } from '../../validations/validate';
import { BookValidation } from './book.validation';
import { BookService } from './book.service';
import { StatusCodes } from 'http-status-codes';

export class BookController {
  static async create(req: Request, res: Response) {
    const { body } = validate(BookValidation.CREATE, {
      body: req.body,
    });
    const files: Express.Multer.File[] = Array.isArray(req.files)
    ? req.files
    : [];

    const createdBook = await BookService.create({ body }, files);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `Book created successfully`,
      data: createdBook,
    });
  }

  static async getAll(req: Request, res: Response){
    const {query} = validate(BookValidation.LIST_QUERY, {
      query: req.query
    })

    const {books, meta} = await BookService.getAll({query});

    res.status(StatusCodes.OK).json({
      success: true, 
      message: 'Books retrieved successfully', 
      data: books, 
      meta
    })
  }
}
