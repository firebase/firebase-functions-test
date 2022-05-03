import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnStabilityDigestPublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.crashlytics.StabilityDigestPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.StabilityDigestPayload>>):
    DeepPartial<alerts.crashlytics.CrashlyticsEvent<alerts.crashlytics.StabilityDigestPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsStabilityData()
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.StabilityDigestPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.stabilityDigest';
  },
};

function getCrashlyticsStabilityData(): alerts.FirebaseAlertData<alerts.crashlytics.StabilityDigestPayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsStabilityDigestPayload',
      'digestDate': new Date().toISOString(),
      'trendingIssues': [
        {
          type: 'type',
          eventCount: 100,
          userCount: 100,
          issue: {
            id: 'crashlytics_issue_id',
            title: 'crashlytics_issue_title',
            subtitle: 'crashlytics_issue_subtitle',
            appVersion: 'crashlytics_issue_app_version'
          }
        }
      ]
    }
  });
}
