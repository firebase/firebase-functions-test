import * as v1 from 'firebase-functions/v1';
import * as v2 from 'firebase-functions/v2';
import { Expression } from 'firebase-functions/params';

export const APP_ID = '__APP_ID__';
export const PROJECT_ID = '42';
export const FILENAME = 'file_name';

type CloudFunction = v1.CloudFunction<any> | v2.CloudFunction<any>;

export function getEventType(cloudFunction: CloudFunction): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

export function getEventFilters(
  cloudFunction: CloudFunction
): Record<string, string | Expression<string>> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}

export function getBaseCloudEvent<EventType extends v2.CloudEvent<unknown>>(
  cloudFunction: v2.CloudFunction<EventType>
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

/** Resolves param values and inserts them into the provided ref string. */
export function extractRef(rawRef: string, params: Record<string, string>) {
  const refSegments = rawRef.split('/');

  return refSegments
    .map((segment) => {
      if (segment.startsWith('{') && segment.endsWith('}')) {
        const param = segment
          .slice(1, -1)
          .replace('=**', '')
          .replace('=*', '');
        return params[param] || 'undefined';
      }
      return segment;
    })
    .join('/');
}
