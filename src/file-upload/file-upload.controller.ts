import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MaxFileCount } from 'src/shared/files/constants/file-count.constant';
import { createParseFilePipe } from 'src/shared/files/validators/file-validation-factory';

type File = Express.Multer.File;

@Controller('file-upload')
export class FileUploadController {
  constructor() {}
  // Sigle file
  @Post('/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, //2MB
      },
    }),
  )
  uploadFile(
    @UploadedFile(createParseFilePipe('2KB', ['png', 'jpg']))
    file: File,
  ) {
    return file;
  }

  // Multible files
  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCTS_IMAGES))
  uploadFiles(
    @UploadedFiles(createParseFilePipe('2KB', ['png', 'jpg']))
    files: File[],
  ) {
    return files.map((file) => file.originalname);
  }
}
