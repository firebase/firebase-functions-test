import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import { Change } from 'firebase-functions';

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
    undefined,
    instance
  );
  const after = new DataSnapshot(
    {
      ...event.data.data,
      ...event.data.delta,
    },
    event.ref,
    undefined,
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
