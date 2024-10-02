import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction } from 'firebase-functions';
import {
  APP_ID,
  getBaseCloudEvent,
  getEventType,
  PROJECT_ID,
} from '../helpers';
import { FirebaseAlertData, AlertEvent } from 'firebase-functions/alerts';

export const alertsOnAlertPublished: MockCloudEventAbstractFactory<AlertEvent<
  FirebaseAlertData
>> = {
  generateMock(
    cloudFunction: CloudFunction<AlertEvent<FirebaseAlertData>>
  ): AlertEvent<FirebaseAlertData> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    const alertType = 'appDistribution.newTesterIosDevice';
    const appId = APP_ID;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent

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
    createTime: now,
    endTime: now,
    payload: {},
  };
}
