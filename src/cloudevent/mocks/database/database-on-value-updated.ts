import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getBaseCloudEvent, getEventType } from '../helpers';
import {
  exampleDataSnapshot,
  exampleDataSnapshotChange,
} from '../../../providers/database';
import { Change } from 'firebase-functions';
import { getCommonDatabaseFields } from './helpers';

export const databaseOnValueUpdated: MockCloudEventAbstractFactory<database.DatabaseEvent<
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
    const {
      instance,
      firebaseDatabaseHost,
      ref,
      location,
      params,
    } = getCommonDatabaseFields(cloudFunction, cloudEventPartial);

    const data =
      (cloudEventPartial?.data as Change<database.DataSnapshot>) ||
      exampleDataSnapshotChange(ref);

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),

      // Update fields specific to this CloudEvent
      data,

      instance,
      firebaseDatabaseHost,
      ref,
      location,
      params,
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.updated'
    );
  },
};
