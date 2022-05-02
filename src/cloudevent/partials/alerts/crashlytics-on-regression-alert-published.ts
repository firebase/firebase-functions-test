import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, RegressionAlertPayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnRegressionAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<RegressionAlertPayload>, FirebaseAlertData<RegressionAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>):
    DeepPartial<CrashlyticsEvent<RegressionAlertPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsRegressionAlertPayload(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression';
  },
};

/** Alert Crashlytics Data */
function getCrashlyticsRegressionAlertPayload(): FirebaseAlertData<RegressionAlertPayload> {
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
