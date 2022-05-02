import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';

export type DeepPartial<T extends object> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key]
};
type MockCloudEventPartialFunction<FunctionType, EventType> =
  (cloudFunction: CloudFunction<FunctionType>) => DeepPartial<CloudEvent<EventType>>;
type MockCloudEventMatchFunction<FunctionType> =
  (cloudFunction: CloudFunction<FunctionType>) => boolean;

export interface MockCloudEventPartials<FunctionType, EventType> {
  generatePartial: MockCloudEventPartialFunction<FunctionType, EventType>;
  match: MockCloudEventMatchFunction<FunctionType>;
}
