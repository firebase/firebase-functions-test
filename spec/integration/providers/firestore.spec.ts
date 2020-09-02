import { expect } from 'chai';
import { firestore, initializeApp } from 'firebase-admin';
import fft = require('../../../src/index');

describe('providers/firestore', () => {
  before(() => {
    initializeApp();
  });

  it('clears database with clearFirestoreData', async () => {
    const test = fft({ projectId: 'not-a-project' });
    const db = firestore();

    await Promise.all([
      db
        .collection('test')
        .doc('doc1')
        .set({}),
      db
        .collection('test')
        .doc('doc1')
        .collection('test')
        .doc('doc2')
        .set({}),
    ]);

    await test.firestore.clearFirestoreData({ projectId: 'not-a-project' });

    const docs = await Promise.all([
      db
        .collection('test')
        .doc('doc1')
        .get(),
      db
        .collection('test')
        .doc('doc1')
        .collection('test')
        .doc('doc2')
        .get(),
    ]);
    expect(docs[0].exists).to.be.false;
    expect(docs[1].exists).to.be.false;
  });
});
