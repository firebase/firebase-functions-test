import {CloudEvent, CloudFunction} from 'firebase-functions/v2';

export type DeepPartial<T extends object> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key]
};
type MockCloudEventPartialFunction<EventType> =
  (cloudFunction: CloudFunction<EventType>) => DeepPartial<CloudEvent<EventType>>;
type MockCloudEventMatchFunction<EventType> =
  (cloudFunction: CloudFunction<EventType>) => boolean;

export interface MockCloudEventPartials<EventType> {
  generatePartial: MockCloudEventPartialFunction<EventType>;
  match: MockCloudEventMatchFunction<EventType>;
}
