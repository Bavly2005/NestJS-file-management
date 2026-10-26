import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1) Validate file size
          new MaxFileSizeValidator({
            maxSize: 200, // 200 byte
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          // 2) Validate file type (extension)
          new FileTypeValidator({ fileType: /png|jpg/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error: string) => {
          console.log(error);
          throw new UnprocessableEntityException(error);
        },
        fileIsRequired: true,
      }),
    )
    file: File,
  ) {
    return file;
  }

  // Multible files
  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 3, { limits: { fieldSize: 2 * 1024 * 1024 } }),
  )
  uploadFiles(@UploadedFiles() files: File[]) {
    return files;
  }
}
