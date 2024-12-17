import { MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, firestore } from 'firebase-functions';
import { getEventType } from '../helpers';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getDocumentSnapshotCloudEventWithAuthContext } from './helpers';

export const firestoreOnDocumentDeletedWithAuthContext: MockCloudEventAbstractFactory<firestore.FirestoreAuthEvent<
  QueryDocumentSnapshot
>> = {
  generateMock: getDocumentSnapshotCloudEventWithAuthContext,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.firestore.document.v1.deleted.withAuthContext'
    );
  },
};
