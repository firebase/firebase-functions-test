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

import { database, Change } from 'firebase-functions';
import { app } from 'firebase-admin';

import { testApp } from '../app';

/** Create a DataSnapshot. */
export function makeDataSnapshot(
  /** Value of data for the snapshot. */
  val: string | number | boolean | any[] | object | null,
  /** Full path of the reference (e.g. 'users/alovelace'). */
  refPath: string,
  /** The Firebase app that the database belongs to.
   * The databaseURL supplied when initializing the app will be used for creating this snapshot.
   * You do not need to supply this parameter if you supplied Firebase config values when initializing
   * firebase-functions-test.
   */
  firebaseApp?: app.App,
  /**
   * The RTDB instance to use when creating snapshot. This will override the `firebaseApp` parameter.
   * If omitted the default RTDB instance is used.
   */
  instance?: string
): database.DataSnapshot {
  return new database.DataSnapshot(
    val,
    refPath,
    firebaseApp || testApp().getApp(),
    instance
  );
}

/** Fetch an example data snapshot already populated with data. Can be passed into a wrapped
 * database onCreate or onDelete function.
 */
export function exampleDataSnapshot(): database.DataSnapshot {
  return makeDataSnapshot({ foo: 'bar ' }, 'messages/1234');
}

/** Fetch an example Change object of data snapshots already populated with data.
 * Can be passed into a wrapped database onUpdate or onWrite function.
 */
export function exampleDataSnapshotChange(): Change<database.DataSnapshot> {
  return Change.fromObjects(
    makeDataSnapshot({ foo: 'faz' }, 'messages/1234'),
    makeDataSnapshot({ foo: 'bar' }, 'messages/1234')
  );
}
