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

import { expect } from 'chai';

import { FirebaseFunctionsTest } from '../src/lifecycle';
import { mockConfig } from '../src/main';
import { afterEach } from 'mocha';

describe('lifecycle', () => {
  describe('#init', () => {
    let test;

    before(() => {
      test = new FirebaseFunctionsTest();
    });

    afterEach(() => {
      test.cleanup();
    });

    it('sets env variables appropriately if SDK initialized without parameters', () => {
      test.init();
      expect(process.env.FIREBASE_CONFIG).to.equal(
        JSON.stringify({
          databaseURL: 'https://not-a-project.firebaseio.com',
          storageBucket: 'not-a-project.appspot.com',
          projectId: 'not-a-project',
        })
      );
      expect(process.env.GCLOUD_PROJECT).to.equal('not-a-project');
      expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.be.undefined;
    });

    it('sets env variables appropriately if SDK initialized with parameters', () => {
      let firebaseConfig = {
        databaseURL: 'https://my-project.firebaseio.com',
        storageBucket: 'my-project.appspot.com',
        projectId: 'my-project',
      };
      test.init(firebaseConfig, 'path/to/key.json');

      expect(process.env.FIREBASE_CONFIG).to.equal(
        JSON.stringify(firebaseConfig)
      );
      expect(process.env.GCLOUD_PROJECT).to.equal('my-project');
      expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.equal(
        'path/to/key.json'
      );
    });
  });

  describe('#cleanUp', () => {
    beforeEach(() => {
      delete process.env.FIREBASE_CONFIG;
      delete process.env.GCLOUD_PROJECT;
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      delete process.env.CLOUD_RUNTIME_CONFIG;
    });

    afterEach(() => {
      delete process.env.FIREBASE_CONFIG;
      delete process.env.GCLOUD_PROJECT;
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      delete process.env.CLOUD_RUNTIME_CONFIG;
    });

    it('deletes all the env variables if they did not previously exist', () => {
      let test = new FirebaseFunctionsTest();
      test.init();
      mockConfig({ foo: { bar: 'faz ' } });
      test.cleanup();
      expect(process.env.FIREBASE_CONFIG).to.be.undefined;
      expect(process.env.GCLOUD_PROJECT).to.be.undefined;
      expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.be.undefined;
      expect(process.env.CLOUD_RUNTIME_CONFIG).to.be.undefined;
    });

    it('restores env variables if they had previous values', () => {
      process.env.FIREBASE_CONFIG = 'oldFb';
      process.env.GCLOUD_PROJECT = 'oldGc';
      process.env.GOOGLE_APPLICATION_CREDENTIALS = 'oldGac';
      process.env.CLOUD_RUNTIME_CONFIG = 'oldCrc';
      let test = new FirebaseFunctionsTest();

      test.init();
      mockConfig({ foo: { bar: 'faz ' } });
      test.cleanup();

      expect(process.env.FIREBASE_CONFIG).to.equal('oldFb');
      expect(process.env.GCLOUD_PROJECT).to.equal('oldGc');
      expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.equal('oldGac');
      expect(process.env.CLOUD_RUNTIME_CONFIG).to.equal('oldCrc');
    });
  });
});
