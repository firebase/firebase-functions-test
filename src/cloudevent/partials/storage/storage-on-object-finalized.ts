import {DeepPartial, MockCloudEventPartials} from '../../types';
import {StorageObjectData} from 'firebase-functions/lib/v2/providers/storage';
import {CloudEvent, CloudFunction} from 'firebase-functions/lib/v2';
import {FILENAME, getEventFilters, getEventType} from '../helpers';
import {getStorageObjectData} from './storage-data';

export const storageOnObjectFinalized:
  MockCloudEventPartials<StorageObjectData, StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): DeepPartial<CloudEvent<StorageObjectData>> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/${FILENAME}`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
      data: getStorageObjectData(bucket, FILENAME, 1),

      /* TODO(tystark): The following get returned by the server, I don't know what extension to expect*/
      // traceparent: '00-00000000000000000000000000000000-0000000000000000-00',
      // bucket,
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.finalized';
  },
};
