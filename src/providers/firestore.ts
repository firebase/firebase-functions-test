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

import { Change } from 'firebase-functions';
import { dateToTimestampProto } from 'firebase-functions/lib/encoder';
import { firestore, app } from 'firebase-admin';
import { has, get, isEmpty, isPlainObject, mapValues } from 'lodash';

import { testApp } from '../app';

import * as http from 'http';

/** Optional parameters for creating a DocumentSnapshot. */
export interface DocumentSnapshotOptions {
  /** ISO timestamp string for the snapshot was read, default is current time.  */
  readTime?: string;
  /** ISO timestamp string for the snapshot was created, default is current time.  */
  createTime?: string;
  /** ISO timestamp string for the snapshot was last updated, default is current time.  */
  updateTime?: string;
  /** The Firebase app that the Firestore database belongs to. You do not need to supply
   * this parameter if you supplied Firebase config values when initializing firebase-functions-test.
   */
  firebaseApp?: app.App;
}

/** Create a DocumentSnapshot. */
export function makeDocumentSnapshot(
  /** Key-value pairs representing data in the document, pass in `{}` to mock the snapshot of
   * a document that doesn't exist.
   */
  data: { [key: string]: any },
  /** Full path of the reference (e.g. 'users/alovelace') */
  refPath: string,
  options?: DocumentSnapshotOptions
) {
  let firestoreService;
  let project;
  if (has(options, 'app')) {
    firestoreService = firestore(options.firebaseApp);
    project = get(options, 'app.options.projectId');
  } else {
    firestoreService = firestore(testApp().getApp());
    project = process.env.GCLOUD_PROJECT;
  }

  const resource = `projects/${project}/databases/(default)/documents/${refPath}`;
  const proto = isEmpty(data)
    ? resource
    : {
        fields: objectToValueProto(data),
        createTime: dateToTimestampProto(
          get(options, 'createTime', new Date().toISOString())
        ),
        updateTime: dateToTimestampProto(
          get(options, 'updateTime', new Date().toISOString())
        ),
        name: resource,
      };

  const readTimeProto = dateToTimestampProto(
    get(options, 'readTime') || new Date().toISOString()
  );
  return firestoreService.snapshot_(proto, readTimeProto, 'json');
}

/** Fetch an example document snapshot already populated with data. Can be passed into a wrapped
 * Firestore onCreate or onDelete function.
 */
export function exampleDocumentSnapshot(): firestore.DocumentSnapshot {
  return makeDocumentSnapshot(
    {
      aString: 'foo',
      anObject: {
        a: 'bar',
        b: 'faz',
      },
      aNumber: 7,
    },
    'records/1234'
  );
}

/** Fetch an example Change object of document snapshots already populated with data.
 * Can be passed into a wrapped Firestore onUpdate or onWrite function.
 */
export function exampleDocumentSnapshotChange(): Change<
  firestore.DocumentSnapshot
> {
  return Change.fromObjects(
    makeDocumentSnapshot(
      {
        anObject: {
          a: 'bar',
        },
        aNumber: 7,
      },
      'records/1234'
    ),
    makeDocumentSnapshot(
      {
        aString: 'foo',
        anObject: {
          a: 'qux',
          b: 'faz',
        },
        aNumber: 7,
      },
      'records/1234'
    )
  );
}

/** @internal */
export function objectToValueProto(data: object) {
  const encodeHelper = (val) => {
    if (typeof val === 'string') {
      return {
        stringValue: val,
      };
    }
    if (typeof val === 'boolean') {
      return {
        booleanValue: val,
      };
    }
    if (typeof val === 'number') {
      if (val % 1 === 0) {
        return {
          integerValue: val,
        };
      }
      return {
        doubleValue: val,
      };
    }
    if (val instanceof Date) {
      return {
        timestampValue: val.toISOString(),
      };
    }
    if (val instanceof Array) {
      let encodedElements = [];
      for (const elem of val) {
        const enc = encodeHelper(elem);
        if (enc) {
          encodedElements.push(enc);
        }
      }
      return {
        arrayValue: {
          values: encodedElements,
        },
      };
    }
    if (val === null) {
      return {
        nullValue: 'NULL_VALUE',
      };
    }
    if (val instanceof Buffer || val instanceof Uint8Array) {
      return {
        bytesValue: val,
      };
    }
    if (val instanceof firestore.DocumentReference) {
      const projectId: string = get(val, '_referencePath.projectId');
      const database: string = get(val, '_referencePath.databaseId');
      const referenceValue: string = [
        'projects',
        projectId,
        'databases',
        database,
        val.path,
      ].join('/');
      return { referenceValue };
    }
    if (val instanceof firestore.Timestamp) {
      return {
        timestampValue: val.toDate().toISOString(),
      };
    }
    if (isPlainObject(val)) {
      return {
        mapValue: {
          fields: objectToValueProto(val),
        },
      };
    }
    throw new Error(
      'Cannot encode ' +
        val +
        'to a Firestore Value.' +
        ' Local testing does not yet support Firestore geo points.'
    );
  };

  return mapValues(data, encodeHelper);
}

const FIRESTORE_ADDRESS_ENVS = [
  'FIRESTORE_EMULATOR_HOST',
  'FIREBASE_FIRESTORE_EMULATOR_ADDRESS',
];

const FIRESTORE_ADDRESS = FIRESTORE_ADDRESS_ENVS.reduce(
  (addr, name) => process.env[name] || addr,
  'localhost:8080'
);
const FIRESTORE_PORT = FIRESTORE_ADDRESS.split(':')[1];

/** Clears all data in firestore. Works only in offline mode.
 */
export function clearFirestoreData(options: { projectId: string } | string) {
  return new Promise((resolve, reject) => {
    let projectId;

    if (typeof options === 'string') {
      projectId = options;
    } else if (typeof options === 'object' && has(options, 'projectId')) {
      projectId = options.projectId;
    } else {
      throw new Error('projectId not specified');
    }

    const config = {
      method: 'DELETE',
      hostname: 'localhost',
      port: FIRESTORE_PORT,
      path: `/emulator/v1/projects/${projectId}/databases/(default)/documents`,
    };

    const req = http.request(config, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`statusCode: ${res.statusCode}`));
      }
      res.on('data', () => {});
      res.on('end', resolve);
    });

    req.on('error', (error) => {
      reject(error);
    });

    const postData = JSON.stringify({
      database: `projects/${projectId}/databases/(default)`,
    });

    req.setHeader('Content-Length', postData.length);

    req.write(postData);
    req.end();
  });
}
