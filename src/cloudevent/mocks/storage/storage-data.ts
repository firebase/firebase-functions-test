import { storage } from 'firebase-functions';
import { FILENAME } from '../helpers';

/** Storage Data */
export function getStorageObjectData(
  bucket: string,
  filename: string,
  generation: number
): storage.StorageObjectData {
  const now = new Date().toISOString();
  return {
    metageneration: 1,
    metadata: {
      firebaseStorageDownloadTokens: '00000000-0000-0000-0000-000000000000',
    },
    kind: 'storage#object',
    mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/${FILENAME}?generation=${generation}&alt=media`,
    etag: 'xxxxxxxxx/yyyyy=',
    timeStorageClassUpdated: now,
    generation,
    md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
    crc32c: 'qqqqqq==',
    selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/${FILENAME}`,
    name: FILENAME,
    storageClass: 'REGIONAL',
    size: 42,
    updated: now,
    contentDisposition: `inline; filename*=utf-8''${FILENAME}`,
    contentType: 'image/gif',
    timeCreated: now,
    id: `${bucket}/${FILENAME}/${generation}`,
    bucket,
  };
}
