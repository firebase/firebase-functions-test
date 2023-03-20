import { DeepPartial, MockCloudEventAbstractFactory } from "../../types";
import { CloudEvent, CloudFunction, firestore } from "firebase-functions/v2";
import { extractRef, getBaseCloudEvent, getEventType, resolveStringExpression } from "../helpers";
import { makeDocumentSnapshot } from "../../../providers/firestore";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { inspect } from 'util';
import { getQueryDocumentSnapshotCloudEvent } from "./helpers";

export const firestoreOnDocumentDeleted: MockCloudEventAbstractFactory<firestore.FirestoreEvent<QueryDocumentSnapshot>> = {
  generateMock: getQueryDocumentSnapshotCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.cloud.firestore.document.v1.deleted'
    );
  }
}
