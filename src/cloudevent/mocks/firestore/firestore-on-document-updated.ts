import { MockCloudEventAbstractFactory } from '../../types';
import {
  Change,
  CloudEvent,
  CloudFunction,
  firestore,
} from 'firebase-functions';
import { getEventType } from '../helpers';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getDocumentSnapshotChangeCloudEvent } from './helpers';

export const firestoreOnDocumentUpdated: MockCloudEventAbstractFactory<firestore.FirestoreEvent<
  Change<QueryDocumentSnapshot>
>> = {
  generateMock: getDocumentSnapshotChangeCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.firestore.document.v1.updated'
    );
  },
};
