import { MockCloudEventAbstractFactory } from '../../types';
import {
  Change,
  CloudEvent,
  CloudFunction,
  firestore,
} from 'firebase-functions';
import { getEventType } from '../helpers';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { getDocumentSnapshotChangeCloudEventWithAuthContext } from './helpers';

export const firestoreOnDocumentWrittenWithAuthContext: MockCloudEventAbstractFactory<firestore.FirestoreAuthEvent<
  Change<DocumentSnapshot>
>> = {
  generateMock: getDocumentSnapshotChangeCloudEventWithAuthContext,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) ===
      'google.cloud.firestore.document.v1.written.withAuthContext'
    );
  },
};
