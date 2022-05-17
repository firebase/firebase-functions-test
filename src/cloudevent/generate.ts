import { CloudEvent } from 'firebase-functions/v2';
import { CloudFunction } from 'firebase-functions/v2';
import { LIST_OF_MOCK_CLOUD_EVENT_PARTIALS } from './mocks/partials';
import { DeepPartial, MockCloudEventAbstractFactory } from './types';
import merge from 'ts-deepmerge';

/**
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export function generateCombinedCloudEvent<
  EventType extends CloudEvent<unknown>
>(
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<EventType>
): EventType {
  const generatedCloudEvent = generateMockCloudEvent(
    cloudFunction,
    cloudEventPartial
  );
  return cloudEventPartial
    ? (merge(generatedCloudEvent, cloudEventPartial) as EventType)
    : generatedCloudEvent;
}

export function generateMockCloudEvent<EventType extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<EventType>
): EventType {
  for (const mockCloudEventPartial of LIST_OF_MOCK_CLOUD_EVENT_PARTIALS) {
    if (mockCloudEventPartial.match(cloudFunction)) {
      return mockCloudEventPartial.generateMock(
        cloudFunction,
        cloudEventPartial
      );
    }
  }
  // No matches were found
  return null;
}
