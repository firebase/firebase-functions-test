import {DeepPartial, MockCloudEventPartials} from '../../types';
import {AlertEvent, FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {APP_ID, getEventType, PROJECT_ID} from '../helpers';

export const alertsOnAlertPublished:
  MockCloudEventPartials<FirebaseAlertData, FirebaseAlertData<any>> = {
  generatePartial(cloudFunction: CloudFunction<FirebaseAlertData>): DeepPartial<AlertEvent<any>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    const alertType = 'appDistribution.newTesterIosDevice';
    const appId = APP_ID;

    return {
      alertType,
      appId,
      data: getOnAlertPublishedData(),
      type: getEventType(cloudFunction),
      source,
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published';
  },
};

/** Alert Published Data */

function getOnAlertPublishedData(): FirebaseAlertData<any> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {}
  });
}
