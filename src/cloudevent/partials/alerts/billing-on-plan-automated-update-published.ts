import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { FirebaseAlertData } from 'firebase-functions/v2/alerts';
import {
  BillingEvent,
  PlanAutomatedUpdatePayload,
} from 'firebase-functions/v2/alerts/billing';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';

export const alertsBillingOnPlanAutomatedUpdatePublished: MockCloudEventPartials<BillingEvent<
  PlanAutomatedUpdatePayload
>> = {
  generatePartial(
    _: CloudFunction<BillingEvent<PlanAutomatedUpdatePayload>>
  ): DeepPartial<BillingEvent<PlanAutomatedUpdatePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
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
