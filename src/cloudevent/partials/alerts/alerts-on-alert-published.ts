import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { APP_ID, getEventType, PROJECT_ID } from '../helpers';
import { FirebaseAlertData, AlertEvent } from 'firebase-functions/v2/alerts';

export const alertsOnAlertPublished: MockCloudEventPartials<AlertEvent<
  FirebaseAlertData
>> = {
  generatePartial(
    _: CloudFunction<AlertEvent<FirebaseAlertData>>
  ): DeepPartial<AlertEvent<FirebaseAlertData>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    const alertType = 'appDistribution.newTesterIosDevice';
    const appId = APP_ID;

    return {
      alertType,
      appId,
      data: getOnAlertPublishedData(),
      source,
    };
  },
  match(cloudFunction: CloudFunction<AlertEvent<FirebaseAlertData>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.firebase.firebasealerts.alerts.v1.published'
    );
  },
};

/** Alert Published Data */

function getOnAlertPublishedData(): FirebaseAlertData {
  const now = new Date().toISOString();
  return {
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {},
  };
}
