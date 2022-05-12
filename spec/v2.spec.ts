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

import { wrapV2 } from '../src/v2';

import {
  CloudFunction,
  alerts,
  pubsub,
  storage,
  eventarc,
  https,
} from 'firebase-functions/v2';

describe('v2', () => {
  describe('#wrapV2', () => {
    const handler = (cloudEvent) => ({ cloudEvent });

    describe('alerts', () => {
      describe('alerts.onAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.onAlertPublished('alertType', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onNewAnrIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewAnrIssuePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onNewFatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewFatalIssuePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onNewNonfatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewNonfatalIssuePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onRegressionAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onRegressionAlertPublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onStabilityDigestPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onStabilityDigestPublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.crashlytics.onVelocityAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onVelocityAlertPublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.appDistribution.onNewTesterIosDevicePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.appDistribution.onNewTesterIosDevicePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.billing.onPlanAutomatedUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.billing.onPlanAutomatedUpdatePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
      describe('alerts.billing.onPlanUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.billing.onPlanUpdatePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({});
        });
      });
    });

    describe('eventarc', () => {
      describe('eventarc.onCustomEventPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const eventType = 'EVENT_TYPE';
          const cloudFn = eventarc.onCustomEventPublished(eventType, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({ type: eventType });
        });
      });
    });

    describe('storage', () => {
      describe('storage.onObjectArchived()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectArchived(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({
            bucket,
          });
        });
      });
      describe('storage.onObjectDeleted()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectDeleted(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({
            bucket,
          });
        });
      });
      describe('storage.onObjectFinalized()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectFinalized(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({
            bucket,
          });
        });
      });
      describe('storage.onObjectMetadataUpdated()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectMetadataUpdated(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          expect(cloudFnWrap().cloudEvent).to.include({
            bucket,
          });
        });
      });
    });

    describe('pubsub', () => {
      describe('pubsub.onMessagePublished()', () => {
        it('should update CloudEvent without data provided', () => {
          const cloudFn = pubsub.onMessagePublished('topic', handler);
          const cloudFnWrap = wrapV2(cloudFn);

          expect(cloudFnWrap().cloudEvent.data.message).to.include({
            data: 'eyJoZWxsbyI6IndvcmxkIn0=', // Note: Defined in the partial
          });
        });
        it('should update CloudEvent data message with override', () => {
          const data = {
            message: {
              json: { firebase: 'test' },
              data: 'eyJmaXJlYmFzZSI6InRlc3QifQ==',
            },
            subscription: 'subscription',
          };
          const cloudFn = pubsub.onMessagePublished('topic', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEventPartial = { data };

          expect(
            cloudFnWrap(cloudEventPartial).cloudEvent.data.message.json
          ).to.equal(data.message.json);
        });
      });
    });

    describe('callable functions', () => {
      it('return an error because they are not supported', () => {
        const cloudFunction = https.onCall((data) => data);
        cloudFunction.__endpoint = {
          platform: 'gcfv2',
          labels: {},
          callableTrigger: {},
          concurrency: 20,
          minInstances: 3,
          region: ['us-west1', 'us-central1'],
        };

        try {
          const wrappedCF = wrapV2(cloudFunction as any);
          wrappedCF();
        } catch (e) {
          expect(e.message).to.equal(
            'Wrap function is not available for callableTriggers functions.'
          );
        }
      });
    });

    describe('generated CloudEvent', () => {
      it('should create CloudEvent with appropriate fields for pubsub.onMessagePublished()', () => {
        const data = {
          message: {
            json: '{"hello_firebase": "world_firebase"}',
          },
          subscription: 'subscription',
        };
        const cloudFn = pubsub.onMessagePublished('topic', handler);
        const cloudEvent = wrapV2(cloudFn)({ data }).cloudEvent;

        expect(cloudEvent.type).equal(
          'google.cloud.pubsub.topic.v1.messagePublished'
        );
        expect(cloudEvent.data.message).to.include({
          json: '{"hello_firebase": "world_firebase"}',
        });
      });
      it('should generate source from original CloudFunction', () => {
        const type = 'google.firebase.firebasealerts.alerts.v1.published';
        const cloudEventOverride = {
          type,
        };

        const bucketName = 'bucket_name';
        const cloudFn = storage.onObjectArchived(bucketName, handler);
        /**
         * Note: the original {@link CloudEvent} was a storage event.
         * The test however, is providing a different type.
         * This creates strange behaviour where {@link CloudEvent.source}
         * is inferred by the {@link CloudFunction}.
         * It is the responsibility of the end-user to override the
         * {@link CloudEvent.source} to match their expectations.
         */
        const cloudEvent = wrapV2(cloudFn)(cloudEventOverride).cloudEvent;

        const expectedType = type;
        const expectedSource = `//storage.googleapis.com/projects/_/buckets/${bucketName}`;

        expect(cloudEvent.type).equal(expectedType);
        expect(cloudEvent.source).equal(expectedSource);
      });
      it('should override source and fields', () => {
        const type = 'google.firebase.firebasealerts.alerts.v1.published';
        const source = '//firebasealerts.googleapis.com/projects/42';
        const cloudEventOverride = {
          type,
          source,
        };

        const bucketName = 'bucket_name';
        const cloudFn = storage.onObjectArchived(bucketName, handler);

        const mergedCloudEvent = wrapV2(cloudFn)(cloudEventOverride).cloudEvent;

        const expectedType = type;
        const expectedSource = source;

        expect(mergedCloudEvent.type).equal(expectedType);
        expect(mergedCloudEvent.source).equal(expectedSource);
      });
      it('should override data with user supplied partial', () => {
        const cloudEventOverride = {
          data: {
            contentType: 'application/octet-stream',
          },
        };

        const bucketName = 'bucket_name';
        const cloudFn = storage.onObjectArchived(bucketName, handler);

        const mergedCloudEvent = wrapV2(cloudFn)(cloudEventOverride).cloudEvent;
        expect(mergedCloudEvent.data?.size).not.equal(42);
        expect(mergedCloudEvent.data?.contentType).equal(
          'application/octet-stream'
        );
      });
    });
  });
});
