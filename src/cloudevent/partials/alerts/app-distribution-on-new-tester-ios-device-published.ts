import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsAppDistributionOnNewTesterIosDevicePublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.appDistribution.NewTesterDevicePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.appDistribution.NewTesterDevicePayload>>):
    DeepPartial<alerts.appDistribution.AppDistributionEvent<alerts.appDistribution.NewTesterDevicePayload>> {
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
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.appDistribution.NewTesterDevicePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'appDistribution.newTesterIosDevice';
  },
};
