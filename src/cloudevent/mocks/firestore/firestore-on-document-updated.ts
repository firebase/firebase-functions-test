import { DeepPartial, MockCloudEventAbstractFactory } from "../../types";
import { Change, CloudEvent, CloudFunction, firestore } from "firebase-functions/v2";
import { extractRef, getBaseCloudEvent, getEventType, resolveStringExpression } from "../helpers";
import { makeDocumentSnapshot } from "../../../providers/firestore";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { inspect } from 'util';
import { getQueryDocumentSnapshotChangeCloudEvent } from "./helpers";

export const firestoreOnDocumentUpdated: MockCloudEventAbstractFactory<firestore.FirestoreEvent<Change<QueryDocumentSnapshot>>> = {
  generateMock: getQueryDocumentSnapshotChangeCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.cloud.firestore.document.v1.updated'
    );
  }
}

