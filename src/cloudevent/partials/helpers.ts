import {CloudFunction} from 'firebase-functions/lib/v2';

export const APP_ID = '__APP_ID__';
export const PROJECT_ID = '__PROJECT_ID__';
export const FILENAME = 'file_name';

export function getEventType<T>(cloudFunction: CloudFunction<T>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

export function getEventFilters<T>(cloudFunction: CloudFunction<T>): Record<string, string> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}
