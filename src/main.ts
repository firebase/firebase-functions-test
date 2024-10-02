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
  CloudFunction as CloudFunctionV1,
  HttpsFunction,
  Runnable,
} from 'firebase-functions/v1';

import {
  CloudFunction as CloudFunctionV2,
  CloudEvent,
} from 'firebase-functions';

import {
  CallableFunction,
  HttpsFunction as HttpsFunctionV2,
} from 'firebase-functions/https';

import { wrapV1, WrappedFunction, WrappedScheduledFunction } from './v1';

import { wrapV2, WrappedV2Function, WrappedV2CallableFunction } from './v2';

type HttpsFunctionOrCloudFunctionV1<T, U> = U extends HttpsFunction &
  Runnable<T>
  ? HttpsFunction & Runnable<T>
  : CloudFunctionV1<T>;

// Re-exporting V1 (to reduce breakage)
export {
  ContextOptions,
  EventContextOptions,
  WrappedFunction,
  WrappedScheduledFunction,
  CallableContextOptions,
  makeChange,
  mockConfig,
} from './v1';

// V2 Exports
export { WrappedV2Function } from './v2';

export function wrap<T>(
  cloudFunction: HttpsFunction & Runnable<T>
): WrappedFunction<T, HttpsFunction & Runnable<T>>;
export function wrap<T>(
  cloudFunction: CallableFunction<any, T>
): WrappedV2CallableFunction<T>;
export function wrap<T>(
  cloudFunction: CloudFunctionV1<T>
): WrappedScheduledFunction | WrappedFunction<T>;
export function wrap<T extends CloudEvent<unknown>>(
  cloudFunction: CloudFunctionV2<T>
): WrappedV2Function<T>;
export function wrap<T, V extends CloudEvent<unknown>>(
  cloudFunction: CloudFunctionV1<T> | CloudFunctionV2<V> | HttpsFunctionV2
):
  | WrappedScheduledFunction
  | WrappedFunction<T>
  | WrappedV2Function<V>
  | WrappedV2CallableFunction<T> {
  if (isV2CloudFunction<V>(cloudFunction)) {
    return wrapV2<V>(cloudFunction as CloudFunctionV2<V>);
  }
  return wrapV1<T>(
    cloudFunction as HttpsFunctionOrCloudFunctionV1<T, typeof cloudFunction>
  );
}

/**
 * The key differences between V1 and V2 CloudFunctions are:
 * <ul>
 *    <li> V1 CloudFunction is sometimes a binary function
 *    <li> V2 CloudFunction is always a unary function
 *    <li> V1 CloudFunction.run is always a binary function
 *    <li> V2 CloudFunction.run is always a unary function
 * @return True iff the CloudFunction is a V2 function.
 */
function isV2CloudFunction<T extends CloudEvent<unknown>>(
  cloudFunction: any
): cloudFunction is CloudFunctionV2<T> {
  return cloudFunction.length === 1 && cloudFunction?.run?.length === 1;
}
