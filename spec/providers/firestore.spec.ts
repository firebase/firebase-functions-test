import { expect } from 'chai';
import * as firebase from 'firebase-admin';
import { FeaturesList } from '../../src/features';
import fft = require('../../src/index');

describe('providers/firestore', () => {
  let test: FeaturesList;

  beforeEach(() => {
    test = fft();
  });

  it('produces the right snapshot with makeDocumentSnapshot', async () => {
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
    const snapshot = test.firestore.makeDocumentSnapshot(
      {},
      'collection/doc-id'
    );

    expect(snapshot.data()).to.deep.equal(undefined);
    expect(snapshot.id).to.equal('doc-id');
  });

  it('should allow geopoints with makeDocumentSnapshot', () => {
    const hq = new firebase.firestore.GeoPoint(47.6703, 122.1971);
    const snapshot = test.firestore.makeDocumentSnapshot(
      { geopoint: hq },
      'collection/doc-id'
    );

    expect(snapshot.data()).to.deep.equal({ geopoint: hq });
  });

  it('should allow timestamps with makeDocumentSnapshot', () => {
    const time = new Date();
    const snapshot = test.firestore.makeDocumentSnapshot(
      { time },
      'collection/doc-id'
    );

    expect(snapshot.data().time).to.be.instanceof(firebase.firestore.Timestamp);
    expect(snapshot.data().time.toDate()).to.deep.equal(time);
  });

  it('should allow references with makeDocumentSnapshot', () => {
    firebase.initializeApp({
      projectId: 'not-a-project',
    });

    const ref = firebase.firestore().doc('collection/doc-id');
    const snapshot = test.firestore.makeDocumentSnapshot(
      { ref },
      'collection/doc-id'
    );

    expect(snapshot.data().ref).to.be.instanceOf(
      firebase.firestore.DocumentReference
    );
    expect(snapshot.data().ref.toString()).to.equal(ref.toString());
  });
});
