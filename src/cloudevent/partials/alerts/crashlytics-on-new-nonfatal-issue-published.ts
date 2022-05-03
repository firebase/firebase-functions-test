import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnNewNonfatalIssuePublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.crashlytics.NewNonfatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.NewNonfatalIssuePayload>>):
    DeepPartial<alerts.crashlytics.CrashlyticsEvent<alerts.crashlytics.NewNonfatalIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsNewNonfatalIssueData()
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.NewNonfatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newNonfatalIssue';
  },
};

function getCrashlyticsNewNonfatalIssueData(): alerts.FirebaseAlertData<alerts.crashlytics.NewNonfatalIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsNewNonfatalIssuePayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}
