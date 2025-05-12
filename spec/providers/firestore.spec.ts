import { expect } from 'chai';
import * as firebase from 'firebase-admin';
import * as sinon from 'sinon';
import * as http from 'http';
import { FeaturesList } from '../../src/types/commonTypes';
import fft = require('../../src/index');

describe('providers/firestore', () => {
  let test: FeaturesList;
  let fakeHttpRequestMethod;
  let fakeHttpResponse;

  beforeEach(() => {
    test = fft();
    fakeHttpResponse = {
      statusCode: 200,
      on: (event, cb) => cb(),
    };
    fakeHttpRequestMethod = sinon.fake((config, cb) => {
      cb(fakeHttpResponse);
    });
    sinon.replace(http, 'request', fakeHttpRequestMethod);
  });

  afterEach(() => {
    sinon.restore();
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

  it('should use host name from FIRESTORE_EMULATOR_HOST env in clearFirestoreData', async () => {
    process.env.FIRESTORE_EMULATOR_HOST = 'not-local-host:8080';

    await test.firestore.clearFirestoreData({ projectId: 'not-a-project' });

    expect(
      fakeHttpRequestMethod.calledOnceWith({
        hostname: 'not-local-host',
        method: 'DELETE',
        path:
          '/emulator/v1/projects/not-a-project/databases/(default)/documents',
        port: '8080',
      })
    ).to.be.true;
  });

  it('should use host name from FIREBASE_FIRESTORE_EMULATOR_ADDRESS env in clearFirestoreData', async () => {
    process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = 'custom-host:9090';

    await test.firestore.clearFirestoreData({ projectId: 'not-a-project' });

    expect(
      fakeHttpRequestMethod.calledOnceWith({
        hostname: 'custom-host',
        method: 'DELETE',
        path:
          '/emulator/v1/projects/not-a-project/databases/(default)/documents',
        port: '9090',
      })
    ).to.be.true;
  });
});
