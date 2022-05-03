import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {APP_ID, getEventType, PROJECT_ID} from '../helpers';

export const alertsOnAlertPublished:
  MockCloudEventPartials<alerts.FirebaseAlertData> = {
  generatePartial(_: CloudFunction<alerts.FirebaseAlertData>): DeepPartial<alerts.AlertEvent<any>> {
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
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published';
  },
};

/** Alert Published Data */

function getOnAlertPublishedData(): alerts.FirebaseAlertData {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {}
  });
}
