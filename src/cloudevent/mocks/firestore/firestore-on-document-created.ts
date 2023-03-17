import { DeepPartial, MockCloudEventAbstractFactory } from "../../types";
import { CloudEvent, CloudFunction, firestore } from "firebase-functions/v2";
import { extractRef, getBaseCloudEvent, getEventType, resolveStringExpression } from "../helpers";
import { makeDocumentSnapshot } from "../../../providers/firestore";
import { testApp } from "../../../app";

export const firestoreOnDocumentCreated: MockCloudEventAbstractFactory<firestore.FirestoreEvent<firestore.QueryDocumentSnapshot>> = {
  generateMock: getQueryDocumentSnapshotCloudEvent,
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.cloud.firestore.document.v1.created'
    );
  }
}

export function getQueryDocumentSnapshotCloudEvent(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<firestore.QueryDocumentSnapshot>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<firestore.QueryDocumentSnapshot | object>>
) {

  console.log("*****************:\n\n\n\n\n\n\n\n\n");

  // location
  const location = cloudEventPartial?.location || 'us-central1';
  // project
  const project = 
    cloudEventPartial?.project || 
    process.env.GCLOUD_PROJECT ||
    'testproject';
  // database
  const databaseOrExpression = 
    cloudEventPartial?.database || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.database ||
    '(default)';
  const database = resolveStringExpression(databaseOrExpression);
  // namespace
  const namespaceOrExpression = 
    cloudEventPartial?.namespace || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.namespace ||
    '(default)';
  const namespace = resolveStringExpression(namespaceOrExpression);
  // document (path)
  const documentOrExpression = 
    cloudEventPartial?.document || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.document ||
    cloudFunction?.__endpoint?.eventTrigger?.eventFilterPathPatterns?.document || 
    '/foo/bar';  
  const document = resolveStringExpression(documentOrExpression);
  // params
  const params = cloudEventPartial?.params || {};

  // MAKE DOCUMENT SNAPSHOT
  const ref = extractRef(document, params);
  const data = makeDocumentSnapshot(cloudEventPartial?.data, ref);

  return {
    ...getBaseCloudEvent(cloudFunction),

    location,
    project,
    database,
    namespace,
    document,

    data

    // QueryDocumentSnapshot:
    // createTime
    // updateTime
    
    // DocumentSnapshot:
    // exists
    // ref
    // id
  }
}

function getFirestoreEventFields(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<firestore.QueryDocumentSnapshot>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<firestore.QueryDocumentSnapshot | object>>
) {

}

// export function getOrCreateDocumentSnapshot()