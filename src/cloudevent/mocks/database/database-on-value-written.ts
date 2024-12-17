import { MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getEventType } from '../helpers';
import { Change } from 'firebase-functions/v1';
import { getDatabaseChangeSnapshotCloudEvent } from './helpers';

export const databaseOnValueWritten: MockCloudEventAbstractFactory<database.DatabaseEvent<
  Change<database.DataSnapshot>
>> = {
  generateMock: getDatabaseChangeSnapshotCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.written'
    );
  },
};
