import {DeepPartial, MockCloudEventPartials} from '../../types';
import {FirebaseAlertData} from 'firebase-functions/lib/v2/providers/alerts';
import {BillingEvent, PlanAutomatedUpdatePayload} from 'firebase-functions/lib/v2/providers/alerts/billing';
import {CloudFunction} from 'firebase-functions/lib/v2';
import {getEventFilters, getEventType, PROJECT_ID} from '../helpers';

export const alertsBillingOnPlanAutomatedUpdatePublished:
  MockCloudEventPartials<FirebaseAlertData<PlanAutomatedUpdatePayload>,
    FirebaseAlertData<PlanAutomatedUpdatePayload>> = {
  generatePartial(
    cloudFunction: CloudFunction<FirebaseAlertData<PlanAutomatedUpdatePayload>>):
    DeepPartial<BillingEvent<PlanAutomatedUpdatePayload>> {
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
