import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudFunction, CloudEvent } from 'firebase-functions';
import { TestMatrixCompletedData } from 'firebase-functions/testLab';
import { getBaseCloudEvent, getEventType, PROJECT_ID } from '../helpers';

export const testLabOnTestMatrixCompleted: MockCloudEventAbstractFactory<CloudEvent<
  TestMatrixCompletedData
>> = {
  generateMock(
    cloudFunction: CloudFunction<CloudEvent<TestMatrixCompletedData>>
  ): CloudEvent<TestMatrixCompletedData> {
    const source = `//firebasetestlab.googleapis.com/projects/${PROJECT_ID}`;
    return {
      ...getBaseCloudEvent(cloudFunction),
      source,
      data: getTestMatrixCompletedData(),
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<TestMatrixCompletedData>>) {
    return (
      getEventType(cloudFunction) ===
      'google.firebase.testlab.testMatrix.v1.completed'
    );
  },
};

function getTestMatrixCompletedData(): TestMatrixCompletedData {
  const now = new Date().toISOString();
  return {
    createTime: now,
    state: 'TEST_STATE_UNSPECIFIED',
    invalidMatrixDetails: '',
    outcomeSummary: 'OUTCOME_SUMMARY_UNSPECIFIED',
    resultStorage: {
      toolResultsHistory: `projects/${PROJECT_ID}/histories/1234`,
      toolResultsExecution: `projects/${PROJECT_ID}/histories/1234/executions/5678`,
      resultsUri: 'console.firebase.google.com/test/results',
      gcsPath: 'gs://bucket/path/to/test',
    },
    clientInfo: {
      client: 'gcloud',
      details: {},
    },
    testMatrixId: '1234',
  };
}
