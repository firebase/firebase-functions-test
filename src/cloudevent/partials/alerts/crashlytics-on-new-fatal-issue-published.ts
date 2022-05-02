import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, NewFatalIssuePayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnNewFatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewFatalIssuePayload>, FirebaseAlertData<NewFatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>):
    DeepPartial<CrashlyticsEvent<NewFatalIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewFatalIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newFatalIssue';
  },
};

function getCrashlyticsNewFatalIssueData(): FirebaseAlertData<NewFatalIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsNewFatalIssuePayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}
