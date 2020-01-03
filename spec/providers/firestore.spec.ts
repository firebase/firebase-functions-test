import { expect } from 'chai';
import fft = require('../../src/index');

describe('providers/firestore', () => {
  it('produces the right snapshot with makeDocumentSnapshot', async () => {
    const test = fft();

    const snapshot = test.firestore.makeDocumentSnapshot(
      {
        email_address: 'test@test.com',
      },
      'collection/doc-id'
    );

    expect(snapshot.data()).to.deep.equal({
      email_address: 'test@test.com',
    });
    expect(snapshot.id).to.equal('doc-id');
  });

  it('should allow empty document in makeDocumentSnapshot', async () => {
    const test = fft();

    const snapshot = test.firestore.makeDocumentSnapshot(
      {},
      'collection/doc-id'
    );

    expect(snapshot.data()).to.deep.equal(undefined);
    expect(snapshot.id).to.equal('doc-id');
  });
});
