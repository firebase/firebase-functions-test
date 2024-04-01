import { MockCloudEventAbstractFactory } from '../../types';
import {
  Change,
  CloudEvent,
  CloudFunction,
  firestore,
} from 'firebase-functions/v2';
import { getEventType } from '../helpers';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getDocumentSnapshotChangeCloudEventWithAuthContext } from './helpers';

export const firestoreOnDocumentUpdatedWithAuthContext: MockCloudEventAbstractFactory<firestore.FirestoreEvent<
  Change<QueryDocumentSnapshot>
>> = {
  generateMock: getDocumentSnapshotChangeCloudEventWithAuthContext,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.firestore.document.v1.updated.withAuthContext'
    );
  },
};
