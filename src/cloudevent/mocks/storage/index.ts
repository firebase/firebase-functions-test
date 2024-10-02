import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction, CloudEvent } from 'firebase-functions';
import { StorageEvent } from 'firebase-functions/storage';
import {
  FILENAME,
  resolveStringExpression,
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
} from '../helpers';
import { getStorageObjectData } from './storage-data';

export const storageV1: MockCloudEventAbstractFactory<StorageEvent> = {
  generateMock(
    cloudFunction: CloudFunction<StorageEvent>,
    cloudEventPartial?: DeepPartial<StorageEvent>
  ): StorageEvent {
    const bucketOrExpression =
      cloudEventPartial?.bucket ||
      getEventFilters(cloudFunction)?.bucket ||
      'bucket_name';
    const bucket = resolveStringExpression(bucketOrExpression);
    const source =
      cloudEventPartial?.source ||
      `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = cloudEventPartial?.subject || `objects/${FILENAME}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      bucket,
      source,
      subject,
      data: getStorageObjectData(bucket, FILENAME, 1),
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return getEventType(cloudFunction).startsWith(
      'google.cloud.storage.object.v1'
    );
  },
};
