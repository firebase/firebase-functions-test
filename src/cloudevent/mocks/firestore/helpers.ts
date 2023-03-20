import { DocumentSnapshot } from "firebase-admin/firestore";
import { Change, CloudFunction, firestore } from "firebase-functions/v2";
import { exampleDataSnapshot, exampleDataSnapshotChange } from "../../../providers/database";
import { makeDocumentSnapshot } from "../../../providers/firestore";
import { DeepPartial } from "../../types";
import { extractRef, getBaseCloudEvent, resolveStringExpression } from "../helpers";

type ChangeLike = {
  before: DocumentSnapshot | object;
  after: DocumentSnapshot | object;
}

export function getDocumentSnapshotCloudEvent(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<DocumentSnapshot>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<DocumentSnapshot | object>>
) {
  const {
    location,
    project,
    database,
    namespace,
    document,
    params
  } = getFirestoreEventFields(cloudFunction, cloudEventPartial);
  const data = getOrCreateDocumentSnapshot(cloudEventPartial?.data, document);
  return {
    ...getBaseCloudEvent(cloudFunction),

    location,
    project,
    database,
    namespace,
    document,
    params,

    data
  }
}

export function getDocumentSnapshotChangeCloudEvent(
  cloudFunction: CloudFunction<firestore.FirestoreEvent<Change<DocumentSnapshot>>>,
  cloudEventPartial?: DeepPartial<firestore.FirestoreEvent<Change<DocumentSnapshot> | ChangeLike>>,
) {
  const {
    location,
    project,
    database,
    namespace,
    document,
    params
  } = getFirestoreEventFields(cloudFunction, cloudEventPartial);
  const data = getOrCreateDocumentSnapshotChange(cloudEventPartial?.data, document);
  return {
    ...getBaseCloudEvent(cloudFunction),

    location,
    project,
    database,
    namespace,
    document,
    params,

    data
  }
}

function getFirestoreEventFields(
  cloudFunction: CloudFunction<
    firestore.FirestoreEvent<
      DocumentSnapshot | Change<DocumentSnapshot>
    >
  >,
  cloudEventPartial?: DeepPartial<
    firestore.FirestoreEvent<
      DocumentSnapshot | Change<DocumentSnapshot>
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

function getOrCreateDocumentSnapshot(
  data: DocumentSnapshot | object,
  ref: string,
) {
  if (data instanceof DocumentSnapshot) {
    return data;
  }
  if (data instanceof Object) {
    return makeDocumentSnapshot(data, ref);
  }
  return exampleDataSnapshot();
}

function getOrCreateDocumentSnapshotChange(
  data: DeepPartial<Change<DocumentSnapshot> | ChangeLike>,
  ref: string,
) {
  if (data instanceof Change) {
    return data;
  }
  if (data instanceof Object && data.before && data.after) {
    const beforeSnapshot = getOrCreateDocumentSnapshot(data.before, ref);
    const afterSnapshot = getOrCreateDocumentSnapshot(data.after, ref);
    return new Change(beforeSnapshot, afterSnapshot);
  }

  return exampleDataSnapshotChange();
}