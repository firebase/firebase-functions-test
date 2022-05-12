import { CloudEvent } from 'firebase-functions/v2';
import { CloudFunction } from 'firebase-functions/v2';
import { LIST_OF_MOCK_CLOUD_EVENT_PARTIALS } from './partials/partials';
import { DeepPartial, MockCloudEventPartials } from './types';
import merge from 'ts-deepmerge';
import { getEventType } from './partials/helpers';

/**
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export function generateCombinedCloudEvent<
  EventType extends CloudEvent<unknown>
>(
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<EventType>
): EventType {
  const generatedCloudEvent = generateMockCloudEvent(cloudFunction);
  return cloudEventPartial
    ? (mergeCloudEvent(generatedCloudEvent, cloudEventPartial) as EventType)
    : generatedCloudEvent;
}

export function generateMockCloudEvent<EventType extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<EventType>
): EventType {
  return {
    ...generateBaseCloudEvent(cloudFunction),
    ...generateMockCloudEventPartial(cloudFunction),
  };
}

function mergeCloudEvent<EventType extends CloudEvent<any>>(
  generatedCloudEvent: EventType,
  cloudEventPartial: DeepPartial<EventType>
) {
  const combined = merge(generatedCloudEvent, cloudEventPartial) as DeepPartial<EventType>;

  // Handle Opaque keys for Pub/Sub CloudEvents
  if (generatedCloudEvent.data?.message?.json && cloudEventPartial?.data?.message?.json) {
    combined.data.message.json = cloudEventPartial.data.message.json;
    combined.data.message.data = Buffer.from(
      JSON.stringify(cloudEventPartial.data.message.json)).toString('base64');
  }
  if (combined.data?.message?.data && cloudEventPartial?.data?.message?.data) {
    combined.data.message.data = cloudEventPartial.data.message.data;
  }
  return combined;
}

/** @internal */
function generateBaseCloudEvent<EventType extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<EventType>
): EventType {
  // TODO: Consider refactoring so that we don't use this utility function. This
  // is not type safe because EventType may require additional fields, which this
  // function does not know how to satisfy.
  // This could possibly be augmented to take a CloudEvent<unknown> and AdditionalFields<EventType>
  // where AdditionalFields uses the keyof operator to make only new fields required.
  return {
    specversion: '1.0',
    id: makeEventId(),
    data: {},
    source: '', // Required field that will get overridden by Provider-specific MockCloudEventPartials
    type: getEventType(cloudFunction),
    time: new Date().toISOString(),
  } as any;
}

function generateMockCloudEventPartial<EventType extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<EventType>
): DeepPartial<EventType> {
  for (const mockCloudEventPartial of LIST_OF_MOCK_CLOUD_EVENT_PARTIALS) {
    if (mockCloudEventPartial.match(cloudFunction)) {
      return (mockCloudEventPartial as MockCloudEventPartials<
        EventType
      >).generatePartial(cloudFunction);
    }
  }
  // No matches were found
  return {};
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
