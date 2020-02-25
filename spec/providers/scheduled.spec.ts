import * as sinon from 'sinon';
import * as functions from 'firebase-functions';
import fft = require('../../src/index');
import { WrappedScheduledFunction } from '../../src/main';

describe('providers/scheduled', () => {
  const fakeFn = sinon.fake.resolves();
  const scheduledFunc = functions.pubsub
    .schedule('every 2 hours')
    .onRun(fakeFn);

  const emptyObjectMatcher = sinon.match(
    (v) => sinon.match.object.test(v) && Object.keys(v).length === 0
  );

  afterEach(() => {
    fakeFn.resetHistory();
  });

  it('should run the wrapped function with generated context', async () => {
    const test = fft();
    const fn: WrappedScheduledFunction = test.wrap(scheduledFunc);
    await fn();
    // Function should only be called with 1 argument
    sinon.assert.calledOnce(fakeFn);
    sinon.assert.calledWithExactly(
      fakeFn,
      sinon.match({
        eventType: sinon.match.string,
        timestamp: sinon.match.string,
        params: emptyObjectMatcher,
      })
    );
  });

  it('should run the wrapped function with provided context', async () => {
    const timestamp = new Date().toISOString();
    const test = fft();
    const fn: WrappedScheduledFunction = test.wrap(scheduledFunc);
    await fn({ timestamp });
    sinon.assert.calledOnce(fakeFn);
    sinon.assert.calledWithExactly(
      fakeFn,
      sinon.match({
        eventType: sinon.match.string,
        timestamp,
        params: emptyObjectMatcher,
      })
    );
  });
});
