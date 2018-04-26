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

import { AppOptions } from 'firebase-admin';
import { merge } from 'lodash';

import { FirebaseFunctionsTest } from './lifecycle';
import { features as lazyFeatures, FeaturesList } from './features';

export = (firebaseConfig?: AppOptions, pathToServiceAccountKey?: string) => {
  const test = new FirebaseFunctionsTest();
  test.init(firebaseConfig, pathToServiceAccountKey);
  // Ensure other files get loaded after init function, since they load `firebase-functions`
  // which will issue warning if process.env.FIREBASE_CONFIG is not yet set.
  let features = require('./features').features as typeof lazyFeatures;
  features = merge({}, features, {
    cleanup: () => test.cleanup(),
  });
  return features as FeaturesList;
};
