import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsBillingOnPlanUpdatePublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.billing.PlanUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.billing.PlanUpdatePayload>>):
    DeepPartial<alerts.billing.BillingEvent<alerts.billing.PlanUpdatePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      data: getBillingPlanUpdateData(),
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.billing.PlanUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planUpdate';
  },
};

/** Alert Billing Data */
function getBillingPlanUpdateData(): alerts.FirebaseAlertData<alerts.billing.PlanUpdatePayload> {
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
