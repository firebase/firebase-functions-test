import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  CrashlyticsEvent,
  RegressionAlertPayload,
} from 'firebase-functions/v2/alerts/crashlytics';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';

export const alertsCrashlyticsOnRegressionAlertPublished: MockCloudEventPartials<CrashlyticsEvent<
  RegressionAlertPayload
>> = {
  generatePartial(
    _: CloudFunction<CrashlyticsEvent<RegressionAlertPayload>>
  ): DeepPartial<CrashlyticsEvent<RegressionAlertPayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getCrashlyticsRegressionAlertPayload(),
    };
  },
  match(
    cloudFunction: CloudFunction<CrashlyticsEvent<RegressionAlertPayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression'
    );
  },
};

/** Alert Crashlytics Data */
function getCrashlyticsRegressionAlertPayload(): FirebaseAlertData<
  RegressionAlertPayload
> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.CrashlyticsRegressionAlertPayload',
      issue: {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version',
      },
      type: 'test type',
      resolveTime: now,
    },
  };
}
