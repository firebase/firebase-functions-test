import {CloudFunction, database} from 'firebase-functions/v2';
import { Change } from 'firebase-functions';
import {testApp} from '../../../app';
import {getBaseCloudEvent} from '../helpers';
import {DeepPartial} from '../../types';

const { DataSnapshot } = database;

export function makeDataSnapshot(
  cloudFunction: CloudFunction<database.DatabaseEvent<database.DataSnapshot>>,
  cloudEventPartial: DeepPartial<database.DatabaseEvent<any>>,
  instance: string
): database.DataSnapshot {
  const event = makeRawRTDBCloudEvent(cloudFunction, cloudEventPartial);
  const eventData = cloudEventPartial?.data?._data || event.data;
  return new DataSnapshot(eventData, event.ref, undefined, instance);
}

export function makeChangedDataSnapshot(
  cloudFunction: CloudFunction<database.DatabaseEvent<database.DataSnapshot>>,
  cloudEventPartial: DeepPartial<database.DatabaseEvent<Change<any>>>,
  instance: string
): Change<database.DataSnapshot> {
  const event = makeRawRTDBCloudEvent(cloudFunction, cloudEventPartial);
  const beforeData = cloudEventPartial?.data?.before?._data || event.data.data;
  const afterData = cloudEventPartial?.data?.after?._data || applyChange(event.data.data, event.data.delta);

  const before = new DataSnapshot(
    beforeData,
    event.ref,
    testApp().getApp(),
    instance
  );
  const after = new DataSnapshot(
    afterData,
    event.ref,
    testApp().getApp(),
    instance
  );
  return {
    before,
    after,
  };
}

/** @hidden */
function makeRawRTDBCloudEvent(cloudFunction, cloudEventPartial): database.RawRTDBCloudEvent {
  const instance = (cloudEventPartial?.instance as string) || 'instance-1';
  const firebaseDatabaseHost =
    (cloudEventPartial?.firebaseDatabaseHost as string) ||
    'firebaseDatabaseHost';
  const ref = (cloudEventPartial?.ref as string) || '/foo/bar';
  const location = (cloudEventPartial?.location as string) || 'us-central1';

  const mockRawRTDBCloudEventData: database.RawRTDBCloudEventData = {
    ['@type']:
      'type.googleapis.com/google.events.firebase.database.v1.ReferenceEventData',
    data: {
      a: 1,
      b: 2,
    },
    delta: {
      a: 3,
      c: 4,
    },
  };

  return {
    // Spread common fields
    ...getBaseCloudEvent(cloudFunction),

    data: mockRawRTDBCloudEventData,
    instance,
    firebasedatabasehost: firebaseDatabaseHost,
    ref,
    location,
  } as database.RawRTDBCloudEvent;
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
