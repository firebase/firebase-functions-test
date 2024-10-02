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

import { alerts, storage } from 'firebase-functions';
import { generateMockCloudEvent } from '../../src/cloudevent/generate';

describe('generate (CloudEvent)', () => {
  describe('#generateMockCloudEvent', () => {
    describe('alerts.billing.onPlanAutomatedUpdatePublished()', () => {
      it('should create CloudEvent with appropriate fields', () => {
        const cloudFn = alerts.billing.onPlanAutomatedUpdatePublished(() => {});
        const cloudEvent = generateMockCloudEvent(cloudFn);

        expect(cloudEvent.type).equal(
          'google.firebase.firebasealerts.alerts.v1.published'
        );
        expect(cloudEvent.source).equal(
          '//firebasealerts.googleapis.com/projects/42'
        );
        expect(cloudEvent.subject).equal(undefined);
      });
    });
    describe('storage.onObjectArchived', () => {
      it('should create CloudEvent with appropriate fields', () => {
        const bucketName = 'bucket_name';
        const cloudFn = storage.onObjectArchived(bucketName, () => {});
        const cloudEvent = generateMockCloudEvent(cloudFn);

        expect(cloudEvent.type).equal(
          'google.cloud.storage.object.v1.archived'
        );
        expect(cloudEvent.source).equal(
          `//storage.googleapis.com/projects/_/buckets/${bucketName}`
        );
        expect(cloudEvent.subject).equal('objects/file_name');
      });
    });
  });
});
