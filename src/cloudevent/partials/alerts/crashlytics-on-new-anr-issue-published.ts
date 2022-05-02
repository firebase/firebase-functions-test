import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, NewAnrIssuePayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnNewAnrIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewAnrIssuePayload>, FirebaseAlertData<NewAnrIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>):
    DeepPartial<CrashlyticsEvent<NewAnrIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewAnrIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue';
  },
};

function getCrashlyticsNewAnrIssueData(): FirebaseAlertData<NewAnrIssuePayload> {
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
