import * as bytes from 'bytes';
import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './file-signature.validator';
import { FileSizeType, FileType } from '../types/file.types';
import { createFileTypeRegex } from '../util/file.util';
import { NonEmptyArray } from 'src/shared/util/array.util';

const createFileValidator = (
  maxSize: FileSizeType,
  fileTypes: NonEmptyArray<FileType>,
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileTypes);
  return [
    // 1) Validate file size
    new MaxFileSizeValidator({
      maxSize: bytes(maxSize), // 200 byte
      message: (maxSize) =>
        `File is too big. Max file size is ${maxSize} bytes`,
    }),

    // 2) Validate file type (extension)
    new FileTypeValidator({ fileType: fileTypeRegex }),

    // 3) custom validation (validate file signature)
    new FileSignatureValidator(),
  ];
};

export const createParseFilePipe = (
  maxSize: FileSizeType,
  fileTypes: NonEmptyArray<FileType>,
): ParseFilePipe =>
  new ParseFilePipe({
    validators: createFileValidator(maxSize, fileTypes),
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      console.log(error);
      throw new UnprocessableEntityException(error);
    },
    fileIsRequired: true,
  });
