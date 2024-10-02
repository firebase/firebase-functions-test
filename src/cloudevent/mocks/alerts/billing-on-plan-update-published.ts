import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction } from 'firebase-functions';
import { FirebaseAlertData } from 'firebase-functions/alerts';
import {
  BillingEvent,
  PlanUpdatePayload,
} from 'firebase-functions/alerts/billing';
import {
  getBaseCloudEvent,
  getEventFilters,
  getEventType,
  PROJECT_ID,
} from '../helpers';

export const alertsBillingOnPlanUpdatePublished: MockCloudEventAbstractFactory<BillingEvent<
  PlanUpdatePayload
>> = {
  generateMock(
    cloudFunction: CloudFunction<BillingEvent<PlanUpdatePayload>>
  ): BillingEvent<PlanUpdatePayload> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),
      // Spread fields specific to this CloudEvent
      source,
      data: getBillingPlanUpdateData(),
    };
  },
  match(
    cloudFunction: CloudFunction<BillingEvent<PlanUpdatePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planUpdate'
    );
  },
};

/** Alert Billing Data */
function getBillingPlanUpdateData(): FirebaseAlertData<PlanUpdatePayload> {
  const now = new Date().toISOString();
  return {
    createTime: now,
    endTime: now,
    payload: {
      ['@type']:
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.BillingPlanUpdatePayload',
      billingPlan: 'flame',
      principalEmail: 'test@test.com',
      notificationType: 'upgrade',
    },
  };
}
