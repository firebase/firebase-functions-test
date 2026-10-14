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
import * as sinon from 'sinon';
import * as adminApp from 'firebase-admin/app';

import { testApp } from '../src/app';
import { FirebaseFunctionsTest } from '../src/lifecycle';

describe('app', () => {
  let appInstance;
  let test;

  before(() => {
    test = new FirebaseFunctionsTest();
    test.init();
    appInstance = testApp();
  });

  after(() => {
    test.cleanup();
  });

  describe('#getApp', () => {
    afterEach(() => {
      appInstance.deleteApp();
    });

    it('should initialize a new app if appSingleton does not exist', () => {
      const app = appInstance.getApp();
      expect(app.name).to.equal('firebase-functions-test');
    });

    it('should only initialize app once', () => {
      expect(appInstance.getApp()).to.equal(appInstance.getApp());
    });
  });

  describe('#deleteApp', () => {
    it('deletes appSingleton if it exists', () => {
      const app = appInstance.getApp();
      expect(adminApp.getApps()).to.include(app);
      appInstance.deleteApp();
      expect(appInstance.appSingleton).to.equal(undefined);
      expect(adminApp.getApps()).to.not.include(app);
    });

    it('does not throw an error if there are no apps to delete', () => {
      delete appInstance.appSingleton;
      expect(() => appInstance.deleteApp).to.not.throw(Error);
    });
  });
});
