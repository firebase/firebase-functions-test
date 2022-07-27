import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { getBaseCloudEvent, getEventType } from '../helpers';
import {exampleDataSnapshot} from '../../../providers/database';
import {getCommonDatabaseFields} from './helpers';

export const databaseOnValueDeleted: MockCloudEventAbstractFactory<database.DatabaseEvent<
  database.DataSnapshot
>> = {
  generateMock(
    cloudFunction: CloudFunction<database.DatabaseEvent<database.DataSnapshot>>,
    cloudEventPartial?: DeepPartial<database.DatabaseEvent<DeepPartial<database.DataSnapshot>>>
  ): database.DatabaseEvent<database.DataSnapshot> {
    const {
      instance,
      firebaseDatabaseHost,
      ref,
      location,
      params
    } = getCommonDatabaseFields(cloudFunction, cloudEventPartial);

    const data = cloudEventPartial?.data as database.DataSnapshot || exampleDataSnapshot(ref);

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
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.deleted'
    );
  },
};
