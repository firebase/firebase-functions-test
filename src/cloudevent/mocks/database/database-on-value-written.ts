import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getEventType } from '../helpers';
import { Change } from 'firebase-functions';
import { getDatabaseChangeSnapshotCloudEvent } from './helpers';

export const databaseOnValueWritten: MockCloudEventAbstractFactory<database.DatabaseEvent<
  Change<database.DataSnapshot>
>> = {
  generateMock(
    cloudFunction: CloudFunction<
      database.DatabaseEvent<Change<database.DataSnapshot>>
    >,
    cloudEventPartial?: DeepPartial<
      database.DatabaseEvent<Change<database.DataSnapshot>>
    >
  ): database.DatabaseEvent<Change<database.DataSnapshot>> {
    return getDatabaseChangeSnapshotCloudEvent(
      cloudFunction,
      cloudEventPartial
    );
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.written'
    );
  },
};
