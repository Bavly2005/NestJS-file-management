import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './file-signature.validator';

const createFileValidator = (
  maxSize: number,
  fileType: RegExp | string,
): FileValidator[] => [
  // 1) Validate file size
  new MaxFileSizeValidator({
    maxSize, // 200 byte
    message: (maxSize) => `File is too big. Max file size is ${maxSize} bytes`,
  }),

  // 2) Validate file type (extension)
  new FileTypeValidator({ fileType }),

  // 3) custom validation (validate file signature)
  new FileSignatureValidator(),
];

export const createParseFilePipe = (
  maxSize: number,
  fileType: RegExp | string,
): ParseFilePipe =>
  new ParseFilePipe({
    validators: createFileValidator(maxSize, fileType),
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      console.log(error);
      throw new UnprocessableEntityException(error);
    },
    fileIsRequired: true,
  });
