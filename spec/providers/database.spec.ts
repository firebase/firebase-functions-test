import { expect } from 'chai';
import { FirebaseFunctionsTest } from '../../src/lifecycle';
import { makeDataSnapshot } from '../../src/providers/database';

describe('providers/database', () => {
  let test;

  before(() => {
    test = new FirebaseFunctionsTest();
    test.init();
  });

  after(() => {
    test.cleanup();
  });

  it('produces the right snapshot with makeDataSnapshot', async () => {
    const snapshot = makeDataSnapshot({
      foo: 'bar',
    }, 'path');

    expect(snapshot.val()).to.deep.equal({foo: 'bar'});
    expect(snapshot.ref.key).to.equal('path');
  });

  it('should allow null value in makeDataSnapshot', async () => {
    const snapshot = makeDataSnapshot(null, 'path');

    expect(snapshot.val()).to.deep.equal(null);
    expect(snapshot.ref.key).to.equal('path');
  });
});
