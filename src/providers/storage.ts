// The MIT License (MIT)
//
// Copyright (c) 2018 Firebase
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { storage } from 'firebase-functions';

/** Create an ObjectMetadata */
export function makeObjectMetadata(
  /** Fields of ObjectMetadata that you'd like to specify. */
  fields: { [key: string]: string },
): storage.ObjectMetadata {
  const configBucket = JSON.parse(process.env.FIREBASE_CONFIG || '{}').storageBucket;
  const template = {
    kind: 'storage#object',
    id: '',
    bucket: configBucket || '',
    timeCreated: '',
    updated: '',
    storageClass: 'STANDARD',
    size: '',
  };
  return Object.assign(template, fields);
}

/** Fetch an example ObjectMetadata already populated with data. */
export function exampleObjectMetadata(): storage.ObjectMetadata {
  return {
    bucket: 'bucket',
    contentDisposition: 'inline; filename*=utf-8\'\'my-file',
    contentType: 'application/octet-stream',
    crc32c: 'pbXl9g==',
    etag: 'CK/F2KHP79kCEAE=',
    generation: '1521161254347439',
    id: 'bucket/my-file/1521161254347439',
    kind: 'storage#object',
    md5Hash: 'nvpapVwyoKYUTPwuxMe3Sg==',
    mediaLink: 'https://www.googleapis.com/download/storage/v1/b/bucket/'
      + 'o/my-file?generation=1521161254347439&alt=media',
    metadata: { firebaseStorageDownloadTokens: 'fb577445-2f50-408b-80f2-c2f9991505b8' },
    metageneration: '1',
    name: 'my-file',
    selfLink: 'https://www.googleapis.com/storage/v1/b/bucket/o/my-file',
    size: '102101',
    storageClass: 'STANDARD',
    timeCreated: '2018-03-16T00:47:34.340Z',
    timeStorageClassUpdated: '2018-03-16T00:47:34.340Z',
    updated: '2018-03-16T00:47:34.340Z',
  };
}
