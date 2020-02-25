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

import 'mocha';
import { expect } from 'chai';

describe('index', () => {
  /* tslint:disable-next-line:no-var-requires */
  const indexExport = require('../src')(
    { projectId: 'fakeProject' },
    'fakeServiceAccount'
  );
  after(() => {
    // Call cleanup (handles case of cleanup function not existing)
    indexExport.cleanup && indexExport.cleanup();
  });

  it('should export the expected functions and namespaces', () => {
    expect(Object.getOwnPropertyNames(indexExport).sort()).to.deep.equal([
      'analytics',
      'auth',
      'cleanup',
      'crashlytics',
      'database',
      'firestore',
      'makeChange',
      'mockConfig',
      'pubsub',
      'storage',
      'wrap',
    ]);
  });

  it('should set env variables based parameters SDK was initialized with', () => {
    expect(process.env.FIREBASE_CONFIG).to.equal(
      JSON.stringify({ projectId: 'fakeProject' })
    );
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.equal(
      'fakeServiceAccount'
    );
  });

  it('should clean up env variables once cleanup is called', () => {
    indexExport.cleanup();
    expect(process.env.FIREBASE_CONFIG).to.equal(undefined);
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.equal(undefined);
  });
});

import './lifecycle.spec';
import './main.spec';
import './app.spec';
import './providers/https.spec';
import './providers/firestore.spec';
import './providers/database.spec';
import './providers/scheduled.spec';
// import './providers/analytics.spec';
// import './providers/auth.spec';
// import './providers/https.spec';
// import './providers/pubsub.spec';
// import './providers/storage.spec';
// import './providers/crashlytics.spec';
