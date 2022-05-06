import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  CrashlyticsEvent,
  NewNonfatalIssuePayload,
} from 'firebase-functions/v2/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';

export const alertsCrashlyticsOnNewNonfatalIssuePublished: MockCloudEventPartials<CrashlyticsEvent<
  NewNonfatalIssuePayload
>> = {
  generatePartial(
    _: CloudFunction<CrashlyticsEvent<NewNonfatalIssuePayload>>
  ): DeepPartial<CrashlyticsEvent<NewNonfatalIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
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
