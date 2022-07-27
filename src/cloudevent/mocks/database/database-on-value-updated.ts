import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import {
  getBaseCloudEvent,
  getEventType,
} from '../helpers';
import {exampleDataSnapshotChange} from '../../../providers/database';
import {Change} from 'firebase-functions';

export const databaseOnValueUpdated: MockCloudEventAbstractFactory<database.DatabaseEvent<
  Change<database.DataSnapshot>
>> = {
  generateMock(
    cloudFunction: CloudFunction<database.DatabaseEvent<Change<database.DataSnapshot>>>,
    cloudEventPartial?: DeepPartial<database.DatabaseEvent<Change<database.DataSnapshot>>>
  ): database.DatabaseEvent<Change<database.DataSnapshot>> {
    const instance = (cloudEventPartial?.instance as string) || 'instance-1';
    const firebaseDatabaseHost =
      (cloudEventPartial?.firebaseDatabaseHost as string) ||
      'firebaseDatabaseHost';
    const ref = (cloudEventPartial?.ref as string) || '/foo/bar';
    const location = (cloudEventPartial?.location as string) || 'us-central1';
    const params: Record<string, string> = cloudEventPartial?.params || {};

    const data = cloudEventPartial?.data || exampleDataSnapshotChange();

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
