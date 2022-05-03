import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnNewAnrIssuePublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.crashlytics.NewAnrIssuePayload>, alerts.FirebaseAlertData<alerts.crashlytics.NewAnrIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.NewAnrIssuePayload>>):
    DeepPartial<alerts.crashlytics.CrashlyticsEvent<alerts.crashlytics.NewAnrIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewAnrIssueData()
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.crashlytics.NewAnrIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue';
  },
};

function getCrashlyticsNewAnrIssueData(): alerts.FirebaseAlertData<alerts.crashlytics.NewAnrIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.NewAnrIssuePayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}
