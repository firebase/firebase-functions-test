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

import * as firebase from 'firebase-admin';

/** @internal */
export function testApp(): testApp.App {
  if (typeof testApp.singleton === 'undefined') {
    testApp.init();
  }
  return testApp.singleton;
}

/** @internal */
export namespace testApp {
  export let singleton: testApp.App;
  export let init = () => (singleton = new testApp.App());

  export class App {
    appSingleton: firebase.app.App;
    constructor() {}

    getApp(): firebase.app.App {
      if (typeof this.appSingleton === 'undefined') {
        const config = process.env.FIREBASE_CONFIG
          ? JSON.parse(process.env.FIREBASE_CONFIG)
          : {};
        this.appSingleton = firebase.initializeApp(
          config,
          // Give this app a name so it does not conflict with apps that user initialized.
          'firebase-functions-test'
        );
      }
      return this.appSingleton;
    }

    deleteApp() {
      if (this.appSingleton) {
        this.appSingleton.delete();
        delete this.appSingleton;
      }
    }
  }
}
