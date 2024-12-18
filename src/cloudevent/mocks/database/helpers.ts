import { CloudFunction, database } from 'firebase-functions/v2';
import { DeepPartial } from '../../types';
import {
  exampleDataSnapshot,
  exampleDataSnapshotChange,
} from '../../../providers/database';
import {
  resolveStringExpression,
  getBaseCloudEvent,
  extractRef,
} from '../helpers';
import { Change } from 'firebase-functions/v1';
import { makeDataSnapshot } from '../../../providers/database';

type ChangeLike = {
  before: database.DataSnapshot | object;
  after: database.DataSnapshot | object;
};

function getOrCreateDataSnapshot(
  data: database.DataSnapshot | object,
  ref: string
) {
  if (data instanceof database.DataSnapshot) {
    return data;
  }
  if (data instanceof Object) {
    return makeDataSnapshot(data, ref);
  }
  return exampleDataSnapshot(ref);
}

function getOrCreateDataSnapshotChange(
  data: DeepPartial<Change<database.DataSnapshot> | ChangeLike>,
  ref: string
) {
  if (data instanceof Change) {
    return data;
  }
  if (data instanceof Object && data?.before && data?.after) {
    const beforeDataSnapshot = getOrCreateDataSnapshot(data!.before, ref);
    const afterDataSnapshot = getOrCreateDataSnapshot(data!.after, ref);
    return new Change(beforeDataSnapshot, afterDataSnapshot);
  }
  return exampleDataSnapshotChange(ref);
}

export function getDatabaseSnapshotCloudEvent(
  cloudFunction: CloudFunction<database.DatabaseEvent<database.DataSnapshot>>,
  cloudEventPartial?: DeepPartial<
    database.DatabaseEvent<database.DataSnapshot | object>
  >
) {
  const {
    instance,
    firebaseDatabaseHost,
    ref,
    location,
    params,
  } = getCommonDatabaseFields(cloudFunction, cloudEventPartial);

  const data = getOrCreateDataSnapshot(cloudEventPartial?.data, ref);

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
    database.DatabaseEvent<Change<database.DataSnapshot> | ChangeLike>
  >
): database.DatabaseEvent<Change<database.DataSnapshot>> {
  const {
    instance,
    firebaseDatabaseHost,
    ref,
    location,
    params,
  } = getCommonDatabaseFields(cloudFunction, cloudEventPartial);

  const data = getOrCreateDataSnapshotChange(cloudEventPartial?.data, ref);

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
  cloudFunction: CloudFunction<
    database.DatabaseEvent<
      database.DataSnapshot | Change<database.DataSnapshot>
    >
  >,
  cloudEventPartial?: DeepPartial<
    database.DatabaseEvent<
      database.DataSnapshot | Change<database.DataSnapshot>
    >
  >
) {
  const instanceOrExpression =
    (cloudEventPartial?.instance as string) ||
    cloudFunction.__endpoint?.eventTrigger?.eventFilterPathPatterns?.instance ||
    cloudFunction.__endpoint?.eventTrigger?.eventFilters?.instance ||
    'instance-1';
  const instance = resolveStringExpression(instanceOrExpression);
  const firebaseDatabaseHost =
    (cloudEventPartial?.firebaseDatabaseHost as string) ||
    'firebaseDatabaseHost';
  const rawRefOrExpression =
    (cloudEventPartial?.ref as string) ||
    cloudFunction?.__endpoint?.eventTrigger?.eventFilterPathPatterns?.ref ||
    '/foo/bar';
  const rawRef = resolveStringExpression(rawRefOrExpression);
  const location = (cloudEventPartial?.location as string) || 'us-central1';
  const params: Record<string, string> = cloudEventPartial?.params || {};
  const ref = extractRef(rawRef, params);

  return {
    instance,
    firebaseDatabaseHost,
    ref,
    location,
    params,
  };
}
