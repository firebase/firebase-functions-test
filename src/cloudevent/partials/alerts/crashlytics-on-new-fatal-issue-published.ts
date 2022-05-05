import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  CrashlyticsEvent,
  NewFatalIssuePayload,
} from 'firebase-functions/v2/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';

export const alertsCrashlyticsOnNewFatalIssuePublished: MockCloudEventPartials<CrashlyticsEvent<
  NewFatalIssuePayload
>> = {
  generatePartial(
    _: CloudFunction<CrashlyticsEvent<NewFatalIssuePayload>>
  ): DeepPartial<CrashlyticsEvent<NewFatalIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsNewFatalIssueData(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<NewFatalIssuePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newFatalIssue'
    );
  },
};

function getCrashlyticsNewFatalIssueData(): FirebaseAlertData<
  NewFatalIssuePayload
> {
  const now = new Date().toISOString();
  return {
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type':
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsNewFatalIssuePayload',
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
    },
  };
}
