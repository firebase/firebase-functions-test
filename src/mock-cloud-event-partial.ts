import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {LIST_OF_MOCK_CLOUD_EVENT_PARTIALS} from './mock-cloud-event-partial-definitions';

export function generateDefaultCloudEventPartial(): Partial<CloudEvent> {
  return {
    specversion: '1.0',
    id: makeEventId(),
    data: {},
    time: new Date().toISOString(),
    params: {}
  } as Partial<CloudEvent>;
}

export function generateMockCloudEventPartial<T>(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
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
