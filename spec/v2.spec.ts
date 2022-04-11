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

import {expect} from 'chai';

import {
  _getDefaultCloudEvent,
  wrap,
} from '../src/v2';
import {
  CloudFunction, CloudEvent, alerts, pubsub, storage
} from 'firebase-functions/v2';

describe('v2', () => {
  describe('#wrap', () => {
    describe('background functions', () => {
      const constructBackgroundCF = (eventType?: string) => {
        const cloudFunction = (input) => input;
        cloudFunction.run = (event: CloudEvent) => {
          return {cloudEvent: event};
        };
        const trigger = {
          eventTrigger: {
            resource: 'ref/{wildcard}/nested/{anotherWildcard}',
            eventType: eventType || 'event',
            service: 'service',
          },
        } as unknown;
        cloudFunction.__trigger = trigger;
        cloudFunction.__endpoint = 'endpoint';
        return cloudFunction as CloudFunction<any>;
      };

      const cloudEvent = _getDefaultCloudEvent() as CloudEvent;

      it('should invoke the function with the supplied cloudEvent', () => {
        const wrapped = wrap(constructBackgroundCF());
        expect(wrapped(cloudEvent).cloudEvent).to.equal(cloudEvent);
      });
    });

    describe('alerts', () => {
      describe('alerts.onAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.onAlertPublished('alertType', handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onNewAnrIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onNewAnrIssuePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onNewFatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onNewFatalIssuePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onNewNonfatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onNewNonfatalIssuePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onRegressionAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onRegressionAlertPublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onStabilityDigestPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onStabilityDigestPublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.crashlytics.onVelocityAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.crashlytics.onVelocityAlertPublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.appDistribution.onNewTesterIosDevicePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.appDistribution.onNewTesterIosDevicePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.billing.onPlanAutomatedUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.billing.onPlanAutomatedUpdatePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('alerts.billing.onPlanUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(alerts.billing.onPlanUpdatePublished(handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
    });

    describe('eventarc', () => {
      // Not published yet
      describe('eventarc.onCustomEventPublished()', () => {
        it('is not implemented', () => {
        });
      });
    });

    describe('storage', () => {
      describe('storage.onObjectArchived()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(storage.onObjectArchived('bucket', handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('storage.onObjectDeleted()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(storage.onObjectDeleted('bucket', handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('storage.onObjectFinalized()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(storage.onObjectFinalized('bucket', handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
      describe('storage.onObjectMetadataUpdated()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {};
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(storage.onObjectMetadataUpdated('bucket', handler));
          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
    });

    describe('pubsub', () => {
      describe('pubsub.onMessagePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const data = {
            message: {
              json: '{"a": 1}'
            },
            subscription: 'subscription'
          };
          const cloudEventInstance = {..._getDefaultCloudEvent(), data};
          const handler = (cloudEvent) => ({cloudEvent});
          const cloudFn = wrap(pubsub.onMessagePublished('topic', handler));

          expect(cloudFn(cloudEventInstance).cloudEvent).equal(cloudEventInstance);
        });
      });
    });

    describe('callable functions', () => {
      let wrappedCF;

      before(() => {
        const cloudFunction = (input) => input;
        cloudFunction.run = (cloudEvent: CloudEvent) => {
          return {cloudEvent};
        };
        cloudFunction.__trigger = {
          labels: {
            'deployment-callable': 'true',
          },
          httpsTrigger: {},
        };
        cloudFunction.__endpoint = {
          platform: 'gcfv2',
          labels: {},
          eventTrigger: {
            retry: false,
          }
        };
        wrappedCF = wrap(cloudFunction as CloudFunction<any>);
      });

      it('should invoke the function with the supplied cloudEvent', () => {
        const cloudEvent = {} as CloudEvent;
        expect(wrappedCF(cloudEvent).cloudEvent).to.equal(cloudEvent);
      });
    });
  });
});
