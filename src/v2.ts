// The MIT License (MIT)
//
// Copyright (c) 2018 Firebase
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  CloudFunction,
  CloudEvent,
} from 'firebase-functions/v2';

/** A function that can be called with test data and optional override values for {@link CloudEvent}
 * It will subsequently invoke the cloud function it wraps with the provided {@link CloudEvent}
 */
export type WrappedV2Function = (
  cloudEvent?: CloudEvent
) => any | Promise<any>;

/**
 * Takes a v2 cloud function to be tested, and returns a {@link WrappedV2Function}
 * which can be called in test code.
 */
export function wrapV2<T>(
  cloudFunction: CloudFunction<T>
): WrappedV2Function {

  if (
    // @ts-ignore
    !!(cloudFunction?.__trigger?.httpsTrigger) &&
    // @ts-ignore
    cloudFunction?.__trigger?.labels?.['deployment-callable'] !== 'true'
  ) {
    throw new Error(
      'Wrap function is only available for `onCall` HTTP functions, not `onRequest`.'
    );
  }

  if (!cloudFunction.run) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v3.20.0 and above'
    );
  }

  if (cloudFunction?.__endpoint?.platform !== 'gcfv2') {
    throw new Error('This function can only wrap V2 CloudFunctions.');
  }

  return (cloudEvent: CloudEvent) => cloudFunction.run(cloudEvent);
}

/**
 * @param cloudFunction Populates default values of the CloudEvent
 * @param {Partial<CloudEvent>} cloudEventOverride Used to override CloudEvent params.
 * @return {CloudEvent} Generated Mock CloudEvent
 */
export const createMockCloudEvent = <FunctionType, EventType>(
  cloudFunction: CloudFunction<FunctionType>,
  cloudEventOverride?: Partial<CloudEvent>): CloudEvent<EventType> => {
  return {
    ...createCloudEventWithDefaultValues<FunctionType, EventType>(cloudFunction),
    ...cloudEventOverride,
  } as CloudEvent<EventType>;
};

/** @internal */

const getCloudEventSource =
  <T>(cloudFunction: CloudFunction<T>): string => {
  const projectId = '__PROJECT_ID__';
  const type = getCloudEventType<T>(cloudFunction);
  switch (type) {
      case 'google.cloud.storage.object.v1.archived': // Fall-through intended
      case 'google.cloud.storage.object.v1.deleted': // Fall-through intended
      case 'google.cloud.storage.object.v1.finalized': // Fall-through intended
      case 'google.cloud.storage.object.v1.metadataUpdated':
        const bucketId = cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.bucket || '';
        return `//storage.googleapis.com/projects/_/buckets/${bucketId}`;
      case 'google.cloud.pubsub.topic.v1.messagePublished':
        const topicId = cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.topic || '';
        return `//pubsub.googleapis.com/projects/${projectId}/topics/${topicId}`;
        return cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.topic || '';
      case 'google.firebase.firebasealerts.alerts.v1.published':
        return `//firebasealerts.googleapis.com/projects/${projectId}`;
      default:
        return '';
    }
  };

const getCloudEventSubject =
  <T>(cloudFunction: CloudFunction<T>, type: string): string => {
    switch (type) {
      case 'google.cloud.storage.object.v1.archived': // Fall-through intended
      case 'google.cloud.storage.object.v1.deleted': // Fall-through intended
      case 'google.cloud.storage.object.v1.finalized': // Fall-through intended
      case 'google.cloud.storage.object.v1.metadataUpdated':
        return `objects/__STORAGE_FILENAME__`;
      case 'google.firebase.firebasealerts.alerts.v1.published': // FirebaseAlerts do not contain a subject
      case 'google.cloud.pubsub.topic.v1.messagePublished': // Pubsub CloudEvents do not contain a subject
      default:
        return null;
    }
  };

const getCloudEventType =
  <T>(cloudFunction: CloudFunction<T>): string => {
    return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
  };

/** @return CloudEvent populated with default values */
const createCloudEventWithDefaultValues =
  <FunctionType, EventType>(cloudFunction: CloudFunction<FunctionType>): CloudEvent<EventType> => {
  const type = getCloudEventType<FunctionType>(cloudFunction);
  const event = {
    id: makeEventId(),
    source: getCloudEventSource<FunctionType>(cloudFunction),
    type,
    data: {},
    time: new Date().toISOString(),
    params: {}
  } as CloudEvent<EventType>;

  const subject = getCloudEventSubject<FunctionType>(cloudFunction, type);
  if (subject) { event.subject = subject; }

  return (event);
};

const makeEventId = (): string => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};
