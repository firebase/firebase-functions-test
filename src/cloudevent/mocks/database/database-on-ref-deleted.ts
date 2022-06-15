import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getBaseCloudEvent, getEventType, makeDataSnapshot } from '../helpers';

export const databaseOnRefDeleted: MockCloudEventAbstractFactory<database.DatabaseEvent<
  database.DataSnapshot
>> = {
  generateMock(
    cloudFunction: CloudFunction<database.DatabaseEvent<any>>,
    cloudEventPartial?: DeepPartial<database.DatabaseEvent<any>>
  ): database.DatabaseEvent<any> {
    const instance = (cloudEventPartial?.instance as string) || 'instance-1';
    const firebaseDatabaseHost =
      (cloudEventPartial?.firebaseDatabaseHost as string) ||
      'firebaseDatabaseHost';
    const ref = (cloudEventPartial?.ref as string) || '/foo/bar';
    const location = (cloudEventPartial?.location as string) || 'us-central1';
    const params: Record<string, string> = cloudEventPartial?.params || {};

    const mockRawRTDBCloudEventData: database.RawRTDBCloudEventData = {
      ['@type']:
        'type.googleapis.com/google.events.firebase.database.v1.ReferenceEventData',
      data: cloudEventPartial?.data?.data || {},
      delta: cloudEventPartial?.data?.delta || {},
    };

    const mockRawRTDBCloudEvent: database.RawRTDBCloudEvent = {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),

      data: mockRawRTDBCloudEventData,
      instance,
      firebasedatabasehost: firebaseDatabaseHost,
      ref,
      location,
    };

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),

      // Update fields specific to this CloudEvent
      data: makeDataSnapshot(mockRawRTDBCloudEvent, instance),

      instance,
      firebaseDatabaseHost,
      ref,
      location,
      params,
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.deleted'
    );
  },
};
