import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CrashlyticsEvent, NewNonfatalIssuePayload} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsCrashlyticsOnNewNonfatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewNonfatalIssuePayload>, FirebaseAlertData<NewNonfatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>):
    DeepPartial<CrashlyticsEvent<NewNonfatalIssuePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewNonfatalIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newNonfatalIssue';
  },
};

function getCrashlyticsNewNonfatalIssueData(): FirebaseAlertData<NewNonfatalIssuePayload> {
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
