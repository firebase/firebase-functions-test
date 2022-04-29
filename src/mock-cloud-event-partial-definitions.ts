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

export type DeepPartial<T extends object> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key]
};

type MockCloudEventPartialFunction<FunctionType, EventType> =
  (cloudFunction: CloudFunction<FunctionType>) => DeepPartial<CloudEvent<EventType>>;
type MockCloudEventMatchFunction<FunctionType> =
  (cloudFunction: CloudFunction<FunctionType>) => boolean;

interface MockCloudEventPartials<FunctionType, EventType> {
  generatePartial: MockCloudEventPartialFunction<FunctionType, EventType>;
  match: MockCloudEventMatchFunction<FunctionType>;
}

const alertsOnAlertPublished:
  MockCloudEventPartials<FirebaseAlertData, FirebaseAlertData<any>> = {
  generatePartial(cloudFunction: CloudFunction<FirebaseAlertData>): DeepPartial<CloudEvent<FirebaseAlertData<any>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getOnAlertPublishedData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published';
  },
};
const alertsCrashlyticsOnNewAnrIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewAnrIssuePayload>, FirebaseAlertData<NewAnrIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<NewAnrIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewAnrIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewAnrIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newAnrIssue';
  },
};
const alertsCrashlyticsOnNewFatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewFatalIssuePayload>, FirebaseAlertData<NewFatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<NewFatalIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewFatalIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewFatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newFatalIssue';
  },
};
const alertsCrashlyticsOnNewNonfatalIssuePublished:
  MockCloudEventPartials<FirebaseAlertData<NewNonfatalIssuePayload>, FirebaseAlertData<NewNonfatalIssuePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<NewNonfatalIssuePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsNewNonfatalIssueData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewNonfatalIssuePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.newNonfatalIssue';
  },
};
const alertsCrashlyticsOnRegressionAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<RegressionAlertPayload>, FirebaseAlertData<RegressionAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<RegressionAlertPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsRegressionAlertPayload(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<RegressionAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.regression';
  },
};
const alertsCrashlyticsOnStabilityDigestPublished:
  MockCloudEventPartials<FirebaseAlertData<StabilityDigestPayload>, FirebaseAlertData<StabilityDigestPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<StabilityDigestPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsStabilityData()
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<StabilityDigestPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.stabilityDigest';
  },
};
const alertsCrashlyticsOnVelocityAlertPublished:
  MockCloudEventPartials<FirebaseAlertData<VelocityAlertPayload>, FirebaseAlertData<VelocityAlertPayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<VelocityAlertPayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getCrashlyticsVelocityAlertData(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<VelocityAlertPayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'crashlytics.velocity';
  },
};
const alertsAppDistributionOnNewTesterIosDevicePublished:
  MockCloudEventPartials<FirebaseAlertData<NewTesterDevicePayload>, FirebaseAlertData<NewTesterDevicePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<NewTesterDevicePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;
    const now = new Date().toISOString();

    return {
      source,
      type: getEventType(cloudFunction),
      data: {
        createTime: now,
        endTime: now,
        payload: {
          ['@type']: 'com.google.firebase.firebasealerts.NewTesterDevicePayload',
          testerName: 'tester name',
          testerEmail: 'test@test.com',
          testerDeviceModelName: 'tester device model name',
          testerDeviceIdentifier: 'tester device identifier',
        }
      }
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<NewTesterDevicePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'appDistribution.newTesterIosDevice';
  },
};
const alertsBillingOnPlanAutomatedUpdatePublished:
  MockCloudEventPartials<
    FirebaseAlertData<PlanAutomatedUpdatePayload>,
    FirebaseAlertData<PlanAutomatedUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanAutomatedUpdatePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<PlanAutomatedUpdatePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getBillingPlanAutomatedUpdateData(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<PlanAutomatedUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planAutomatedUpdate';
  },
};
const alertsBillingOnPlanUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanUpdatePayload>, FirebaseAlertData<PlanUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanUpdatePayload>>):
    DeepPartial<CloudEvent<FirebaseAlertData<PlanUpdatePayload>>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getBillingPlanUpdateData(),
    };
  },
  match(cloudFunction: CloudFunction<FirebaseAlertData<PlanUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planUpdate';
  },
};
const eventarcOnCustomEventPublished:
  MockCloudEventPartials<any, any> = {
  generatePartial(cloudFunction: CloudFunction<unknown>): DeepPartial<CloudEvent> {
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
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): DeepPartial<CloudEvent<StorageObjectData>> {
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
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): DeepPartial<CloudEvent<StorageObjectData>> {
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
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): DeepPartial<CloudEvent<StorageObjectData>> {
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
  generatePartial(cloudFunction: CloudFunction<StorageObjectData>): DeepPartial<CloudEvent<StorageObjectData>> {
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
  generatePartial(cloudFunction: CloudFunction<MessagePublishedData>): DeepPartial<CloudEvent<MessagePublishedData>> {
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

/** Storage Data */
function getStorageObjectData(bucket: string, filename: string, generation: number): StorageObjectData {
  const now = new Date().toISOString();
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

/** Alert Published Data */

function getOnAlertPublishedData(): FirebaseAlertData<any> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {}
  });
}

/** Alert Billing Data */
function getBillingPlanUpdateData(): FirebaseAlertData<PlanUpdatePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.PlanUpdatePayload',
      'billingPlan': 'flame',
      'principalEmail': 'test@test.com',
      // 'notificationType': 'upgrade'
    }
  });
}
function getBillingPlanAutomatedUpdateData(): FirebaseAlertData<PlanAutomatedUpdatePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.PlanAutomatedUpdatePayload',
      'billingPlan': 'flame',
      // 'notificationType': 'upgrade'
    }
  });
}

/** Alert Crashlytics Data */
function getCrashlyticsRegressionAlertPayload(): FirebaseAlertData<RegressionAlertPayload> {
  const now = new Date().toISOString();
  return ({
    // ['@type']: 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsRegressionAlertPayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
      'type': 'test type',
      'resolveTime': now
    }
  });
}

function getCrashlyticsVelocityAlertData(): FirebaseAlertData<VelocityAlertPayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.VelocityAlertPayload',
      'crashCount': 100,
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
      'createTime': now,
      'firstVersion': '1.1',
      'crashPercentage': 50.0
    }
  });
}

function getCrashlyticsNewNonfatalIssueData(): FirebaseAlertData<NewNonfatalIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsNewNonfatalIssuePayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}

function getCrashlyticsNewFatalIssueData(): FirebaseAlertData<NewFatalIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsNewFatalIssuePayload',
      'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}

function getCrashlyticsNewAnrIssueData(): FirebaseAlertData<NewAnrIssuePayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
        '@type': 'com.google.firebase.firebasealerts.NewAnrIssuePayload',
        'issue': {
        id: 'crashlytics_issue_id',
        title: 'crashlytics_issue_title',
        subtitle: 'crashlytics_issue_subtitle',
        appVersion: 'crashlytics_issue_app_version'
      },
    }
  });
}

function getCrashlyticsStabilityData(): FirebaseAlertData<StabilityDigestPayload> {
  const now = new Date().toISOString();
  return ({
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type': 'com.google.firebase.firebasealerts.CrashlyticsStabilityDigestPayload',
      'digestDate': new Date().toISOString(),
      'trendingIssues': [
        {
          type: 'type',
          eventCount: 100,
          userCount: 100,
          issue: {
            id: 'crashlytics_issue_id',
            title: 'crashlytics_issue_title',
            subtitle: 'crashlytics_issue_subtitle',
            appVersion: 'crashlytics_issue_app_version'
          }
        }
      ]
    }
  });
}
