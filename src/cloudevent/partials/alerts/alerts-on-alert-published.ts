import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {getEventType, PROJECT_ID} from '../helpers';

export const alertsOnAlertPublished:
  MockCloudEventPartials<FirebaseAlertData, FirebaseAlertData<any>> = {
  generatePartial(cloudFunction: CloudFunction<FirebaseAlertData>): DeepPartial<CloudEvent<FirebaseAlertData<any>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getOnAlertPublishedData()
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
