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

import { CloudFunction, CloudEvent } from 'firebase-functions';
import { CallableFunction, CallableRequest } from 'firebase-functions/https';

import { generateCombinedCloudEvent } from './cloudevent/generate';
import { DeepPartial } from './cloudevent/types';
import * as express from 'express';

/** A function that can be called with test data and optional override values for {@link CloudEvent}
 * It will subsequently invoke the cloud function it wraps with the provided {@link CloudEvent}
 */
export type WrappedV2Function<T extends CloudEvent<unknown>> = (
  cloudEventPartial?: DeepPartial<T | object>
) => any | Promise<any>;

export type WrappedV2CallableFunction<T> = (
  data: CallableRequest
) => T | Promise<T>;

function isCallableV2Function<T extends CloudEvent<unknown>>(
  cf: CloudFunction<T> | CallableFunction<any, any>
): cf is CallableFunction<any, any> {
  return !!cf?.__endpoint?.callableTrigger;
}

function assertIsCloudFunction<T extends CloudEvent<unknown>>(
  cf: CloudFunction<T> | CallableFunction<any, any>
): asserts cf is CloudFunction<T> {
  if (!('run' in cf) || !cf.run) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v3.20.0 and above'
    );
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

export function wrapV2<T extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<T> | CallableFunction<any, any>
): WrappedV2Function<T> | WrappedV2CallableFunction<any> {
  if (isCallableV2Function(cloudFunction)) {
    return (req: CallableRequest) => {
      return cloudFunction.run(req);
    };
  }

  assertIsCloudFunction(cloudFunction);

  if (cloudFunction?.__endpoint?.platform !== 'gcfv2') {
    throw new Error('This function can only wrap V2 CloudFunctions.');
  }

  return (cloudEventPartial?: DeepPartial<T>) => {
    const cloudEvent = generateCombinedCloudEvent(
      cloudFunction,
      cloudEventPartial
    );
    return cloudFunction.run(cloudEvent);
  };
}
