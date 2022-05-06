import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  CrashlyticsEvent,
  NewAnrIssuePayload,
} from 'firebase-functions/v2/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';

export const alertsCrashlyticsOnNewAnrIssuePublished: MockCloudEventPartials<CrashlyticsEvent<
  NewAnrIssuePayload
>> = {
  generatePartial(
    _: CloudFunction<CrashlyticsEvent<NewAnrIssuePayload>>
  ): DeepPartial<CrashlyticsEvent<NewAnrIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsNewAnrIssueData(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<NewAnrIssuePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue'
    );
  },
};

function getCrashlyticsNewAnrIssueData(): FirebaseAlertData<
  NewAnrIssuePayload
> {
  const now = new Date().toISOString();
  return {
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type':
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewAnrIssuePayload',
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
    },
  };
}
