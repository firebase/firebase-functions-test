import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Change, CloudFunction, firestore } from "firebase-functions/v2";
import { exampleDataSnapshot, exampleDataSnapshotChange } from "../../../providers/database";
import { makeDocumentSnapshot } from "../../../providers/firestore";
import { DeepPartial } from "../../types";
import { extractRef, getBaseCloudEvent, resolveStringExpression } from "../helpers";

export function getQueryDocumentSnapshotCloudEvent(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<QueryDocumentSnapshot>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<QueryDocumentSnapshot | object>>
) {
  // console.log(`\n\n\n\nafter: ${inspect(document)}\n\n\n\n`);
  const {
    location,
    project,
    database,
    namespace,
    document,
    params
  } = getFirestoreEventFields(cloudFunction, cloudEventPartial);
  const data = getOrCreateQueryDocumentSnapshot(cloudEventPartial?.data, document);
  return {
    ...getBaseCloudEvent(cloudFunction),

    location,
    project,
    database,
    namespace,
    document,
    params,

    data

    // QueryDocumentSnapshot:
    // createTime
    // updateTime
  }
}

type ChangeLike = {
  before: QueryDocumentSnapshot | object;
  after: QueryDocumentSnapshot | object;
}

// export function getDocumentSnapshotChangeCloudEvent(
//   cloudFunction: CloudFunction<firestore.FirestoreEvent<Change<DocumentSnapshot>>>,
//   cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<Change<DocumentSnapshot> | ChangeLike>>,
// ) {
  

// }

export function getQueryDocumentSnapshotChangeCloudEvent(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<Change<QueryDocumentSnapshot>>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<Change<QueryDocumentSnapshot> | ChangeLike>>,
) {
  const {
    location,
    project,
    database,
    namespace,
    document,
    params
  } = getFirestoreEventFields(cloudFunction, cloudEventPartial);
  const data = getOrCreateQueryDocumentSnapshotChange(cloudEventPartial?.data, document);
  return {
    ...getBaseCloudEvent(cloudFunction),

    location,
    project,
    database,
    namespace,
    document,
    params,

    data

    // QueryDocumentSnapshot:
    // createTime
    // updateTime
  }
}

function getFirestoreEventFields(
  cloudFunction: CloudFunction<
    firestore.FirestoreEvent<
      QueryDocumentSnapshot | Change<QueryDocumentSnapshot>
    >
  >,
  cloudEventPartial?: DeepPartial<
    firestore.FirestoreEvent<
      QueryDocumentSnapshot | Change<QueryDocumentSnapshot>
    >
  >,
) {
  const location = cloudEventPartial?.location || 'us-central1';

  const project = 
    cloudEventPartial?.project || 
    process.env.GCLOUD_PROJECT ||
    'testproject';

  const databaseOrExpression = 
    cloudEventPartial?.database || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.database ||
    '(default)';
  const database = resolveStringExpression(databaseOrExpression);

  const namespaceOrExpression = 
    cloudEventPartial?.namespace || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.namespace ||
    '(default)';
  const namespace = resolveStringExpression(namespaceOrExpression);

  const params = cloudEventPartial?.params || {};

  const documentOrExpression = 
    cloudEventPartial?.document || 
    cloudFunction?.__endpoint?.eventTrigger?.eventFilters?.document ||
    cloudFunction?.__endpoint?.eventTrigger?.eventFilterPathPatterns?.document || 
    '/foo/bar';  
  const documentRaw = resolveStringExpression(documentOrExpression);
  const document = extractRef(documentRaw, params);

  return {
    location,
    project,
    database,
    namespace,
    document,
    params
  };
}

function getOrCreateQueryDocumentSnapshot(
  data: QueryDocumentSnapshot | object,
  ref: string,
) {
  if (data instanceof QueryDocumentSnapshot) {
    return data;
  }
  if (data instanceof Object) {
    return makeDocumentSnapshot(data, ref);
  }
  return exampleDataSnapshot();
}

function getOrCreateQueryDocumentSnapshotChange(
  data: DeepPartial<Change<QueryDocumentSnapshot> | ChangeLike>,
  ref: string,
) {
  if (data instanceof Change) {
    return data;
  }
  if (data instanceof Object && data.before && data.after) {
    const beforeSnapshot = getOrCreateQueryDocumentSnapshot(data.before, ref);
    const afterSnapshot = getOrCreateQueryDocumentSnapshot(data.after, ref);
    return new Change(beforeSnapshot, afterSnapshot);
  }

  return exampleDataSnapshotChange();
}