import {CloudEvent} from 'firebase-functions/v2';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {MessagePublishedData} from 'firebase-functions/lib/v2/providers/pubsub';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {
  NewAnrIssuePayload,
  NewFatalIssuePayload,
  NewNonfatalIssuePayload, RegressionAlertPayload, StabilityDigestPayload, VelocityAlertPayload
} from 'firebase-functions/lib/v2/providers/alerts/crashlytics';
import {NewTesterDevicePayload} from 'firebase-functions/lib/v2/providers/alerts/appDistribution';
import {PlanAutomatedUpdatePayload, PlanUpdatePayload} from 'firebase-functions/lib/v2/providers/alerts/billing';
import {StorageObjectData} from 'firebase-functions/lib/v2/providers/storage';

const PROJECT_ID = '__PROJECT_ID__';

type MockCloudEventPartialFunction<T> = (cloudFunction: CloudFunction<T>) => Partial<CloudEvent>;
type MockCloudEventMatchFunction<T> = (cloudFunction: CloudFunction<T>) => boolean;

interface MockCloudEventPartials<T> {
  generatePartial: MockCloudEventPartialFunction<T>;
  match: MockCloudEventMatchFunction<T>;
}

const alertsOnAlertPublished:
  MockCloudEventPartials<FirebaseAlertData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published';
  },
};
const alertsCrashlyticsOnNewAnrIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewAnrIssuePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue';
  },
};
const alertsCrashlyticsOnNewFatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewFatalIssuePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newFatalIssue';
  },
};
const alertsCrashlyticsOnNewNonfatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewNonfatalIssuePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newNonfatalIssue';
  },
};
const alertsCrashlyticsOnRegressionAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<RegressionAlertPayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression';
  },
};
const alertsCrashlyticsOnStabilityDigestPublished:
  MockCloudEventPartials<FirebaseAlertData<StabilityDigestPayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.stabilityDigest';
  },
};
const alertsCrashlyticsOnVelocityAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<VelocityAlertPayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity';
  },
};
const alertsAppDistributionOnNewTesterIosDevicePublished:
  MockCloudEventPartials<FirebaseAlertData<NewTesterDevicePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'appDistribution.newTesterIosDevice';
  },
};
const alertsBillingOnPlanAutomatedUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanAutomatedUpdatePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planAutomatedUpdate';
  },
};
const alertsBillingOnPlanUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanUpdatePayload>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planUpdate';
  },
};
const eventarcOnCustomEventPublished:
  MockCloudEventPartials<CloudEvent<any>> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const source = '';

    return {
      source,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return false; // TODO(tystark) How is an EventArc event differentiated from the other events?
  },
};
const storageOnObjectArchived:
  MockCloudEventPartials<StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const bucketId = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucketId}`;
    const subject = `objects/__STORAGE_FILENAME__`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.archived';
  },
};
const storageOnObjectDeleted:
  MockCloudEventPartials<StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const bucketId = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucketId}`;
    const subject = `objects/__STORAGE_FILENAME__`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.deleted';
  },
};
const storageOnObjectFinalized:
  MockCloudEventPartials<StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const bucketId = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucketId}`;
    const subject = `objects/__STORAGE_FILENAME__`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.finalized';
  },
};
const storageOnObjectMetadataUpdated:
  MockCloudEventPartials<StorageObjectData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
    const bucketId = getEventFilters(cloudFunction)?.bucket || 'bucket_name';
    const source = `//storage.googleapis.com/projects/_/buckets/${bucketId}`;
    const subject = `objects/__STORAGE_FILENAME__`;

    return {
      source,
      subject,
      type: getEventType(cloudFunction),
    };
  },
  match(cloudFunction: CloudFunction<unknown>): boolean {
    return getEventType(cloudFunction) === 'google.cloud.storage.object.v1.metadataUpdated';
  },
};
const pubsubOnMessagePublished:
  MockCloudEventPartials<MessagePublishedData> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): Partial<CloudEvent> {
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
 * Note: Ordering matters. Some MockEventPartials will match more generally
 * (eg {@link alertsOnAlertPublished})
 */
export const LIST_OF_MOCK_CLOUD_EVENT_PARTIALS:
  Array<MockCloudEventPartials<any>> = [
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
  eventarcOnCustomEventPublished,
  storageOnObjectArchived,
  storageOnObjectDeleted,
  storageOnObjectFinalized,
  storageOnObjectMetadataUpdated,
  pubsubOnMessagePublished,
];

function getEventType<T>(cloudFunction: CloudFunction<T>): string {
  return cloudFunction?.__endpoint?.eventTrigger?.eventType || '';
}

function getEventFilters<T>(cloudFunction: CloudFunction<T>): Record<string, string> {
  return cloudFunction?.__endpoint?.eventTrigger?.eventFilters || {};
}
