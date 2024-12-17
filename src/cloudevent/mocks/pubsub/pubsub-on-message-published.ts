import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, pubsub } from 'firebase-functions';
import {
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
  PROJECT_ID,
} from '../helpers';

export const pubsubOnMessagePublished: MockCloudEventAbstractFactory<CloudEvent<
  pubsub.MessagePublishedData
>> = {
  generateMock(
    cloudFunction: CloudFunction<CloudEvent<pubsub.MessagePublishedData>>,
    cloudEventPartial?: DeepPartial<CloudEvent<pubsub.MessagePublishedData>>
  ): CloudEvent<pubsub.MessagePublishedData> {
    const topicId = getEventFilters(cloudFunction)?.topic || '';
    const source = `//pubsub.googleapis.com/projects/${PROJECT_ID}/topics/${topicId}`;
    const subscription = `projects/${PROJECT_ID}/subscriptions/pubsubexample-1`;

    // Used if no data.message.json is provided by the partial;
    const dataMessageJsonDefault = { hello: 'world' };
    const dataMessageAttributesDefault = {
      'sample-attribute': 'I am an attribute',
    };

    const dataMessageJson =
      cloudEventPartial?.data?.message?.json || dataMessageJsonDefault;

    // We should respect if the user provides their own message.data.
    const dataMessageData =
      cloudEventPartial?.data?.message?.data ||
      Buffer.from(JSON.stringify(dataMessageJson)).toString('base64');

    // TODO - consider warning the user if their data does not match the json they provide

    const messageData = {
      data: dataMessageData,
      messageId: cloudEventPartial?.data?.message?.messageId || 'message_id',
      attributes:
        cloudEventPartial?.data?.message?.attributes ||
        dataMessageAttributesDefault,
    };
    const message = new pubsub.Message(messageData);

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: {
        /**
         * Note: Its very important we return the JSON representation of the message here. Without it,
         * ts-merge blows away `data.message`.
         */
        message: message.toJSON(),
        subscription,
      },
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.pubsub.topic.v1.messagePublished'
    );
  },
};
