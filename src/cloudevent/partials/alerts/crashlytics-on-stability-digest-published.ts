import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, StabilityDigestPayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnStabilityDigestPublished:
  MockCloudEventPartials<FirebaseAlertData<StabilityDigestPayload>, FirebaseAlertData<StabilityDigestPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>):
    DeepPartial<CrashlyticsEvent<StabilityDigestPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsStabilityData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.stabilityDigest';
  },
};

function getCrashlyticsStabilityData(): FirebaseAlertData<StabilityDigestPayload> {
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
