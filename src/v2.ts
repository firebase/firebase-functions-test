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

import { CloudFunction, CloudEvent } from 'firebase-functions/v2';

import { generateCombinedCloudEvent } from './cloudevent/generate';
import { DeepPartial } from './cloudevent/types';

/** A function that can be called with test data and optional override values for {@link CloudEvent}
 * It will subsequently invoke the cloud function it wraps with the provided {@link CloudEvent}
 */
export type WrappedV2Function<T extends CloudEvent<unknown>> = (
  cloudEventPartial?: DeepPartial<T>
) => any | Promise<any>;

/**
 * Takes a v2 cloud function to be tested, and returns a {@link WrappedV2Function}
 * which can be called in test code.
 */
export function wrapV2<T extends CloudEvent<unknown>>(
  cloudFunction: CloudFunction<T>
): WrappedV2Function<T> {
  if (cloudFunction?.__endpoint?.callableTrigger) {
    throw new Error(
      'Wrap function is not available for callableTriggers functions.'
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

  return (cloudEventPartial?: DeepPartial<T>) => {
    const cloudEvent = generateCombinedCloudEvent(
      cloudFunction,
      cloudEventPartial
    );
    return cloudFunction.run(cloudEvent);
  };
}
