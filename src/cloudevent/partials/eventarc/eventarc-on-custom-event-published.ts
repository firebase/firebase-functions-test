import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudEvent, CloudFunction} from 'firebase-functions/v2';

export const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any> = {
  generatePartial(_: CloudFunction<unknown>): DeepPartial<CloudEvent> {
    const source = 'eventarc_source';
    const subject = 'eventarc_subject';

    return {
      data: {},
      source,
      subject,
    };
  },
  match(_: CloudFunction<unknown>): boolean {
    return true;
  },
};
