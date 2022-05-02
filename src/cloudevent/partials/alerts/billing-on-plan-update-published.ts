import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {BillingEvent, PlanUpdatePayload} from 'firebase-functions/lib/v2/providers/alerts/billing';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsBillingOnPlanUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanUpdatePayload>, FirebaseAlertData<PlanUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanUpdatePayload>>):
    DeepPartial<BillingEvent<PlanUpdatePayload>> {
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
