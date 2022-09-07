import { CloudEvent, CloudFunction } from 'firebase-functions/v2';
import { Expression } from 'firebase-functions/v2/params';

export const APP_ID = '__APP_ID__';
export const PROJECT_ID = '42';
export const FILENAME = 'file_name';

export function getEventType(cloudFunction: CloudFunction<any>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

export function getEventFilters(
  cloudFunction: CloudFunction<any>
): Record<string, string | Expression<string>> {
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

export function resolveStringExpression(
  stringOrExpression: string | Expression<string>
) {
  if (typeof stringOrExpression === 'string') {
    return stringOrExpression;
  }
  return stringOrExpression?.value();
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
