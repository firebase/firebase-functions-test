import {DeepPartial, MockCloudEventPartials} from '../../types';
import {MessagePublishedData} from 'firebase-functions/lib/v2/providers/pubsub';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const pubsubOnMessagePublished:
  MockCloudEventPartials<MessagePublishedData, MessagePublishedData> = {
  generatePartial(cloudFunction: CloudFunction<MessagePublishedData>): DeepPartial<CloudEvent<MessagePublishedData>> {
    const topicId = getEventFilters(cloudFunction)?.topic || '';
    const source = `//pubsub.googleapis.com/projects/${PROJECT_ID}/topics/${topicId}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: {
        message: {
          json: '{"hello": world}'
        },
        subscription: 'Subscription',
      },
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.pubsub.topic.v1.messagePublished';
  },
};
