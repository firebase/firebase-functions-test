import { MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions';
import { getEventType } from '../helpers';
import { getDatabaseSnapshotCloudEvent } from './helpers';

export const databaseOnValueCreated: MockCloudEventAbstractFactory<database.DatabaseEvent<
  database.DataSnapshot
>> = {
  generateMock: getDatabaseSnapshotCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.created'
    );
  },
};
