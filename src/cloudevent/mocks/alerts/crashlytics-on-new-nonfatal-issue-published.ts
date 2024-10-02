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
  NewNonfatalIssuePayload,
} from 'firebase-functions/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/alerts';

export const alertsCrashlyticsOnNewNonfatalIssuePublished: MockCloudEventAbstractFactory<CrashlyticsEvent<
  NewNonfatalIssuePayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<CrashlyticsEvent<NewNonfatalIssuePayload>>
  ): CrashlyticsEvent<NewNonfatalIssuePayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: getCrashlyticsNewNonfatalIssueData(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<NewNonfatalIssuePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype ===
        'crashlytics.newNonfatalIssue'
    );
  },
};

function getCrashlyticsNewNonfatalIssueData(): FirebaseAlertData<
  NewNonfatalIssuePayload
> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewNonfatalIssuePayload',
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
    },
  };
}
