import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { Change } from 'firebase-functions';
import {testApp} from '../../app';

const { DataSnapshot } = database;

export const APP_ID = '__APP_ID__';
export const PROJECT_ID = '42';
export const FILENAME = 'file_name';

export function getEventType(cloudFunction: CloudFunction<any>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

export function getEventFilters(
  cloudFunction: CloudFunction<any>
): Record<string, string> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}

export function getBaseCloudEvent<EventType extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<EventType>
): EventType {
  return {
    specversion: '1.0',
    id: makeEventId(),
    data: undefined,
    source: '', // Required field that will get overridden by Provider-specific MockCloudEventPartials
    type: getEventType(cloudFunction),
    time: new Date().toISOString(),
  } as EventType;
}

export function makeDataSnapshot(
  event: database.RawRTDBCloudEvent,
  instance: string
): database.DataSnapshot {
  return new DataSnapshot(event.data, event.ref, undefined, instance);
}

export function makeChangedDataSnapshot(
  event: database.RawRTDBCloudEvent,
  instance: string
): Change<database.DataSnapshot> {
  const before = new DataSnapshot(
    event.data.data,
    event.ref,
    testApp().getApp(),
    instance
  );
  const after = new DataSnapshot(
    applyChange(event.data.data, event.data.delta),
    event.ref,
    testApp().getApp(),
    instance
  );
  return {
    before,
    after,
  };
}

function makeEventId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

// Clone and owned from firebase-functions
function applyChange(src: any, dest: any) {
  // if not mergeable, don't merge
  if (!isObject(dest) || !isObject(src)) {
    return dest;
  }

  return merge(src, dest);
}

function isObject(obj: any): boolean {
  return typeof obj === 'object' && !!obj;
}

function merge(
  src: Record<string, any>,
  dest: Record<string, any>
): Record<string, any> {
  const res: Record<string, any> = {};
  const keys = new Set([...Object.keys(src), ...Object.keys(dest)]);

  for (const key of keys.values()) {
    if (key in dest) {
      if (dest[key] === null) {
        continue;
      }
      res[key] = applyChange(src[key], dest[key]);
    } else if (src[key] !== null) {
      res[key] = src[key];
    }
  }
  return res;
}
