import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction } from 'firebase-functions';
import {
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
  PROJECT_ID,
} from '../helpers';
import {
  CrashlyticsEvent,
  RegressionAlertPayload,
} from 'firebase-functions/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/alerts';

export const alertsCrashlyticsOnRegressionAlertPublished: MockCloudEventAbstractFactory<CrashlyticsEvent<
  RegressionAlertPayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<CrashlyticsEvent<RegressionAlertPayload>>
  ): CrashlyticsEvent<RegressionAlertPayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: getCrashlyticsRegressionAlertPayload(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<RegressionAlertPayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression'
    );
  },
};

/** Alert Crashlytics Data */
function getCrashlyticsRegressionAlertPayload(): FirebaseAlertData<
  RegressionAlertPayload
> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsRegressionAlertPayload',
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
      type: 'test type',
      resolveTime: now,
    },
  };
}
