import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/v2';
import {LIST_OF_MOCK_CLOUD_EVENT_PARTIALS} from './partials/partials';
import {DeepPartial} from './types';
import merge from 'ts-deepmerge';
import {getEventType} from './partials/helpers';

/**
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export function generateCombinedCloudEvent<EventType>(
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<CloudEvent>): CloudEvent {
  const generatedCloudEvent = generateMockCloudEvent(cloudFunction);
  return cloudEventPartial ? merge(generatedCloudEvent, cloudEventPartial) : generatedCloudEvent;
}

/** @internal */
export function generateMockCloudEvent<EventType>(
  cloudFunction: CloudFunction<EventType>): CloudEvent {
  return {
    ...generateBaseCloudEvent(cloudFunction),
    ...generateMockCloudEventPartial<EventType>(cloudFunction)
  };
}

/** @internal */
function generateBaseCloudEvent<EventType>(cloudFunction: CloudFunction<EventType>): CloudEvent {
  return {
    specversion: '1.0',
    id: makeEventId(),
    data: {},
    source: '', // Required field that will get overridden by Provider-specific MockCloudEventPartials
    type: getEventType(cloudFunction),
    time: new Date().toISOString()
  };
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
