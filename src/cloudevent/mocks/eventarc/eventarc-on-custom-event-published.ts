import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction } from 'firebase-functions';
import { getBaseCloudEvent } from '../helpers';

export const eventarcOnCustomEventPublished: MockCloudEventAbstractFactory<any> = {
  generateMock(
    cloudFunction: CloudFunction<CloudEvent<any>>,
    cloudEventPartial?: DeepPartial<CloudEvent<any>>
  ): CloudEvent<any> {
    const source = 'eventarc_source';
    const subject = 'eventarc_subject';

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      data: cloudEventPartial?.data || {},
      source,
      subject,
    };
  },
  match(_: CloudFunction<CloudEvent<unknown>>): boolean {
    return true;
  },
};
