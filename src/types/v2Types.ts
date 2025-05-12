import { CallableRequest } from 'firebase-functions/v2/https';
import { DeepPartial } from '../cloudevent/types';
import { CloudEvent } from 'firebase-functions/v2';

/** A function that can be called with test data and optional override values for {@link CloudEvent}
 * It will subsequently invoke the cloud function it wraps with the provided {@link CloudEvent}
 */
export type WrappedV2Function<T extends CloudEvent<unknown>> = (
  cloudEventPartial?: DeepPartial<T | object>
) => any | Promise<any>;

export type WrappedV2CallableFunction<T> = (
  data: CallableRequest
) => T | Promise<T>;
