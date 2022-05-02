import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {AppDistributionEvent, NewTesterDevicePayload} from 'firebase-functions/lib/v2/providers/alerts/appDistribution';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsAppDistributionOnNewTesterIosDevicePublished:
  MockCloudEventPartials<FirebaseAlertData<NewTesterDevicePayload>, FirebaseAlertData<NewTesterDevicePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>):
    DeepPartial<AppDistributionEvent<NewTesterDevicePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;
    const now = new Date().toISOString();

    return {
      source,
      type: getEventType(cloudFunction),
      data: {
        createTime: now,
        endTime: now,
        payload: {
          ['@type']: 'com.google.firebase.firebasealerts.NewTesterDevicePayload',
          testerName: 'tester name',
          testerEmail: 'test@test.com',
          testerDeviceModelName: 'tester device model name',
          testerDeviceIdentifier: 'tester device identifier',
        }
      }
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'appDistribution.newTesterIosDevice';
  },
};
