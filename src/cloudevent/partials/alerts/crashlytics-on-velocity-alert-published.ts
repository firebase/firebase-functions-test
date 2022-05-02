import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, VelocityAlertPayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnVelocityAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<VelocityAlertPayload>, FirebaseAlertData<VelocityAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>):
    DeepPartial<CrashlyticsEvent<VelocityAlertPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsVelocityAlertData(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity';
  },
};

function getCrashlyticsVelocityAlertData(): FirebaseAlertData<VelocityAlertPayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.VelocityAlertPayload',
      'crashCount': 100,
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
      'createTime': now,
      'firstVersion': '1.1',
      'crashPercentage': 50.0
    }
  });
}
