import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnVelocityAlertPublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.crashlytics.VelocityAlertPayload>> = {
  generatePartial(
    _: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.VelocityAlertPayload>>):
    DeepPartial<alerts.crashlytics.CrashlyticsEvent<alerts.crashlytics.VelocityAlertPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsVelocityAlertData(),
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.VelocityAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity';
  },
};

function getCrashlyticsVelocityAlertData(): alerts.FirebaseAlertData<alerts.crashlytics.VelocityAlertPayload> {
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
