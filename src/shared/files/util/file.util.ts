import { FileType } from '../types/file.types';

export const createFileTypeRegex = (fileTypes: FileType[]) =>
  new RegExp(fileTypes.join('|'));
