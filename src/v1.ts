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
  database,
  firestore,
  HttpsFunction,
  Runnable,
  // @ts-ignore
  resetCache,
} from 'firebase-functions/v1';
import { Expression } from 'firebase-functions/params';

import {
  getEventFilters,
  getEventType,
  resolveStringExpression,
} from './cloudevent/mocks/helpers';
import {
  ContextOptions,
  CallableContextOptions,
  EventContextOptions,
  WrappedFunction,
  WrappedScheduledFunction,
} from './types/v1Types';

export { EventContextOptions, ContextOptions, CallableContextOptions, WrappedFunction, WrappedScheduledFunction };

/** Takes a cloud function to be tested, and returns a WrappedFunction which can be called in test code. */
export function wrapV1<T>(
  cloudFunction: HttpsFunction & Runnable<T>
): WrappedFunction<T, HttpsFunction & Runnable<T>>;
export function wrapV1<T>(
  cloudFunction: CloudFunction<T>
): WrappedScheduledFunction | WrappedFunction<T, CloudFunction<T>> {
  if (!has(cloudFunction, '__endpoint')) {
    throw new Error(
      'Wrap can only be called on functions written with the firebase-functions SDK.'
    );
  }

  if (has(cloudFunction, '__endpoint.scheduleTrigger')) {
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

  if (has(cloudFunction, '__endpoint.httpsTrigger')) {
    throw new Error(
      'Wrap function is only available for `onCall` HTTP functions, not `onRequest`.'
    );
  }

  if (!has(cloudFunction, 'run')) {
    throw new Error(
      'This library can only be used with functions written with firebase-functions v1.0.0 and above'
    );
  }

  const isCallableFunction = has(cloudFunction, '__endpoint.callableTrigger');

  let wrapped: WrappedFunction<T, typeof cloudFunction> = (data, options) => {
    // Although in Typescript we require `options` some of our JS samples do not pass it.
    const _options = { ...options };
    let context;

    if (isCallableFunction) {
      _checkOptionValidity(
        ['app', 'auth', 'instanceIdToken', 'rawRequest'],
        _options
      );
      let callableContextOptions = _options as CallableContextOptions;
      context = {
        ...callableContextOptions,
      };
    } else {
      _checkOptionValidity(
        ['eventId', 'timestamp', 'params', 'auth', 'authType', 'resource'],
        _options
      );
      const defaultContext = _makeDefaultContext(cloudFunction, _options, data);

      if (
        has(defaultContext, 'eventType') &&
        defaultContext.eventType !== undefined &&
        defaultContext.eventType.match(/firebase.database/)
      ) {
        defaultContext.authType = 'UNAUTHENTICATED';
        defaultContext.auth = null;
      }
      context = merge({}, defaultContext, _options);
    }

    return cloudFunction.run(data, context);
  };

  return wrapped;
}

/** @internal */
export function _makeResourceName(
  triggerResource: string | Expression<string>,
  params = {}
): string {
  const resource = resolveStringExpression(triggerResource);
  const wildcardRegex = new RegExp('{[^/{}]*}', 'g');
  let resourceName = resource.replace(wildcardRegex, (wildcard) => {
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
  cloudFunction: HttpsFunction & Runnable<T>,
  options: CallableContextOptions,
  triggerData?: T
);
function _makeDefaultContext<T>(
  cloudFunction: CloudFunction<T>,
  options: EventContextOptions,
  triggerData?: T
): EventContext {
  let eventContextOptions = options as EventContextOptions;
  const eventType = getEventType(cloudFunction);
  const eventResource = getEventFilters(cloudFunction).resource;

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
      service: serviceFromEventType(eventType),
      name: _makeResourceName(eventResource, params),
    },
    eventType,
    timestamp: new Date().toISOString(),
    params,
  };
  return defaultContext;
}

function _extractDatabaseParams(
  triggerResource: string | Expression<string>,
  data: database.DataSnapshot
): EventContext['params'] {
  const resource = resolveStringExpression(triggerResource);
  const path = data.ref.toString().replace(data.ref.root.toString(), '');
  return _extractParams(resource, path);
}

function _extractFirestoreDocumentParams(
  triggerResource: string | Expression<string>,
  data: firestore.DocumentSnapshot
): EventContext['params'] {
  const resource = resolveStringExpression(triggerResource);
  // Resource format: databases/(default)/documents/<path>
  return _extractParams(
    resource.replace(/^databases\/[^\/]+\/documents\//, ''),
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

function serviceFromEventType(eventType?: string): string {
  if (eventType) {
    const providerToService: Array<[string, string]> = [
      ['google.analytics', 'app-measurement.com'],
      ['google.firebase.auth', 'firebaseauth.googleapis.com'],
      ['google.firebase.database', 'firebaseio.com'],
      ['google.firestore', 'firestore.googleapis.com'],
      ['google.pubsub', 'pubsub.googleapis.com'],
      ['google.firebase.remoteconfig', 'firebaseremoteconfig.googleapis.com'],
      ['google.storage', 'storage.googleapis.com'],
      ['google.testing', 'testing.googleapis.com'],
    ];

    const match = providerToService.find(([provider]) => {
      eventType.includes(provider);
    });
    if (match) {
      return match[1];
    }
  }
  return 'unknown-service.googleapis.com';
}

/** Make a Change object to be used as test data for Firestore and real time database onWrite and onUpdate functions. */
export function makeChange<T>(before: T, after: T): Change<T> {
  return Change.fromObjects(before, after);
}

/** Mock values returned by `functions.config()`. */
export function mockConfig(conf: { [key: string]: { [key: string]: any } }) {
  if (resetCache) {
    resetCache();
  }
  process.env.CLOUD_RUNTIME_CONFIG = JSON.stringify(conf);
}
