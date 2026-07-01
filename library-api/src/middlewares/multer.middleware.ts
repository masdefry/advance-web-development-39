import { Request } from 'express';
import multer, { FileFilterCallback, Multer, StorageEngine } from 'multer';
import path from 'path';
import { ResponseError } from '../utils/response-error.util';
import { StatusCodes } from 'http-status-codes';

export class MulterMiddleware {
  private acceptedFiles: string[] = [];
  private storageType: 'diskStorage' | 'memoryStorage' = 'diskStorage';

  constructor(
    acceptedFiles: string[],
    storageType: 'diskStorage' | 'memoryStorage',
  ) {
    this.acceptedFiles = acceptedFiles;
    this.storageType = storageType;
  }
  private storage(): StorageEngine {
    if (this.storageType === 'diskStorage') {
      return multer.diskStorage({
        destination: function (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ) {
          const mainDir = path.join(process.cwd()); // root dir: /libray-api
          cb(null, `${mainDir}/src/uploads`);
        },
        filename: function (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ) {
          const extensionFile = file.originalname.split('.').slice(-1);
          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            '.' +
            extensionFile;
          cb(null, file.fieldname + '-' + uniqueSuffix);
        },
      });
    }

    return multer.memoryStorage();
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (this.acceptedFiles.includes(file?.mimetype)) return cb(null, true);

    return cb(
      new ResponseError(
        StatusCodes.NOT_ACCEPTABLE,
        `File format for ${file.originalname} not accepted`,
      ),
    );
  }

  public upload(limitFileSize: number): Multer {
    return multer({
      storage: this.storage(),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: limitFileSize,
      },
    });
  }
}
