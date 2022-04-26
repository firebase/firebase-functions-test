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

import {has, merge, random, get} from 'lodash';

import {
  CloudFunction as CloudFunctionV1,
} from 'firebase-functions';

import {
  CloudFunction as CloudFunctionV2,
} from 'firebase-functions/lib/v2/core';

import {
  wrapV1,
  WrappedFunction,
  WrappedScheduledFunction,
} from './v1';

import {
  wrapV2,
  WrappedV2Function,
} from './v2';

// Re-exporting V1 (to reduce breakage)
export {
  ContextOptions,
  EventContextOptions,
  WrappedFunction,
  WrappedScheduledFunction,
  CallableContextOptions,
  makeChange,
  mockConfig,
  _makeResourceName,
  _extractParams,
} from './v1';

// V2 Exports
export {
  WrappedV2Function,
} from './v2';

export function wrap<T>(cloudFunction: CloudFunctionV1<T>): WrappedScheduledFunction | WrappedFunction;
export function wrap<T>(cloudFunction: CloudFunctionV2<T>): WrappedV2Function;

export function wrap<T>(
  cloudFunction: CloudFunctionV1<T> | CloudFunctionV2<T>
): WrappedScheduledFunction | WrappedFunction | WrappedV2Function {
  if (isV2CloudFunction(cloudFunction as CloudFunctionV2<T>)) {
    return wrapV2<T>(cloudFunction as CloudFunctionV2<T>);
  }
  return wrapV1<T>(cloudFunction as CloudFunctionV1<T>);
}

/**
 * The key differences between V1 and V2 CloudFunctions are:
 * <ul>
 *    <li> V1 CloudFunction's handler requires the 1st arg, but has an optional 2nd.
 *    <li> V1 CloudFunction's run handler always has 2 arguments
 *    <li> V2 CloudFunction's handler is always 1 argument
 *    <li> V2 CloudFunction's run handler always has 1 argument
 * @return True iff the CloudFunction is a V2 function.
 */
function isV2CloudFunction<T>(cloudFunction: CloudFunctionV2<T>) {
  return cloudFunction.length === 1 && cloudFunction?.run?.length === 1;
}
