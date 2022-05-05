import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  CrashlyticsEvent,
  StabilityDigestPayload,
} from 'firebase-functions/v2/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';

export const alertsCrashlyticsOnStabilityDigestPublished: MockCloudEventPartials<CrashlyticsEvent<
  StabilityDigestPayload
>> = {
  generatePartial(
    _: CloudFunction<CrashlyticsEvent<StabilityDigestPayload>>
  ): DeepPartial<CrashlyticsEvent<StabilityDigestPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsStabilityData(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<StabilityDigestPayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype ===
        'crashlytics.stabilityDigest'
    );
  },
};

function getCrashlyticsStabilityData(): FirebaseAlertData<
  StabilityDigestPayload
> {
  const now = new Date().toISOString();
  return {
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type':
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsStabilityDigestPayload',
      digestDate: new Date().toISOString(),
      trendingIssues: [
        {
          type: 'type',
          eventCount: 100,
          userCount: 100,
          issue: {
            id: 'crashlytics_issue_id',
            title: 'crashlytics_issue_title',
            subtitle: 'crashlytics_issue_subtitle',
            appVersion: 'crashlytics_issue_app_version',
          },
        },
      ],
    },
  };
}
