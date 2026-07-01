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

import { auth } from 'firebase-functions/v1';

/** Create a UserRecord. */
export function makeUserRecord(
  /** Fields of AuthRecord that you'd like to specify. */
  fields: { [key: string]: string | boolean }
): auth.UserRecord {
  return auth.userRecordConstructor(Object.assign({ uid: '' }, fields));
}

/** Fetch an example UserRecord already populated with data. */
export function exampleUserRecord(): auth.UserRecord {
  return auth.userRecordConstructor({
    email: 'user@gmail.com',
    metadata: {
      creationTime: '2018-03-13T01:24:48Z',
      lastSignInTime: '2018-04-03T03:52:48Z',
    },
    uid: 'SQol8dFfyMapsQtRD4JgZdC5r1G2',
  });
}
