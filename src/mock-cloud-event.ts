import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {generateDefaultCloudEventPartial, generateMockCloudEventPartial} from './mock-cloud-event-partial';

/**
 * @param cloudFunction Populates default values of the CloudEvent
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export function generateMockCloudEvent<FunctionType, EventType>(
  cloudFunction: CloudFunction<FunctionType>): CloudEvent {
  return {
    ...generateDefaultCloudEventPartial(),
    ...generateMockCloudEventPartial<FunctionType, EventType>(cloudFunction)
  } as CloudEvent;
}
