import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { DeepPartial } from '../../types';

export function getCommonDatabaseFields(
  cloudFunction: CloudFunction<database.DatabaseEvent<any>>,
  cloudEventPartial?: DeepPartial<database.DatabaseEvent<any>>
) {
  const instance =
    (cloudEventPartial?.instance as string) ||
    cloudFunction.__endpoint.eventTrigger.eventFilters.instance ||
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
