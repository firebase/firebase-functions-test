import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {getEventType} from '../helpers';

export const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any, any> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): DeepPartial<CloudEvent> {
    const source = 'eventarc_source';
    const subject = 'eventarc_subject';
    const type = 'eventarc_type';

    return {
      data: {},
      source,
      subject,
      type,
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return true;
  },
};
