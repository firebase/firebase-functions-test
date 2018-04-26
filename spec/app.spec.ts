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
import * as firebase from 'firebase-admin';

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
    const spy = sinon.spy(firebase, 'initializeApp');

    afterEach(() => {
      spy.resetHistory();
      appInstance.deleteApp();
    });

    it('should initialize a new app if appSingleton does not exist', () => {
      appInstance.getApp();
      expect(spy.called).to.be.true;
    });

    it('should only initialize app once', () => {
      appInstance.getApp();
      appInstance.getApp();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('#deleteApp', () => {
    it('deletes appSingleton if it exists', () => {
      const spy = sinon.spy();
      appInstance.appSingleton = {
        delete: spy,
      };
      appInstance.deleteApp();
      expect(spy.called).to.be.true;
      expect(appInstance.appSingleton).to.equal(undefined);
    });

    it('does not throw an error if there are no apps to delete', () => {
      delete appInstance.appSingleton;
      expect(() => appInstance.deleteApp).to.not.throw(Error);
    });
  });
});
