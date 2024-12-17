import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction } from 'firebase-functions';
import { FirebaseAlertData } from 'firebase-functions/alerts';
import {
  BillingEvent,
  PlanAutomatedUpdatePayload,
} from 'firebase-functions/alerts/billing';
import {
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
  PROJECT_ID,
} from '../helpers';

export const alertsBillingOnPlanAutomatedUpdatePublished: MockCloudEventAbstractFactory<BillingEvent<
  PlanAutomatedUpdatePayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<BillingEvent<PlanAutomatedUpdatePayload>>
  ): BillingEvent<PlanAutomatedUpdatePayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: getBillingPlanAutomatedUpdateData(),
    };
  },
  match(
    cloudFunction: CloudFunction<BillingEvent<PlanAutomatedUpdatePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype ===
        'billing.planAutomatedUpdate'
    );
  },
};

function getBillingPlanAutomatedUpdateData(): FirebaseAlertData<
  PlanAutomatedUpdatePayload
> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.BillingPlanAutomatedUpdatePayload',
      billingPlan: 'flame',
      notificationType: 'upgrade',
    },
  };
}
