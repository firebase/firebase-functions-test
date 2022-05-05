import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';
import {
  BillingEvent,
  PlanUpdatePayload,
} from 'firebase-functions/v2/alerts/billing';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';

export const alertsBillingOnPlanUpdatePublished: MockCloudEventPartials<BillingEvent<
  PlanUpdatePayload
>> = {
  generatePartial(
    _: CloudFunction<BillingEvent<PlanUpdatePayload>>
  ): DeepPartial<BillingEvent<PlanUpdatePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
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
    // '@type': 'type.googleapis.com/google.events.firebase.firebasealerts.v1.AlertData',
    createTime: now,
    endTime: now,
    payload: {
      '@type':
        'type.googleapis.com/google.events.firebase.firebasealerts.v1.BillingPlanUpdatePayload',
      billingPlan: 'flame',
      principalEmail: 'test@test.com',
      notificationType: 'upgrade',
    },
  };
}
