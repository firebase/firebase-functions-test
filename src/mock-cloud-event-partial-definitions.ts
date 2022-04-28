import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {MessagePublishedData} from 'firebase-functions/lib/v2/providers/pubsub';
import {AlertEvent, FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {
  CrashlyticsEvent,
  NewAnrIssuePayload,
  NewFatalIssuePayload,
  NewNonfatalIssuePayload, RegressionAlertPayload, StabilityDigestPayload, VelocityAlertPayload
} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {AppDistributionEvent, NewTesterDevicePayload} from 'firebase-functions/lib/v2/providers/alerts/appDistribution';
import {
  BillingEvent,
  PlanAutomatedUpdatePayload,
  PlanUpdatePayload
} from 'firebase-functions/lib/v2/providers/alerts/billing';
import {StorageObjectData} from 'firebase-functions/lib/v2/providers/storage';

const PROJECT_ID = '__PROJECT_ID__';
const FILENAME = 'file_name';

type MockCloudEventPartialFunction<FunctionType, EventType> =
  (cloudFunction: CloudFunction<FunctionType>) => Partial<CloudEvent<EventType>>;
type MockCloudEventMatchFunction<FunctionType> =
  (cloudFunction: CloudFunction<FunctionType>) => boolean;

interface MockCloudEventPartials<FunctionType, EventType> {
  generatePartial: MockCloudEventPartialFunction<FunctionType, EventType>;
  match: MockCloudEventMatchFunction<FunctionType>;
}

const alertsOnAlertPublished:
  MockCloudEventPartials<FirebaseAlertData, AlertEvent<any>> = {
  generatePartial(cloudFunction: CloudFunction<FirebaseAlertData>): Partial<CloudEvent<AlertEvent<any>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published';
  },
};
const alertsCrashlyticsOnNewAnrIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewAnrIssuePayload>, CrashlyticsEvent<NewAnrIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>):
    Partial<CloudEvent<CrashlyticsEvent<NewAnrIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue';
  },
};
const alertsCrashlyticsOnNewFatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewFatalIssuePayload>, CrashlyticsEvent<NewFatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>):
    Partial<CloudEvent<CrashlyticsEvent<NewFatalIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newFatalIssue';
  },
};
const alertsCrashlyticsOnNewNonfatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewNonfatalIssuePayload>, CrashlyticsEvent<NewNonfatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>):
    Partial<CloudEvent<CrashlyticsEvent<NewNonfatalIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newNonfatalIssue';
  },
};
const alertsCrashlyticsOnRegressionAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<RegressionAlertPayload>, CrashlyticsEvent<RegressionAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>):
    Partial<CloudEvent<CrashlyticsEvent<RegressionAlertPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression';
  },
};
const alertsCrashlyticsOnStabilityDigestPublished:
  MockCloudEventPartials<FirebaseAlertData<StabilityDigestPayload>, CrashlyticsEvent<StabilityDigestPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>):
    Partial<CloudEvent<CrashlyticsEvent<StabilityDigestPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.stabilityDigest';
  },
};
const alertsCrashlyticsOnVelocityAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<VelocityAlertPayload>, CrashlyticsEvent<VelocityAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>):
    Partial<CloudEvent<CrashlyticsEvent<VelocityAlertPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity';
  },
};
const alertsAppDistributionOnNewTesterIosDevicePublished:
  MockCloudEventPartials<FirebaseAlertData<NewTesterDevicePayload>, AppDistributionEvent<NewTesterDevicePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>):
    Partial<CloudEvent<AppDistributionEvent<NewTesterDevicePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'appDistribution.newTesterIosDevice';
  },
};
const alertsBillingOnPlanAutomatedUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanAutomatedUpdatePayload>, BillingEvent<PlanAutomatedUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanAutomatedUpdatePayload>>):
    Partial<CloudEvent<BillingEvent<PlanAutomatedUpdatePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<PlanAutomatedUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planAutomatedUpdate';
  },
};
const alertsBillingOnPlanUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanUpdatePayload>, BillingEvent<PlanUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanUpdatePayload>>):
    Partial<CloudEvent<BillingEvent<PlanUpdatePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<PlanUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planUpdate';
  },
};
const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any, any> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = '';

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return true; // TODO(tystark) How is an EventArc event differentiated from the other events?
  },
};
const storageOnObjectArchived:
  MockCloudEventPartials<StorageObjectData, StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): Partial<CloudEvent<StorageObjectData>> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/${FILENAME}`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
      data: getStorageObjectData(bucket, FILENAME, 1),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.archived';
  },
};
const storageOnObjectDeleted:
  MockCloudEventPartials<StorageObjectData, StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): Partial<CloudEvent<StorageObjectData>> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/${FILENAME}`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
      data: getStorageObjectData(bucket, FILENAME, 1),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.deleted';
  },
};
const storageOnObjectFinalized:
  MockCloudEventPartials<StorageObjectData, StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): Partial<CloudEvent<StorageObjectData>> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/${FILENAME}`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
      data: getStorageObjectData(bucket, FILENAME, 1),

      /* TODO(tystark): The following get returned by the server, I don't know what extension to expect*/
      // traceparent: '00-00000000000000000000000000000000-0000000000000000-00',
      // bucket,
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.finalized';
  },
};
const storageOnObjectMetadataUpdated:
  MockCloudEventPartials<StorageObjectData, StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): Partial<CloudEvent<StorageObjectData>> {
    const bucket = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucket}`;
    const subject = `objects/__STORAGE_FILENAME__`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
      data: getStorageObjectData(bucket, FILENAME, 1),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.metadataUpdated';
  },
};
const pubsubOnMessagePublished:
  MockCloudEventPartials<MessagePublishedData, MessagePublishedData> = {
  generatePartial(cloudFunction: CloudFunction<MessagePublishedData>): Partial<CloudEvent<MessagePublishedData>> {
    const topicId = getEventFilters(cloudFunction)?.topic || '';
    const source = `//pubsub.googleapis.com/projects/${PROJECT_ID}/topics/${topicId}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.pubsub.topic.v1.messagePublished';
  },
};

/**
 * @internal
 * Note: Ordering matters. Some MockEventPartials will match more generally
 * (eg {@link alertsOnAlertPublished}). In addition,
 * {@link eventarcOnCustomEventPublished} acts as a catch-all.
 */
export const LIST_OF_MOCK_CLOUD_EVENT_PARTIALS:
  Array<MockCloudEventPartials<any, any>> = [
  alertsCrashlyticsOnNewAnrIssuePublished,
  alertsCrashlyticsOnNewFatalIssuePublished,
  alertsCrashlyticsOnNewNonfatalIssuePublished,
  alertsCrashlyticsOnRegressionAlertPublished,
  alertsCrashlyticsOnStabilityDigestPublished,
  alertsCrashlyticsOnVelocityAlertPublished,
  alertsAppDistributionOnNewTesterIosDevicePublished,
  alertsBillingOnPlanAutomatedUpdatePublished,
  alertsBillingOnPlanUpdatePublished,
  alertsOnAlertPublished, // Note: alert.onAlertPublished matching is more generic
  storageOnObjectArchived,
  storageOnObjectDeleted,
  storageOnObjectFinalized,
  storageOnObjectMetadataUpdated,
  pubsubOnMessagePublished,
  eventarcOnCustomEventPublished,
];

function getEventType<T>(cloudFunction: CloudFunction<T>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

function getEventFilters<T>(cloudFunction: CloudFunction<T>): Record<string, string> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}

function getStorageObjectData(bucket: string, filename: string, generation: number): StorageObjectData {
  const now = '2022-04-28T18:35:18.238Z';
  return {
    metageneration: 1,
    metadata: {
      firebaseStorageDownloadTokens: '00000000-0000-0000-0000-000000000000'
    },
    kind: 'storage#object',
    mediaLink: `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/${FILENAME}?generation=${generation}&alt=media`,
    etag: 'xxxxxxxxx/yyyyy=',
    timeStorageClassUpdated: now,
    generation,
    md5Hash: 'E9LIfVl7pcVu3/moXc743w==',
    crc32c: 'qqqqqq==',
    selfLink: `https://www.googleapis.com/storage/v1/b/${bucket}/o/${FILENAME}`,
    name: FILENAME,
    storageClass: 'REGIONAL',
    size: 42,
    updated: now,
    contentDisposition: `inline; filename*=utf-8''${FILENAME}`,
    contentType: 'image/gif',
    timeCreated: now,
    id: `${bucket}/${FILENAME}/${generation}`,
    bucket
  };
}
