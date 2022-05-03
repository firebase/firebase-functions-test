import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnRegressionAlertPublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.crashlytics.RegressionAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.RegressionAlertPayload>>):
    DeepPartial<alerts.crashlytics.CrashlyticsEvent<alerts.crashlytics.RegressionAlertPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsRegressionAlertPayload(),
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.RegressionAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression';
  },
};

/** Alert Crashlytics Data */
function getCrashlyticsRegressionAlertPayload(): alerts.FirebaseAlertData<alerts.crashlytics.RegressionAlertPayload> {
  const now = new Date().toISOString();
  return ({
    // ['@type']: 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsRegressionAlertPayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
      'type': 'test type',
      'resolveTime': now
    }
  });
}
