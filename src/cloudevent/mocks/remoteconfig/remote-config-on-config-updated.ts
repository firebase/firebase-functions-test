import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction, CloudEvent } from 'firebase-functions';
import { ConfigUpdateData } from 'firebase-functions/remoteConfig';
import { getBaseCloudEvent, getEventType, PROJECT_ID } from '../helpers';

export const remoteConfigOnConfigUpdated: MockCloudEventAbstractFactory<CloudEvent<
  ConfigUpdateData
>> = {
  generateMock(
    cloudFunction: CloudFunction<CloudEvent<ConfigUpdateData>>
  ): CloudEvent<ConfigUpdateData> {
    const source = `//firebaseremoteconfig.googleapis.com/projects/${PROJECT_ID}`;
    return {
      ...getBaseCloudEvent(cloudFunction),
      source,
      data: getConfigUpdateData(),
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<ConfigUpdateData>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.firebase.remoteconfig.remoteConfig.v1.updated'
    );
  },
};

function getConfigUpdateData(): ConfigUpdateData {
  const now = new Date().toISOString();
  return {
    versionNumber: 2,
    updateTime: now,
    updateUser: {
      name: 'testuser',
      email: 'test@example.com',
      imageUrl: 'test.com/img-url',
    },
    description: 'config update test',
    updateOrigin: 'REMOTE_CONFIG_UPDATE_ORIGIN_UNSPECIFIED',
    updateType: 'REMOTE_CONFIG_UPDATE_TYPE_UNSPECIFIED',
    rollbackSource: 0,
  };
}
