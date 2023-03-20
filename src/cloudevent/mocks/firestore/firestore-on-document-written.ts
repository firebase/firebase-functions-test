import { MockCloudEventAbstractFactory } from "../../types";
import { Change, CloudEvent, CloudFunction, firestore } from "firebase-functions/v2";
import { getEventType } from "../helpers";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { getQueryDocumentSnapshotChangeCloudEvent } from "./helpers";

export const firestoreOnDocumentWritten: MockCloudEventAbstractFactory<firestore.FirestoreEvent<Change<DocumentSnapshot>>> = {
  generateMock: getQueryDocumentSnapshotChangeCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.cloud.firestore.document.v1.written'
    );
  }
}

