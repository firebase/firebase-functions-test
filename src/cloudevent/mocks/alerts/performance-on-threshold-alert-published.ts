import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction } from 'firebase-functions';
import {
  PerformanceEvent,
  ThresholdAlertPayload,
} from 'firebase-functions/alerts/performance';
import {
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
  PROJECT_ID,
  APP_ID,
} from '../helpers';
import { FirebaseAlertData } from 'firebase-functions/alerts';

export const performanceThresholdOnThresholdAlertPublished: MockCloudEventAbstractFactory<PerformanceEvent<
  ThresholdAlertPayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<PerformanceEvent<ThresholdAlertPayload>>
  ): PerformanceEvent<ThresholdAlertPayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;
    const alertType = 'performance.threshold';
    const appId = APP_ID;
    return {
      ...getBaseCloudEvent(cloudFunction),
      alertType,
      appId,
      source,
      data: getThresholdAlertPayload(),
    };
  },
  match(
    cloudFunction: CloudFunction<PerformanceEvent<ThresholdAlertPayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'performance.threshold'
    );
  },
};

function getThresholdAlertPayload(): FirebaseAlertData<ThresholdAlertPayload> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
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
  };
}
