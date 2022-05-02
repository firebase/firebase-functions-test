import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {getEventType} from '../helpers';

export const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any, any> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): DeepPartial<CloudEvent> {
    const source = '';

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return true; // TODO(tystark) How is an EventArc event differentiated from the other events?
  },
};
