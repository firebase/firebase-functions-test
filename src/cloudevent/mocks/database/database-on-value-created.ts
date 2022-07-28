import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getEventType } from '../helpers';
import { getDatabaseSnapshotCloudEvent } from './helpers';

export const databaseOnValueCreated: MockCloudEventAbstractFactory<database.DatabaseEvent<
  database.DataSnapshot
>> = {
  generateMock(
    cloudFunction: CloudFunction<database.DatabaseEvent<database.DataSnapshot>>,
    cloudEventPartial?: DeepPartial<
      database.DatabaseEvent<database.DataSnapshot>
    >
  ): database.DatabaseEvent<database.DataSnapshot> {
    return getDatabaseSnapshotCloudEvent(cloudFunction, cloudEventPartial);
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.created'
    );
  },
};
