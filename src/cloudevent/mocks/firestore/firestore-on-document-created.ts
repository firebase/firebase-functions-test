import { MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, firestore } from 'firebase-functions';
import { getEventType } from '../helpers';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getDocumentSnapshotCloudEvent } from './helpers';

export const firestoreOnDocumentCreated: MockCloudEventAbstractFactory<firestore.FirestoreEvent<
  QueryDocumentSnapshot
>> = {
  generateMock: getDocumentSnapshotCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.firestore.document.v1.created'
    );
  },
};
