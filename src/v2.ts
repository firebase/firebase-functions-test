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
export type WrappedFunction = (
  cloudEvent?: CloudEvent
) => any | Promise<any>;

/** A scheduled function that can be called with a {@link CloudEvent}.
 * It will subsequently invoke the cloud function it wraps with a generated {@link CloudEvent}.
 */
export type WrappedScheduledFunction = (
  cloudEvent?: CloudEvent
) => any | Promise<any>;

/** Takes a v2 cloud function to be tested, and returns a {@link WrappedFunction}
 * which can be called in test code.
 */
export function wrap<T>(
  cloudFunction: CloudFunction<T>
): WrappedScheduledFunction | WrappedFunction {

  // TODO(tystark) Verify this is the appopriate handle for ScheduledFunctions
  if (
    // @ts-ignore
    cloudFunction?.__trigger?.labels &&
    // @ts-ignore
    cloudFunction?.__trigger?.labels['deployment-scheduled'] === 'true') {
    return (cloudEvent: CloudEvent): WrappedScheduledFunction => cloudFunction.run(cloudEvent);
  }

  // TODO(tystark) verify
  if (
    // @ts-ignore
    !!(cloudFunction?.__trigger?.httpsTrigger) &&
    // @ts-ignore
    cloudFunction?.__trigger?.labels &&
    // @ts-ignore
    cloudFunction?.__trigger?.labels['deployment-callable'] !== 'true'
  ) {
    throw new Error(
      'Wrap function is only available for `onCall` HTTP functions, not `onRequest`.'
    );
  }

  if (!cloudFunction.run) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v1.0.0 and above'
    );
  }

  // TODO(tystark) verify
  if (!cloudFunction.__endpoint) {
    throw new Error(
      'This function can only wrap V2 CloudFunctions.'
    );
  }

  let wrapped: WrappedFunction = (cloudEvent: CloudEvent) => {
    _checkCloudEventValidity(
      [
        'specversion',
        'id',
        'source',
        'subject',
        'type',
        'time',
        'data',
        'params'],
      cloudEvent);

    return cloudFunction.run(cloudEvent);
  };

  return wrapped;
}

/** @internal */

/** @return CloudEvent populated with default values */
export const _getDefaultCloudEvent = (): CloudEvent => (
  {
    id: _makeEventId(),
    source: 'source',
    subject: 'subject',
    type: 'type',
    time: 'time',
    data: {},
    params: {}
  } as CloudEvent
);

function _makeEventId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

function _checkCloudEventValidity(
  validFields: string[],
  options: { [s: string]: any }
) {
  Object.keys(options).forEach((key) => {
    if (validFields.indexOf(key) === -1) {
      throw new Error(
        `Options object ${JSON.stringify(options)} has invalid key "${key}"`
      );
    }
  });
}
