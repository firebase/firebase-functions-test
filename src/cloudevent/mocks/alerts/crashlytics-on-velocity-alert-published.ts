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
  VelocityAlertPayload,
} from 'firebase-functions/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/alerts';

export const alertsCrashlyticsOnVelocityAlertPublished: MockCloudEventAbstractFactory<CrashlyticsEvent<
  VelocityAlertPayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<CrashlyticsEvent<VelocityAlertPayload>>
  ): CrashlyticsEvent<VelocityAlertPayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: getCrashlyticsVelocityAlertData(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<VelocityAlertPayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity'
    );
  },
};

function getCrashlyticsVelocityAlertData(): FirebaseAlertData<
  VelocityAlertPayload
> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsVelocityAlertPayload',
      crashCount: 100,
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
      createTime: now,
      firstVersion: '1.1',
      crashPercentage: 50.0,
    },
  };
}
