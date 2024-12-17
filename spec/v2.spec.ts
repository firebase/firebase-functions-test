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
  database,
  pubsub,
  remoteConfig,
  storage,
  testLab,
  eventarc,
  https,
  firestore,
} from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { makeDataSnapshot } from '../src/providers/database';
import { makeDocumentSnapshot } from '../src/providers/firestore';
import { inspect } from 'util';

describe('v2', () => {
  describe('#wrapV2', () => {
    const handler = (cloudEvent) => ({ cloudEvent });

    describe('alerts', () => {
      describe('alerts.onAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.onAlertPublished('alertType', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            alertType: 'appDistribution.newTesterIosDevice',
            appId: '__APP_ID__',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {},
            },
          });
        });
      });

      describe('alerts.performance.onThresholdAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.performance.onThresholdAlertPublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            alertType: 'performance.threshold',
            appId: '__APP_ID__',
            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                eventName: 'test.com/api/123',
                eventType: 'network_request',
                metricType: 'duration',
                numSamples: 200,
                thresholdValue: 100,
                thresholdUnit: 'ms',
                violationValue: 200,
                violationUnit: 'ms',
                investigateUri: 'firebase.google.com/firebase/console',
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onNewAnrIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewAnrIssuePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewAnrIssuePayload',
                issue: {
                  appVersion: 'crashlytics_issue_app_version',
                  id: 'crashlytics_issue_id',
                  subtitle: 'crashlytics_issue_subtitle',
                  title: 'crashlytics_issue_title',
                },
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onNewFatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewFatalIssuePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewFatalIssuePayload',
                issue: {
                  appVersion: 'crashlytics_issue_app_version',
                  id: 'crashlytics_issue_id',
                  subtitle: 'crashlytics_issue_subtitle',
                  title: 'crashlytics_issue_title',
                },
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onNewNonfatalIssuePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onNewNonfatalIssuePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewNonfatalIssuePayload',
                issue: {
                  appVersion: 'crashlytics_issue_app_version',
                  id: 'crashlytics_issue_id',
                  subtitle: 'crashlytics_issue_subtitle',
                  title: 'crashlytics_issue_title',
                },
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onRegressionAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onRegressionAlertPublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsRegressionAlertPayload',
                issue: {
                  appVersion: 'crashlytics_issue_app_version',
                  id: 'crashlytics_issue_id',
                  subtitle: 'crashlytics_issue_subtitle',
                  title: 'crashlytics_issue_title',
                },
                resolveTime: cloudEvent.data.payload.resolveTime,
                type: 'test type',
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onStabilityDigestPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onStabilityDigestPublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsStabilityDigestPayload',
                digestDate: cloudEvent.data.payload.digestDate,
                trendingIssues: [
                  {
                    eventCount: 100,
                    issue: {
                      appVersion: 'crashlytics_issue_app_version',
                      id: 'crashlytics_issue_id',
                      subtitle: 'crashlytics_issue_subtitle',
                      title: 'crashlytics_issue_title',
                    },
                    type: 'type',
                    userCount: 100,
                  },
                ],
              },
            },
          });
        });
      });

      describe('alerts.crashlytics.onVelocityAlertPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.crashlytics.onVelocityAlertPublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsVelocityAlertPayload',
                crashCount: 100,
                crashPercentage: 50,
                createTime: cloudEvent.data.payload.createTime,
                firstVersion: '1.1',
                issue: {
                  appVersion: 'crashlytics_issue_app_version',
                  id: 'crashlytics_issue_id',
                  subtitle: 'crashlytics_issue_subtitle',
                  title: 'crashlytics_issue_title',
                },
              },
            },
          });
        });
      });

      describe('alerts.appDistribution.onNewTesterIosDevicePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.appDistribution.onNewTesterIosDevicePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.AppDistroNewTesterIosDevicePayload',
                testerDeviceIdentifier: 'tester device identifier',
                testerDeviceModelName: 'tester device model name',
                testerEmail: 'test@test.com',
                testerName: 'tester name',
              },
            },
          });
        });
      });

      describe('alerts.billing.onPlanAutomatedUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.billing.onPlanAutomatedUpdatePublished(
            handler
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.BillingPlanAutomatedUpdatePayload',
                billingPlan: 'flame',
                notificationType: 'upgrade',
              },
            },
          });
        });
      });

      describe('alerts.billing.onPlanUpdatePublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = alerts.billing.onPlanUpdatePublished(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            type: 'google.firebase.firebasealerts.alerts.v1.published',
            source: '//firebasealerts.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              endTime: cloudEvent.data.endTime,
              payload: {
                ['@type']:
                  'type.googleapis.com/google.events.firebase.firebasealerts.v1.BillingPlanUpdatePayload',
                billingPlan: 'flame',
                notificationType: 'upgrade',
                principalEmail: 'test@test.com',
              },
            },
          });
        });
      });
    });

    describe('remoteConfig', () => {
      describe('onConfigUpdated', () => {
        it('should trigger mock config update event', () => {
          const cloudFn = remoteConfig.onConfigUpdated(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            specversion: '1.0',
            id: cloudEvent.id,
            time: cloudEvent.time,
            type: 'google.firebase.remoteconfig.remoteConfig.v1.updated',
            source: '//firebaseremoteconfig.googleapis.com/projects/42',
            data: {
              versionNumber: 2,
              updateTime: cloudEvent.data.updateTime,
              updateUser: {
                name: 'testuser',
                email: 'test@example.com',
                imageUrl: 'test.com/img-url',
              },
              description: 'config update test',
              updateOrigin: 'REMOTE_CONFIG_UPDATE_ORIGIN_UNSPECIFIED',
              updateType: 'REMOTE_CONFIG_UPDATE_TYPE_UNSPECIFIED',
              rollbackSource: 0,
            },
          });
        });
      });
    });

    describe('testLab', () => {
      describe('onTestMatrixCompleted', () => {
        it('should trigger mock test matrix event data', () => {
          const cloudFn = testLab.onTestMatrixCompleted(handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            specversion: '1.0',
            id: cloudEvent.id,
            time: cloudEvent.time,
            type: 'google.firebase.testlab.testMatrix.v1.completed',
            source: '//firebasetestlab.googleapis.com/projects/42',
            data: {
              createTime: cloudEvent.data.createTime,
              state: 'TEST_STATE_UNSPECIFIED',
              invalidMatrixDetails: '',
              outcomeSummary: 'OUTCOME_SUMMARY_UNSPECIFIED',
              resultStorage: {
                toolResultsHistory: 'projects/42/histories/1234',
                toolResultsExecution:
                  'projects/42/histories/1234/executions/5678',
                resultsUri: 'console.firebase.google.com/test/results',
                gcsPath: 'gs://bucket/path/to/test',
              },
              clientInfo: {
                client: 'gcloud',
                details: {},
              },
              testMatrixId: '1234',
            },
          });
        });
      });
    });

    describe('firestore', () => {
      describe('document path', () => {
        it('should resolve default document path', () => {
          const cloudFn = firestore.onDocumentCreated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent.document).equal('foo/bar/baz');
        });

        it('should resolve default document given StringParam', () => {
          process.env.doc_path = 'foo/StringParam/baz';
          const cloudFn = firestore.onDocumentCreated('', handler);
          cloudFn.__endpoint.eventTrigger.eventFilterPathPatterns.document = defineString(
            'doc_path'
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent.document).equal('foo/StringParam/baz');
        });

        it('should resolve using params', () => {
          const cloudFn = firestore.onDocumentCreated('users/{user}', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              user: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;

          expect(cloudEvent.document).equal('users/123');
        });

        it('should resolve with undefined string if variable is missing', () => {
          const cloudFn = firestore.onDocumentCreated('users/{user}', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {},
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;

          expect(cloudEvent.document).equal('users/undefined');
        });
      });

      describe('document options', () => {
        it('resolves default document options correctly', () => {
          const cloudFn = firestore.onDocumentCreated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent.document).equal('foo/bar/baz');
          expect(cloudEvent.database).equal('(default)');
          expect(cloudEvent.namespace).equal('(default)');
        });

        it('reads custom DocumentOptions correctly', () => {
          const documentOptions = {
            document: 'foo/bar/baz',
            database: 'custom-database',
            namespace: 'custom-namespace',
          };
          const cloudFn = firestore.onDocumentCreated(documentOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent.document).equal(documentOptions.document);
          expect(cloudEvent.database).equal(documentOptions.database);
          expect(cloudEvent.namespace).equal(documentOptions.namespace);
        });
      });

      describe('firestore.onDocumentCreated', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = firestore.onDocumentCreated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent).deep.equal({
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',
            type: 'google.cloud.firestore.document.v1.created',
            source: '',

            data: cloudEvent.data,
            location: 'us-central1',
            project: 'testproject',
            database: '(default)',
            namespace: '(default)',
            document: 'foo/bar/baz',
            params: {},
          });
        });

        it('should use overridden data', () => {
          const cloudFn = firestore.onDocumentCreated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const docData = { foo: 'bar' };
          const data = makeDocumentSnapshot(docData, 'foo/bar/baz');
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.data()).deep.equal(docData);
        });

        it('should accept json data', () => {
          const cloudFn = firestore.onDocumentCreated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const docData = { foo: 'bar' };
          const cloudEvent = cloudFnWrap({ data: docData }).cloudEvent;

          expect(cloudEvent.data.data()).deep.equal(docData);
        });
      });

      describe('firestore.onDocumentDeleted()', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = firestore.onDocumentDeleted('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent).deep.equal({
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',
            type: 'google.cloud.firestore.document.v1.deleted',
            source: '',

            data: cloudEvent.data,
            location: 'us-central1',
            project: 'testproject',
            database: '(default)',
            namespace: '(default)',
            document: 'foo/bar/baz',
            params: {},
          });
        });

        it('should use overridden data', () => {
          const cloudFn = firestore.onDocumentDeleted('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const docData = { foo: 'bar' };
          const data = makeDocumentSnapshot(docData, 'foo/bar/baz');
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.data()).deep.equal(docData);
        });

        it('should accept json data', () => {
          const cloudFn = firestore.onDocumentDeleted('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const docData = { foo: 'bar' };
          const cloudEvent = cloudFnWrap({ data: docData }).cloudEvent;

          expect(cloudEvent.data.data()).deep.equal(docData);
        });
      });

      describe('firestore.onDocumentUpdated', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = firestore.onDocumentUpdated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent).deep.equal({
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',
            type: 'google.cloud.firestore.document.v1.updated',
            source: '',

            data: cloudEvent.data,
            location: 'us-central1',
            project: 'testproject',
            database: '(default)',
            namespace: '(default)',
            document: 'foo/bar/baz',
            params: {},
          });
        });

        it('should use overridden data', () => {
          const cloudFn = firestore.onDocumentUpdated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);

          const afterDataVal = { snapshot: 'after' };
          const after = makeDocumentSnapshot(afterDataVal, 'foo/bar/baz');

          const beforeDataVal = { snapshot: 'before' };
          const before = makeDocumentSnapshot(beforeDataVal, 'foo/bar/baz');

          const data = { before, after };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.data()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.data()).deep.equal(afterDataVal);
        });

        it('should accept json data', () => {
          const cloudFn = firestore.onDocumentUpdated('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };
          const beforeDataVal = { snapshot: 'before' };

          const data = { before: beforeDataVal, after: afterDataVal };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.data()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.data()).deep.equal(afterDataVal);
        });
      });

      describe('firestore.onDocumentWritten', () => {
        it('should update CloudEvent appropriately', () => {
          const cloudFn = firestore.onDocumentWritten('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;

          expect(cloudEvent).deep.equal({
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',
            type: 'google.cloud.firestore.document.v1.written',
            source: '',

            data: cloudEvent.data,
            location: 'us-central1',
            project: 'testproject',
            database: '(default)',
            namespace: '(default)',
            document: 'foo/bar/baz',
            params: {},
          });
        });

        it('should use overridden data', () => {
          const cloudFn = firestore.onDocumentWritten('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);

          const afterDataVal = { snapshot: 'after' };
          const after = makeDocumentSnapshot(afterDataVal, 'foo/bar/baz');

          const beforeDataVal = { snapshot: 'before' };
          const before = makeDocumentSnapshot(beforeDataVal, 'foo/bar/baz');

          const data = { before, after };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.data()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.data()).deep.equal(afterDataVal);
        });

        it('should accept json data', () => {
          const cloudFn = firestore.onDocumentWritten('foo/bar/baz', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };
          const beforeDataVal = { snapshot: 'before' };

          const data = { before: beforeDataVal, after: afterDataVal };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.data()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.data()).deep.equal(afterDataVal);
        });
      });
    });

    describe('database', () => {
      describe('ref', () => {
        it('should resolve default ref', () => {
          const referenceOptions = {
            ref: 'foo/bar/baz',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent.ref).equal('foo/bar/baz');
        });

        it('should resolve default ref given StringParam', () => {
          process.env.rtdb_ref = 'foo/StringParam/baz';
          const referenceOptions = {
            ref: '',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          cloudFn.__endpoint.eventTrigger.eventFilterPathPatterns.ref = defineString(
            'rtdb_ref'
          );
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent.ref).equal('foo/StringParam/baz');
        });

        // it('should resolve default ref given TernaryExpression', () => {
        //   const ref1 = defineString('rtdb_ref_1');
        //   process.env.rtdb_ref_1 = 'foo/StringParam/1';
        //   const ref2 = defineString('rtdb_ref_2');
        //   process.env.rtdb_ref_2 = 'foo/StringParam/2';
        //   const referenceOptions = {
        //     ref: '',
        //     instance: 'instance-1',
        //   };
        //   const cloudFn = database.onValueCreated(referenceOptions, handler);
        //   cloudFn.__endpoint.eventTrigger.eventFilterPathPatterns.ref = ref1
        //     .equals('aa')
        //     .then('rtdb_ref_1', 'rtdb_ref_2');
        //   const cloudFnWrap = wrapV2(cloudFn);
        //   const cloudEvent = cloudFnWrap().cloudEvent;
        //   expect(cloudEvent.ref).equal('rtdb_ref_2');
        // });

        it('should resolve using params', () => {
          const referenceOptions = {
            ref: 'users/{user}',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              user: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123');
        });

        it('should resolve using params in middle', () => {
          const referenceOptions = {
            ref: 'users/{user}/settings',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              user: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123/settings');
        });

        it('should resolve using multiple params in middle', () => {
          const referenceOptions = {
            ref: 'users/{user}/settings/{lang}',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              lang: 'en',
              user: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123/settings/en');
        });

        it('should resolve using single character param', () => {
          const referenceOptions = {
            ref: 'users/{x}',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              x: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123');
        });

        it('should resolve with undefined string if variable is missing', () => {
          const referenceOptions = {
            ref: 'users/{user}',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {},
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/undefined');
        });

        it('should resolve with given single-capture syntax', () => {
          const referenceOptions = {
            ref: 'users/{user=*}',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              user: '123',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123');
        });

        it('should resolve with given multi-capture syntax', () => {
          const referenceOptions = {
            ref: 'users/{user=**}/en',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const partial = {
            params: {
              user: '123/settings',
            },
          };
          const cloudEvent = cloudFnWrap(partial).cloudEvent;
          expect(cloudEvent.ref).equal('users/123/settings/en');
        });
      });
      describe('database.onValueCreated()', () => {
        it('should update CloudEvent appropriately', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            data: cloudEvent.data,
            instance: 'instance-1',
            firebaseDatabaseHost: 'firebaseDatabaseHost',
            ref: 'foo/bar',
            location: 'us-central1',
            params: {},
            source: '',
            type: 'google.firebase.database.ref.v1.created',
          });
        });

        it('should use overridden data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const dataVal = { snapshot: 'override' };
          const data = makeDataSnapshot(dataVal, referenceOptions.ref);
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.val()).deep.equal(dataVal);
        });

        it('should accept json data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueCreated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const dataVal = { snapshot: 'override' };
          const cloudEvent = cloudFnWrap({ data: dataVal }).cloudEvent;

          expect(cloudEvent.data.val()).deep.equal(dataVal);
        });
      });

      describe('database.onValueDeleted()', () => {
        it('should update CloudEvent appropriately', () => {
          const referenceOptions = {
            ref: 'foo/baz',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueDeleted(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            data: cloudEvent.data,
            instance: 'instance-1',
            firebaseDatabaseHost: 'firebaseDatabaseHost',
            ref: 'foo/baz',
            location: 'us-central1',
            params: {},
            source: '',
            type: 'google.firebase.database.ref.v1.deleted',
          });
        });

        it('should use overridden data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueDeleted(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const dataVal = { snapshot: 'override' };
          const data = makeDataSnapshot(dataVal, referenceOptions.ref);
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.val()).deep.equal(dataVal);
        });

        it('should accept json data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueDeleted(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const dataVal = { snapshot: 'override' };
          const cloudEvent = cloudFnWrap({ data: dataVal }).cloudEvent;

          expect(cloudEvent.data.val()).deep.equal(dataVal);
        });
      });

      describe('database.onValueUpdated()', () => {
        it('should update CloudEvent appropriately', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueUpdated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            data: cloudEvent.data,
            instance: 'instance-1',
            firebaseDatabaseHost: 'firebaseDatabaseHost',
            ref: 'foo/bar',
            location: 'us-central1',
            params: {},
            source: '',
            type: 'google.firebase.database.ref.v1.updated',
          });
        });

        it('should use overridden data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueUpdated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };
          const after = makeDataSnapshot(afterDataVal, referenceOptions.ref);

          const beforeDataVal = { snapshot: 'before' };
          const before = makeDataSnapshot(beforeDataVal, referenceOptions.ref);

          const data = { before, after };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.val()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.val()).deep.equal(afterDataVal);
        });

        it('should accept json data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueUpdated(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };
          const beforeDataVal = { snapshot: 'before' };
          const data = { before: beforeDataVal, after: afterDataVal };

          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.val()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.val()).deep.equal(afterDataVal);
        });
      });

      describe('database.onValueWritten()', () => {
        it('should update CloudEvent appropriately', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueWritten(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            data: cloudEvent.data,
            instance: 'instance-1',
            firebaseDatabaseHost: 'firebaseDatabaseHost',
            ref: 'foo/bar',
            location: 'us-central1',
            params: {},
            source: '',
            type: 'google.firebase.database.ref.v1.written',
          });
        });

        it('should use overridden data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueWritten(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };
          const after = makeDataSnapshot(afterDataVal, referenceOptions.ref);

          const beforeDataVal = { snapshot: 'before' };
          const before = makeDataSnapshot(beforeDataVal, referenceOptions.ref);

          const data = { before, after };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.val()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.val()).deep.equal(afterDataVal);
        });

        it('should accept json data', () => {
          const referenceOptions = {
            ref: 'foo/bar',
            instance: 'instance-1',
          };
          const cloudFn = database.onValueWritten(referenceOptions, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const afterDataVal = { snapshot: 'after' };

          const beforeDataVal = { snapshot: 'before' };

          const data = { before: beforeDataVal, after: afterDataVal };
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;

          expect(cloudEvent.data.before.val()).deep.equal(beforeDataVal);
          expect(cloudEvent.data.after.val()).deep.equal(afterDataVal);
        });
      });
    });

    describe('eventarc', () => {
      describe('eventarc.onCustomEventPublished()', () => {
        it('should update CloudEvent appropriately', () => {
          const eventType = 'EVENT_TYPE';
          const cloudFn = eventarc.onCustomEventPublished(eventType, handler);
          const data = {
            arbitrary: 'data',
          };

          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap({ data }).cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            source: 'eventarc_source',
            subject: 'eventarc_subject',
            type: eventType,
            data,
          });
        });
      });
    });

    describe('storage', () => {
      describe('storage.onObjectArchived()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket_override';
          const cloudFn = storage.onObjectArchived(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            bucket,
            data: {
              bucket,
              contentDisposition: "inline; filename*=utf-8''file_name",
              contentType: 'image/gif',
              crc32c: 'qqqqqq==',
              etag: 'xxxxxxxxx/yyyyy=',
              generation: 1,
              id: `${bucket}/file_name/1`,
              kind: 'storage#object',
              md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
              // tslint:disable-next-line:max-line-length
              mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/file_name?generation=1&alt=media`,
              metadata: {
                firebaseStorageDownloadTokens:
                  '00000000-0000-0000-0000-000000000000',
              },
              metageneration: 1,
              name: 'file_name',
              selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/file_name`,
              size: 42,
              storageClass: 'REGIONAL',
              timeCreated: cloudEvent.data.timeCreated,
              timeStorageClassUpdated: cloudEvent.data.timeStorageClassUpdated,
              updated: cloudEvent.data.updated,
            },
            source: `//storage.googleapis.com/projects/_/buckets/${bucket}`,
            subject: 'objects/file_name',
            type: 'google.cloud.storage.object.v1.archived',
          });
        });
      });

      describe('storage.onObjectDeleted()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectDeleted(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            bucket,
            data: {
              bucket,
              contentDisposition: "inline; filename*=utf-8''file_name",
              contentType: 'image/gif',
              crc32c: 'qqqqqq==',
              etag: 'xxxxxxxxx/yyyyy=',
              generation: 1,
              id: `${bucket}/file_name/1`,
              kind: 'storage#object',
              md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
              // tslint:disable-next-line:max-line-length
              mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/file_name?generation=1&alt=media`,
              metadata: {
                firebaseStorageDownloadTokens:
                  '00000000-0000-0000-0000-000000000000',
              },
              metageneration: 1,
              name: 'file_name',
              selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/file_name`,
              size: 42,
              storageClass: 'REGIONAL',
              timeCreated: cloudEvent.data.timeCreated,
              timeStorageClassUpdated: cloudEvent.data.timeStorageClassUpdated,
              updated: cloudEvent.data.updated,
            },
            source: `//storage.googleapis.com/projects/_/buckets/${bucket}`,
            subject: 'objects/file_name',
            type: 'google.cloud.storage.object.v1.deleted',
          });
        });
      });

      describe('storage.onObjectFinalized()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectFinalized(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            bucket,
            data: {
              bucket,
              contentDisposition: "inline; filename*=utf-8''file_name",
              contentType: 'image/gif',
              crc32c: 'qqqqqq==',
              etag: 'xxxxxxxxx/yyyyy=',
              generation: 1,
              id: `${bucket}/file_name/1`,
              kind: 'storage#object',
              md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
              // tslint:disable-next-line:max-line-length
              mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/file_name?generation=1&alt=media`,
              metadata: {
                firebaseStorageDownloadTokens:
                  '00000000-0000-0000-0000-000000000000',
              },
              metageneration: 1,
              name: 'file_name',
              selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/file_name`,
              size: 42,
              storageClass: 'REGIONAL',
              timeCreated: cloudEvent.data.timeCreated,
              timeStorageClassUpdated: cloudEvent.data.timeStorageClassUpdated,
              updated: cloudEvent.data.updated,
            },
            source: `//storage.googleapis.com/projects/_/buckets/${bucket}`,
            subject: 'objects/file_name',
            type: 'google.cloud.storage.object.v1.finalized',
          });
        });
      });

      describe('storage.onObjectMetadataUpdated()', () => {
        it('should update CloudEvent appropriately', () => {
          const bucket = 'bucket';
          const cloudFn = storage.onObjectMetadataUpdated(bucket, handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEvent = cloudFnWrap().cloudEvent;
          expect(cloudEvent).deep.equal({
            // id and time are generated at runtime
            id: cloudEvent.id,
            time: cloudEvent.time,
            specversion: '1.0',

            bucket,
            data: {
              bucket,
              contentDisposition: "inline; filename*=utf-8''file_name",
              contentType: 'image/gif',
              crc32c: 'qqqqqq==',
              etag: 'xxxxxxxxx/yyyyy=',
              generation: 1,
              id: `${bucket}/file_name/1`,
              kind: 'storage#object',
              md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
              // tslint:disable-next-line:max-line-length
              mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/file_name?generation=1&alt=media`,
              metadata: {
                firebaseStorageDownloadTokens:
                  '00000000-0000-0000-0000-000000000000',
              },
              metageneration: 1,
              name: 'file_name',
              selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/file_name`,
              size: 42,
              storageClass: 'REGIONAL',
              timeCreated: cloudEvent.data.timeCreated,
              timeStorageClassUpdated: cloudEvent.data.timeStorageClassUpdated,
              updated: cloudEvent.data.updated,
            },
            source: `//storage.googleapis.com/projects/_/buckets/${bucket}`,
            subject: 'objects/file_name',
            type: 'google.cloud.storage.object.v1.metadataUpdated',
          });
        });
      });
    });

    describe('pubsub', () => {
      describe('pubsub.onMessagePublished()', () => {
        it('should update CloudEvent without data provided', () => {
          const cloudFn = pubsub.onMessagePublished('topic', handler);
          const cloudFnWrap = wrapV2(cloudFn);

          const message = cloudFnWrap().cloudEvent.data.message;
          const data = message.data;
          const json = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
          expect(message).deep.equal({
            // Mock data (can be overridden)
            attributes: {
              'sample-attribute': 'I am an attribute',
            },
            messageId: 'message_id',

            // Recapture publish time (since it's generated during runtime)
            publishTime: message.publishTime,

            // Assertions on Expected Updates
            data: Buffer.from(JSON.stringify(json)).toString('base64'),
          });
        });
        it('should update CloudEvent with json data override', () => {
          const data = {
            message: {
              json: { firebase: 'test' },
            },
            subscription: 'subscription',
          };
          const cloudFn = pubsub.onMessagePublished('topic', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEventPartial = { data };

          const message = cloudFnWrap(cloudEventPartial).cloudEvent.data
            .message;
          expect(message).deep.equal({
            // Mock data (can be overridden)
            attributes: {
              'sample-attribute': 'I am an attribute',
            },
            messageId: 'message_id',

            // Recapture publish time (since it's generated during runtime)
            publishTime: message.publishTime,

            // Assertions on Expected Updates
            data: Buffer.from(JSON.stringify(data.message.json)).toString(
              'base64'
            ),
            json: { firebase: 'test' },
          });
        });
        it('should update CloudEvent with json and data string overrides', () => {
          const data = {
            message: {
              data: 'eyJmaXJlYmFzZSI6Im5vbl9qc29uX3Rlc3QifQ==',
              json: { firebase: 'non_json_test' },
            },
            subscription: 'subscription',
          };
          const cloudFn = pubsub.onMessagePublished('topic', handler);
          const cloudFnWrap = wrapV2(cloudFn);
          const cloudEventPartial = { data };

          const message = cloudFnWrap(cloudEventPartial).cloudEvent.data
            .message;
          expect(message).deep.equal({
            // Mock data (can be overridden)
            attributes: {
              'sample-attribute': 'I am an attribute',
            },
            messageId: 'message_id',

            // Recapture publish time (since it's generated during runtime)
            publishTime: message.publishTime,

            // Assertions on Expected Updates
            data: Buffer.from(JSON.stringify(data.message.json)).toString(
              'base64'
            ),
            json: data.message.json,
          });
        });
      });
    });

    describe('callable functions', () => {
      it('should return correct data', async () => {
        const cloudFunction = https.onCall(() => 'hello');
        cloudFunction.__endpoint = {
          platform: 'gcfv2',
          labels: {},
          callableTrigger: {},
          concurrency: 20,
          minInstances: 3,
          region: ['us-west1', 'us-central1'],
        };

        const wrappedCF = wrapV2(cloudFunction);
        const result = await wrappedCF({} as any);
        expect(result).equal('hello');
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

      it('should deep-merge user supplied partial', () => {
        const cloudEventOverride = {
          data: {
            contentType: 'application/octet-stream',
          },
        };

        const bucketName = 'bucket_name';
        const cloudFn = storage.onObjectArchived(bucketName, handler);

        const mergedCloudEvent = wrapV2(cloudFn)(cloudEventOverride).cloudEvent;
        expect(mergedCloudEvent.data?.size).equal(42);
        expect(mergedCloudEvent.data?.contentType).equal(
          'application/octet-stream'
        );
      });
    });
  });
});
