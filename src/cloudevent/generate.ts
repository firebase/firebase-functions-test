import {
  CloudEvent,
  CloudFunction,
  database,
  pubsub,
} from 'firebase-functions/v2';
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { LIST_OF_MOCK_CLOUD_EVENT_PARTIALS } from './mocks/partials';
import { DeepPartial } from './types';
import { Change } from 'firebase-functions/v1';
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
  return mergeCloudEvents(generatedCloudEvent, cloudEventPartial);
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

const IMMUTABLE_DATA_TYPES = [
  database.DataSnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Change,
  pubsub.Message,
];

function mergeCloudEvents<EventType extends CloudEvent<unknown>>(
  generatedCloudEvent: EventType,
  cloudEventPartial: DeepPartial<EventType>
) {
  /**
   * There are several CloudEvent.data types that can not be overridden with json.
   * In these circumstances, we generate the CloudEvent.data given the user supplies
   * in the DeepPartial<CloudEvent>.
   *
   * Because we have already extracted the user supplied data, we don't want to overwrite
   * the CloudEvent.data with an incompatible type.
   *
   * An example of this is a user supplying JSON for the data of the DatabaseEvents.
   * The returned CloudEvent should be returning DataSnapshot that uses the supplied json,
   * NOT the supplied JSON.
   */
  if (shouldDeleteUserSuppliedData(generatedCloudEvent, cloudEventPartial)) {
    delete cloudEventPartial.data;
  }
  return cloudEventPartial
    ? (merge(generatedCloudEvent, cloudEventPartial) as EventType)
    : generatedCloudEvent;
}

function shouldDeleteUserSuppliedData<EventType extends CloudEvent<unknown>>(
  generatedCloudEvent: EventType,
  cloudEventPartial: DeepPartial<EventType>
) {
  // Don't attempt to delete the data if there is no data.
  if (cloudEventPartial?.data === undefined) {
    return false;
  }
  // If the user intentionally provides one of the IMMUTABLE DataTypes, DON'T delete it!
  if (
    IMMUTABLE_DATA_TYPES.some((type) => cloudEventPartial?.data instanceof type)
  ) {
    return false;
  }

  /** If the generated CloudEvent.data is an IMMUTABLE DataTypes, then use the generated data and
   * delete the user supplied CloudEvent.data.
   */
  if (
    IMMUTABLE_DATA_TYPES.some(
      (type) => generatedCloudEvent?.data instanceof type
    )
  ) {
    return true;
  }

  // Otherwise, don't delete the data and allow ts-merge to handle merging the data.
  return false;
}
