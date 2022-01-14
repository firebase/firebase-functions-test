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

import { has, merge, random, get } from 'lodash';

import {
  CloudFunction,
  EventContext,
  Change,
  https,
  config,
  database,
  firestore,
} from 'firebase-functions';

/** Fields of the event context that can be overridden/customized. */
export type EventContextOptions = {
  /** ID of the event. If omitted, a random ID will be generated. */
  eventId?: string;
  /** ISO time string of when the event occurred. If omitted, the current time is used. */
  timestamp?: string;
  /** The values for the wildcards in the reference path that a database or Firestore function is listening to.
   * If omitted, random values will be generated.
   */
  params?: { [option: string]: any };
  /** (Only for database functions and https.onCall.) Firebase auth variable representing the user that triggered
   *  the function. Defaults to null.
   */
  auth?: any;
  /** (Only for database and https.onCall functions.) The authentication state of the user that triggered the function.
   * Default is 'UNAUTHENTICATED'.
   */
  authType?: 'ADMIN' | 'USER' | 'UNAUTHENTICATED';

  /** Resource is a standard format for defining a resource (google.rpc.context.AttributeContext.Resource).
   * In Cloud Functions, it is the resource that triggered the function - such as a storage bucket.
   */
  resource?: {
    service: string;
    name: string;
    type?: string;
    labels?: {
      [tag: string]: string;
    };
  };
};

/** Fields of the callable context that can be overridden/customized. */
export type CallableContextOptions = {
  /**
   * The result of decoding and verifying a Firebase AppCheck token.
   */
  app?: any;

  /**
   * The result of decoding and verifying a Firebase Auth ID token.
   */
  auth?: any;

  /**
   * An unverified token for a Firebase Instance ID.
   */
  instanceIdToken?: string;

  /**
   * The raw HTTP request object.
   */
  rawRequest?: https.Request;
};

/* Fields for both Event and Callable contexts, checked at runtime */
export type ContextOptions = EventContextOptions | CallableContextOptions;

/** A function that can be called with test data and optional override values for the event context.
 * It will subsequently invoke the cloud function it wraps with the provided test data and a generated event context.
 */
export type WrappedFunction<T = any> = (
  data: any,
  options?: ContextOptions
) => T;

/** A scheduled function that can be called with optional override values for the event context.
 * It will subsequently invoke the cloud function it wraps with a generated event context.
 */
export type WrappedScheduledFunction<T = any> = (
  options?: ContextOptions
) => T;

/** Takes a cloud function to be tested, and returns a WrappedFunction which can be called in test code. */
export function wrap<T>(
  cloudFunction: CloudFunction<T>
): WrappedScheduledFunction<T> | WrappedFunction<T> {
  if (!has(cloudFunction, '__trigger')) {
    throw new Error(
      'Wrap can only be called on functions written with the firebase-functions SDK.'
    );
  }

  if (get(cloudFunction, '__trigger.labels.deployment-scheduled') === 'true') {
    const scheduledWrapped: WrappedScheduledFunction = (
      options: ContextOptions
    ) => {
      // Although in Typescript we require `options` some of our JS samples do not pass it.
      options = options || {};

      _checkOptionValidity(['eventId', 'timestamp'], options);
      const defaultContext = _makeDefaultContext(cloudFunction, options);
      const context = merge({}, defaultContext, options);

      // @ts-ignore
      return cloudFunction.run(context);
    };
    return scheduledWrapped;
  }

  if (
    has(cloudFunction, '__trigger.httpsTrigger') &&
    get(cloudFunction, '__trigger.labels.deployment-callable') !== 'true'
  ) {
    throw new Error(
      'Wrap function is only available for `onCall` HTTP functions, not `onRequest`.'
    );
  }

  if (!has(cloudFunction, 'run')) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v1.0.0 and above'
    );
  }

  const isCallableFunction =
    get(cloudFunction, '__trigger.labels.deployment-callable') === 'true';

  let wrapped: WrappedFunction = (data: T, options: ContextOptions) => {
    // Although in Typescript we require `options` some of our JS samples do not pass it.
    options = options || {};
    let context;

    if (isCallableFunction) {
      _checkOptionValidity(
        ['app', 'auth', 'instanceIdToken', 'rawRequest'],
        options
      );
      let callableContextOptions = options as CallableContextOptions;
      context = {
        ...callableContextOptions,
      };
    } else {
      _checkOptionValidity(
        ['eventId', 'timestamp', 'params', 'auth', 'authType', 'resource'],
        options
      );
      const defaultContext = _makeDefaultContext(cloudFunction, options, data);

      if (
        has(defaultContext, 'eventType') &&
        defaultContext.eventType !== undefined &&
        defaultContext.eventType.match(/firebase.database/)
      ) {
        defaultContext.authType = 'UNAUTHENTICATED';
        defaultContext.auth = null;
      }
      context = merge({}, defaultContext, options);
    }

    return cloudFunction.run(data, context);
  };

  return wrapped;
}

/** @internal */
export function _makeResourceName(
  triggerResource: string,
  params = {}
): string {
  const wildcardRegex = new RegExp('{[^/{}]*}', 'g');
  let resourceName = triggerResource.replace(wildcardRegex, (wildcard) => {
    let wildcardNoBraces = wildcard.slice(1, -1); // .slice removes '{' and '}' from wildcard
    let sub = get(params, wildcardNoBraces);
    return sub || wildcardNoBraces + random(1, 9);
  });
  return resourceName;
}

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

function _checkOptionValidity(
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

function _makeDefaultContext<T>(
  cloudFunction: CloudFunction<T>,
  options: ContextOptions,
  triggerData?: T
): EventContext {
  let eventContextOptions = options as EventContextOptions;
  const eventResource = cloudFunction.__trigger.eventTrigger?.resource;
  const eventType = cloudFunction.__trigger.eventTrigger?.eventType;

  const optionsParams = eventContextOptions.params ?? {};
  let triggerParams = {};
  if (eventResource && eventType && triggerData) {
    if (eventType.startsWith('google.firebase.database.ref.')) {
      let data: database.DataSnapshot;
      if (eventType.endsWith('.write')) {
        // Triggered with change
        if (!(triggerData instanceof Change)) {
          throw new Error('Must be triggered by database change');
        }
        data = triggerData.before;
      } else {
        data = triggerData as any;
      }
      triggerParams = _extractDatabaseParams(eventResource, data);
    } else if (eventType.startsWith('google.firestore.document.')) {
      let data: firestore.DocumentSnapshot;
      if (eventType.endsWith('.write')) {
        // Triggered with change
        if (!(triggerData instanceof Change)) {
          throw new Error('Must be triggered by firestore document change');
        }
        data = triggerData.before;
      } else {
        data = triggerData as any;
      }
      triggerParams = _extractFirestoreDocumentParams(eventResource, data);
    }
  }
  const params = { ...triggerParams, ...optionsParams };

  const defaultContext: EventContext = {
    eventId: _makeEventId(),
    resource: eventResource && {
      service: cloudFunction.__trigger.eventTrigger?.service,
      name: _makeResourceName(eventResource, params),
    },
    eventType,
    timestamp: new Date().toISOString(),
    params,
  };
  return defaultContext;
}

function _extractDatabaseParams(
  triggerResource: string,
  data: database.DataSnapshot
): EventContext['params'] {
  const path = data.ref.toString().replace(data.ref.root.toString(), '');
  return _extractParams(triggerResource, path);
}

function _extractFirestoreDocumentParams(
  triggerResource: string,
  data: firestore.DocumentSnapshot
): EventContext['params'] {
  // Resource format: databases/(default)/documents/<path>
  return _extractParams(
    triggerResource.replace(/^databases\/[^\/]+\/documents\//, ''),
    data.ref.path
  );
}

/**
 * Extracts the `{wildcard}` values from `dataPath`.
 * E.g. A wildcard path of `users/{userId}` with `users/FOO` would result in `{ userId: 'FOO' }`.
 * @internal
 */
export function _extractParams(
  wildcardTriggerPath: string,
  dataPath: string
): EventContext['params'] {
  // Trim start and end / and split into path components
  const wildcardPaths = wildcardTriggerPath
    .replace(/^\/?(.*?)\/?$/, '$1')
    .split('/');
  const dataPaths = dataPath.replace(/^\/?(.*?)\/?$/, '$1').split('/');
  const params = {};
  if (wildcardPaths.length === dataPaths.length) {
    for (let idx = 0; idx < wildcardPaths.length; idx++) {
      const wildcardPath = wildcardPaths[idx];
      const name = wildcardPath.replace(/^{([^/{}]*)}$/, '$1');
      if (name !== wildcardPath) {
        // Wildcard parameter
        params[name] = dataPaths[idx];
      }
    }
  }
  return params;
}

/** Make a Change object to be used as test data for Firestore and real time database onWrite and onUpdate functions. */
export function makeChange<T>(before: T, after: T): Change<T> {
  return Change.fromObjects(before, after);
}

/** Mock values returned by `functions.config()`. */
export function mockConfig(conf: { [key: string]: { [key: string]: any } }) {
  if (config.singleton) {
    delete config.singleton;
  }

  process.env.CLOUD_RUNTIME_CONFIG = JSON.stringify(conf);
}
