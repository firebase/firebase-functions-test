import { CloudEvent, CloudFunction } from 'firebase-functions';

export type DeepPartial<T extends object> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key];
};
type MockCloudEventFunction<EventType extends CloudEvent<unknown>> = (
  cloudFunction: CloudFunction<EventType>,
  cloudEventPartial?: DeepPartial<EventType>
) => EventType;
type MockCloudEventMatchFunction<EventType extends CloudEvent<unknown>> = (
  cloudFunction: CloudFunction<EventType>
) => boolean;

export interface MockCloudEventAbstractFactory<
  EventType extends CloudEvent<unknown>
> {
  generateMock: MockCloudEventFunction<EventType>;
  match: MockCloudEventMatchFunction<EventType>;
}
