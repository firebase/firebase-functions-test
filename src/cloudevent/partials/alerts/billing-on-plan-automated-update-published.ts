import {DeepPartial, MockCloudEventPartials} from '../../types';
import {CloudFunction, alerts} from 'firebase-functions/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsBillingOnPlanAutomatedUpdatePublished:
  MockCloudEventPartials<alerts.FirebaseAlertData<alerts.billing.PlanAutomatedUpdatePayload>,
    alerts.FirebaseAlertData<alerts.billing.PlanAutomatedUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.billing.PlanAutomatedUpdatePayload>>):
    DeepPartial<alerts.billing.BillingEvent<alerts.billing.PlanAutomatedUpdatePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;

    return {
      source,
      type: getEventType(cloudFunction),
      data: getBillingPlanAutomatedUpdateData(),
    };
  },
  match(cloudFunction: CloudFunction<alerts.FirebaseAlertData<alerts.billing.PlanAutomatedUpdatePayload>>): boolean {
    return getEventType(cloudFunction) === 'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype === 'billing.planAutomatedUpdate';
  },
};

function getBillingPlanAutomatedUpdateData(): alerts.FirebaseAlertData<alerts.billing.PlanAutomatedUpdatePayload> {
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
