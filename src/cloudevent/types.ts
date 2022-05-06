import { CloudEvent, CloudFunction } from 'firebase-functions/v2';

export type DeepPartial<T extends object> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key];
};
type MockCloudEventPartialFunction<EventType extends CloudEvent<unknown>> = (
  cloudFunction: CloudFunction<EventType>
) => DeepPartial<EventType>;
type MockCloudEventMatchFunction<EventType extends CloudEvent<unknown>> = (
  cloudFunction: CloudFunction<EventType>
) => boolean;

export interface MockCloudEventPartials<EventType extends CloudEvent<unknown>> {
  generatePartial: MockCloudEventPartialFunction<EventType>;
  match: MockCloudEventMatchFunction<EventType>;
}
