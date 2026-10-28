import { FileType } from '../types/file.types';
import { lookup } from 'mime-types';

export const createFileTypeRegex = (fileTypes: FileType[]): RegExp => {
  const mediaType = fileTypes
    .map((type) => lookup(type))
    .filter((type) => type !== false);

  return new RegExp(mediaType.join('|'));
};
