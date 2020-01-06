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

import { pubsub } from 'firebase-functions';

/** Create a Message from a JSON object. */
export function makeMessage(
  /** Content of message. */
  json: { [key: string]: any },
  /** Optional Pubsub message attributes. */
  attributes?: { [key: string]: string }
): pubsub.Message;

/** Create a Message from a base-64 encoded string. */
export function makeMessage(
  /** Base-64 encoded message string. */
  encodedString: string,
  /** Optional Pubsub message attributes. */
  attributes?: { [key: string]: string }
): pubsub.Message;

export function makeMessage(
  jsonOrEncodedString: { [key: string]: any } | string,
  attributes?: { [key: string]: string }
): pubsub.Message {
  let data = jsonOrEncodedString;
  if (typeof data !== 'string') {
    try {
      data = new Buffer(JSON.stringify(data)).toString('base64');
    } catch (e) {
      throw new Error(
        'Please provide either a JSON object or a base 64 encoded string.'
      );
    }
  }
  return new pubsub.Message({
    data,
    attributes: attributes || {},
  });
}

/** Fetch an example Message already populated with data. */
export function exampleMessage(): pubsub.Message {
  return makeMessage({ message: 'Hello World!' });
}
