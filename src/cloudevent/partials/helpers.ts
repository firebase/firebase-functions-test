import {CloudFunction} from 'firebase-functions/v2';

export const APP_ID = '__APP_ID__';
export const PROJECT_ID = '42';
export const FILENAME = 'file_name';

export function getEventType<T>(cloudFunction: CloudFunction<T>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

export function getEventFilters<T>(cloudFunction: CloudFunction<T>): Record<string, string> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}
