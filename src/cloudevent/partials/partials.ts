import {MockCloudEventPartials} from '../types';
import {alertsOnAlertPublished} from './alerts/alerts-on-alert-published';
import {alertsCrashlyticsOnNewAnrIssuePublished} from './alerts/crashlytics-on-new-anr-issue-published';
import {alertsCrashlyticsOnNewFatalIssuePublished} from './alerts/crashlytics-on-new-fatal-issue-published';
import {alertsCrashlyticsOnNewNonfatalIssuePublished} from './alerts/crashlytics-on-new-nonfatal-issue-published';
import {alertsCrashlyticsOnRegressionAlertPublished} from './alerts/crashlytics-on-regression-alert-published';
import {alertsCrashlyticsOnStabilityDigestPublished} from './alerts/crashlytics-on-stability-digest-published';
import {alertsCrashlyticsOnVelocityAlertPublished} from './alerts/crashlytics-on-velocity-alert-published';
import {
  alertsAppDistributionOnNewTesterIosDevicePublished
} from './alerts/app-distribution-on-new-tester-ios-device-published';
import {alertsBillingOnPlanAutomatedUpdatePublished} from './alerts/billing-on-plan-automated-update-published';
import {alertsBillingOnPlanUpdatePublished} from './alerts/billing-on-plan-update-published';
import {eventarcOnCustomEventPublished} from './eventarc/eventarc-on-custom-event-published';
import {storageOnObjectArchived} from './storage/storage-on-object-archived';
import {storageOnObjectDeleted} from './storage/storage-on-object-deleted';
import {storageOnObjectFinalized} from './storage/storage-on-object-finalized';
import {storageOnObjectMetadataUpdated} from './storage/storage-on-object-metadata-updated';
import {pubsubOnMessagePublished} from './pubsub/pubsub-on-message-published';

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
