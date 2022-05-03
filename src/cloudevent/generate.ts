import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/v2';
import {LIST_OF_MOCK_CLOUD_EVENT_PARTIALS} from './partials/partials';
import {DeepPartial} from './types';
import merge from 'ts-deepmerge';

/**
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export function generateCombinedCloudEvent<EventType>(
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<CloudEvent>): CloudEvent {
  const generatedCloudEvent = generateMockCloudEvent(cloudFunction);
  return cloudEventPartial? merge(generatedCloudEvent, cloudEventPartial): generatedCloudEvent;
}

/** @internal */
export function generateMockCloudEvent<EventType>(
  cloudFunction: CloudFunction<EventType>): CloudEvent {
  return {
    ...generateDefaultCloudEventPartial(),
    ...generateMockCloudEventPartial<EventType>(cloudFunction)
  } as CloudEvent;
}

/** @internal */
function generateDefaultCloudEventPartial(): Partial<CloudEvent> {
  return {
    specversion: '1.0',
    id: makeEventId(),
    data: {},
    time: new Date().toISOString(),
  } as Partial<CloudEvent>;
}

function generateMockCloudEventPartial<EventType>(
  cloudFunction: CloudFunction<EventType>): DeepPartial<CloudEvent<EventType>> {
  for (const mockCloudEventPartial of LIST_OF_MOCK_CLOUD_EVENT_PARTIALS) {
    if (mockCloudEventPartial.match(cloudFunction)) {
      return mockCloudEventPartial.generatePartial(cloudFunction);
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
