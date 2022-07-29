import { CloudFunction, database } from 'firebase-functions/v2';
import { DeepPartial } from '../../types';
import {
  exampleDataSnapshot,
  exampleDataSnapshotChange,
} from '../../../providers/database';
import { getBaseCloudEvent } from '../helpers';
import { Change } from 'firebase-functions';

export function getDatabaseSnapshotCloudEvent(
  cloudFunction: CloudFunction<database.DatabaseEvent<any>>,
  cloudEventPartial?: DeepPartial<database.DatabaseEvent<any>>
) {
  const {
    instance,
    firebaseDatabaseHost,
    ref,
    location,
    params,
  } = getCommonDatabaseFields(cloudFunction, cloudEventPartial);

  const data =
    (cloudEventPartial?.data as database.DataSnapshot) ||
    exampleDataSnapshot(ref);

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
}

export function getDatabaseChangeSnapshotCloudEvent(
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
}

export function getCommonDatabaseFields(
  cloudFunction: CloudFunction<database.DatabaseEvent<any>>,
  cloudEventPartial?: DeepPartial<database.DatabaseEvent<any>>
) {
  const instance =
    (cloudEventPartial?.instance as string) ||
    cloudFunction.__endpoint?.eventTrigger?.eventFilterPathPatterns?.instance ||
    cloudFunction.__endpoint?.eventTrigger?.eventFilters?.instance ||
    'instance-1';
  const firebaseDatabaseHost =
    (cloudEventPartial?.firebaseDatabaseHost as string) ||
    'firebaseDatabaseHost';
  const ref =
    (cloudEventPartial?.ref as string) ||
    cloudFunction?.__endpoint?.eventTrigger?.eventFilterPathPatterns?.ref ||
    '/foo/bar';
  const location = (cloudEventPartial?.location as string) || 'us-central1';
  const params: Record<string, string> = cloudEventPartial?.params || {};

  return {
    instance,
    firebaseDatabaseHost,
    ref,
    location,
    params,
  };
}
