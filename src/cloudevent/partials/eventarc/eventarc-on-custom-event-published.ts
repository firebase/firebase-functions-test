import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudEvent, CloudFunction} from 'firebase-functions/v2';
import {getEventType} from '../helpers';

export const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): DeepPartial<CloudEvent> {
    const source = 'eventarc_source';
    const subject = 'eventarc_subject';

    return {
      data: {},
      source,
      subject,
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return true;
  },
};
