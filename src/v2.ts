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

import type { CloudFunction, CloudEvent } from 'firebase-functions/v2';
import type { CallableFunction, CallableRequest } from 'firebase-functions/v2/https';
import type {
  ScheduledEvent,
  ScheduleFunction,
} from 'firebase-functions/v2/scheduler';

import { generateCombinedCloudEvent } from './cloudevent/generate';
import { DeepPartial } from './cloudevent/types';

type V2WrappableFunctions =
  | CloudFunction<any>
  | CallableFunction<any, any>
  | ScheduleFunction;

/** A function that can be called with test data and optional override values for {@link CloudEvent}
 * It will subsequently invoke the cloud function it wraps with the provided {@link CloudEvent}
 */
export type WrappedV2Function<T extends CloudEvent<unknown>> = (
  cloudEventPartial?: DeepPartial<T | object>
) => any | Promise<any>;

export type WrappedV2CallableFunction<T> = (
  data: CallableRequest
) => T | Promise<T>;

export type WrappedV2ScheduledFunction = (
  data: ScheduledEvent
) => void | Promise<void>;

function isCallableV2Function(
  cf: V2WrappableFunctions
): cf is CallableFunction<any, any> {
  return !!cf.__endpoint?.callableTrigger;
}

function isScheduledV2Function(
  cf: V2WrappableFunctions
): cf is ScheduleFunction {
  return !!cf.__endpoint?.scheduleTrigger;
}

function assertIsCloudFunction<T extends CloudEvent<unknown>>(
  cf: V2WrappableFunctions
): asserts cf is CloudFunction<T> {
  if (!('run' in cf) || !cf.run) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v3.20.0 and above'
    );
  }
}

function assertIsCloudFunctionV2<T extends CloudEvent<unknown>>(
  cf: CloudFunction<T> | CallableFunction<any, any>
): asserts cf is CloudFunction<T> {
  if (cf?.__endpoint?.platform !== 'gcfv2') {
    throw new Error('This function can only wrap V2 CloudFunctions.');
  }
}

/**
 * Takes a v2 cloud function to be tested, and returns a {@link WrappedV2Function}
 * which can be called in test code.
 */
export function wrapV2<T extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<T>
): WrappedV2Function<T>;

/**
 * Takes a v2 HTTP function to be tested, and returns a {@link WrappedV2HttpsFunction}
 * which can be called in test code.
 */
export function wrapV2(
  cloudFunction: CallableFunction<any, any>
): WrappedV2CallableFunction<any>;

export function wrapV2(
  cloudFunction: ScheduleFunction
): WrappedV2ScheduledFunction;

export function wrapV2<T extends CloudEvent<unknown>>(
  cloudFunction:
    | CloudFunction<T>
    | CallableFunction<any, any>
    | ScheduleFunction
):
  | WrappedV2Function<T>
  | WrappedV2CallableFunction<any>
  | WrappedV2ScheduledFunction {
  if (!cloudFunction) {
    throw new Error('Cannot wrap: undefined cloud function');
  }

  assertIsCloudFunction(cloudFunction);
  assertIsCloudFunctionV2(cloudFunction);

  if (isCallableV2Function(cloudFunction)) {
    return (req: CallableRequest) => {
      return cloudFunction.run(req);
    };
  }

  if (isScheduledV2Function(cloudFunction)) {
    return createScheduledWrapper(cloudFunction);
  }

  return (cloudEventPartial?: DeepPartial<T>) => {
    const cloudEvent = generateCombinedCloudEvent(
      cloudFunction,
      cloudEventPartial
    );
    return cloudFunction.run(cloudEvent);
  };
}

function createScheduledWrapper(
  cloudFunction: ScheduleFunction
): WrappedV2ScheduledFunction {
  return (options: ScheduledEvent) => {
    _checkOptionValidity(['jobName', 'scheduleTime'], options);
    return cloudFunction.run(options);
  };
}

function _checkOptionValidity(
  validFields: string[],
  options: Record<string, any>
) {
  Object.keys(options).forEach((key) => {
    if (validFields.indexOf(key) === -1) {
      throw new Error(
        `Options object ${JSON.stringify(options)} has invalid key "${key}"`
      );
    }
  });
}