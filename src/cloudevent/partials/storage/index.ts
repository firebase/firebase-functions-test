import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction, CloudEvent } from 'firebase-functions/v2';
import { StorageEvent } from 'firebase-functions/v2/storage';
import { FILENAME, getEventFilters, getEventType } from '../helpers';
import { getStorageObjectData } from './storage-data';

export const storageV1: MockCloudEventPartials<StorageEvent> = {
  generatePartial(
    cloudFunction: CloudFunction<StorageEvent>
  ): DeepPartial<StorageEvent> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/${FILENAME}`;

    return {
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
