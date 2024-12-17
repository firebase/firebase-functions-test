// The MIT License (MIT)
//
// Copyright (c) 2018 Firebase
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { expect } from 'chai';
import * as functions from 'firebase-functions/v1';
import { set } from 'lodash';

import { mockConfig, makeChange, wrap } from '../src/main';
import { _makeResourceName, _extractParams } from '../src/v1';
import { features } from '../src/features';
import { FirebaseFunctionsTest } from '../src/lifecycle';
import { alerts } from 'firebase-functions';
import { wrapV2 } from '../src/v2';

describe('main', () => {
  describe('#wrap', () => {
    describe('background functions', () => {
      const constructBackgroundCF = (eventType?: string) => {
        const cloudFunction = (input) => input;
        set(cloudFunction, 'run', (data, context) => {
          return { data, context };
        });
        set(cloudFunction, '__endpoint', {
          eventTrigger: {
            eventFilters: {
              resource: 'ref/{wildcard}/nested/{anotherWildcard}',
            },
            eventType: eventType || 'event',
            retry: false,
          },
        });
        return cloudFunction as functions.CloudFunction<any>;
      };

      it('should invoke the function with the supplied data', () => {
        const wrapped = wrap(constructBackgroundCF());
        expect(wrapped('data').data).to.equal('data');
      });

      it('should generate the appropriate context if no fields specified', () => {
        const context = wrap(constructBackgroundCF())('data').context;
        expect(typeof context.eventId).to.equal('string');
        expect(context.resource.service).to.equal(
          'unknown-service.googleapis.com'
        );
        expect(
          /ref\/wildcard[1-9]\/nested\/anotherWildcard[1-9]/.test(
            context.resource.name
          )
        ).to.be.true;
        expect(context.eventType).to.equal('event');
        expect(Date.parse(context.timestamp)).to.be.greaterThan(0);
        expect(context.params).to.deep.equal({});
        expect(context.auth).to.be.undefined;
        expect(context.authType).to.be.undefined;
      });

      it('should allow specification of context fields', () => {
        const wrapped = wrap(constructBackgroundCF());
        const context = wrapped('data', {
          eventId: '111',
          timestamp: '2018-03-28T18:58:50.370Z',
        }).context;
        expect(context.eventId).to.equal('111');
        expect(context.timestamp).to.equal('2018-03-28T18:58:50.370Z');
      });

      describe('database functions', () => {
        let test;
        let change;

        beforeEach(() => {
          test = new FirebaseFunctionsTest();
          test.init();
          change = features.database.exampleDataSnapshotChange();
        });

        afterEach(() => {
          test.cleanup();
        });

        it('should generate auth and authType', () => {
          const wrapped = wrap(
            constructBackgroundCF('google.firebase.database.ref.write')
          );
          const context = wrapped(change).context;
          expect(context.auth).to.equal(null);
          expect(context.authType).to.equal('UNAUTHENTICATED');
        });

        it('should allow auth and authType to be specified', () => {
          const wrapped = wrap(
            constructBackgroundCF('google.firebase.database.ref.write')
          );
          const context = wrapped(change, {
            auth: { uid: 'abc' },
            authType: 'USER',
          }).context;
          expect(context.auth).to.deep.equal({ uid: 'abc' });
          expect(context.authType).to.equal('USER');
        });
      });

      it('should throw when passed invalid options', () => {
        const wrapped = wrap(constructBackgroundCF());
        expect(() =>
          wrapped('data', {
            auth: { uid: 'abc' },
            isInvalid: true,
          } as any)
        ).to.throw();
      });

      it('should generate the appropriate resource based on params', () => {
        const params = {
          wildcard: 'a',
          anotherWildcard: 'b',
        };
        const wrapped = wrap(constructBackgroundCF());
        const context = wrapped('data', { params }).context;
        expect(context.params).to.deep.equal(params);
        expect(context.resource.name).to.equal('ref/a/nested/b');
      });

      describe('Params extraction', () => {
        let test;

        beforeEach(() => {
          test = new FirebaseFunctionsTest();
          test.init();
        });

        afterEach(() => {
          test.cleanup();
        });

        it('should extract the appropriate params for database function trigger', () => {
          const cf = constructBackgroundCF(
            'google.firebase.database.ref.create'
          );
          cf.__endpoint.eventTrigger.eventFilters.resource =
            'companies/{company}/users/{user}';
          const wrapped = wrap(cf);
          const context = wrapped(
            features.database.makeDataSnapshot(
              { foo: 'bar' },
              'companies/Google/users/Lauren'
            )
          ).context;
          expect(context.params).to.deep.equal({
            company: 'Google',
            user: 'Lauren',
          });
          expect(context.resource.name).to.equal(
            'companies/Google/users/Lauren'
          );
        });

        it('should extract the appropriate params for Firestore function trigger', () => {
          const cf = constructBackgroundCF('google.firestore.document.create');
          cf.__endpoint.eventTrigger.eventFilters.resource =
            'databases/(default)/documents/companies/{company}/users/{user}';
          const wrapped = wrap(cf);
          const context = wrapped(
            features.firestore.makeDocumentSnapshot(
              { foo: 'bar' },
              'companies/Google/users/Lauren'
            )
          ).context;
          expect(context.params).to.deep.equal({
            company: 'Google',
            user: 'Lauren',
          });
          expect(context.resource.name).to.equal(
            'databases/(default)/documents/companies/Google/users/Lauren'
          );
        });

        it('should prefer provided context.params over the extracted params', () => {
          const cf = constructBackgroundCF(
            'google.firebase.database.ref.create'
          );
          cf.__endpoint.eventTrigger.eventFilters.resource =
            'companies/{company}/users/{user}';
          const wrapped = wrap(cf);
          const context = wrapped(
            features.database.makeDataSnapshot(
              { foo: 'bar' },
              'companies/Google/users/Lauren'
            ),
            {
              params: {
                company: 'Alphabet',
                user: 'Lauren',
                foo: 'bar',
              },
            }
          ).context;
          expect(context.params).to.deep.equal({
            company: 'Alphabet',
            user: 'Lauren',
            foo: 'bar',
          });
          expect(context.resource.name).to.equal(
            'companies/Alphabet/users/Lauren'
          );
        });
      });
    });

    describe('v2 functions', () => {
      it('should invoke wrapV2 wrapper', () => {
        const handler = (cloudEvent) => ({ cloudEvent });
        const cloudFn = alerts.billing.onPlanAutomatedUpdatePublished(handler);
        const cloudFnWrap = wrapV2(cloudFn);

        const expectedType =
          'google.firebase.firebasealerts.alerts.v1.published';
        expect(cloudFnWrap().cloudEvent).to.include({ type: expectedType });
      });
    });

    describe('callable functions', () => {
      let wrappedCF;

      before(() => {
        const cloudFunction = (input) => input;
        set(cloudFunction, 'run', (data, context) => {
          return { data, context };
        });
        set(cloudFunction, '__endpoint', {
          callableTrigger: {},
        });
        wrappedCF = wrap(cloudFunction as functions.CloudFunction<any>);
      });

      it('should invoke the function with the supplied data', () => {
        expect(wrappedCF('data').data).to.equal('data');
      });

      it('should allow specification of context fields', () => {
        const context = wrappedCF('data', {
          auth: { uid: 'abc' },
          app: { appId: 'efg' },
          instanceIdToken: '123',
          rawRequest: { body: 'hello' },
        }).context;
        expect(context.auth).to.deep.equal({ uid: 'abc' });
        expect(context.app).to.deep.equal({ appId: 'efg' });
        expect(context.instanceIdToken).to.equal('123');
        expect(context.rawRequest).to.deep.equal({ body: 'hello' });
      });

      it('should throw when passed invalid options', () => {
        expect(() =>
          wrappedCF('data', {
            auth: { uid: 'abc' },
            isInvalid: true,
          } as any)
        ).to.throw();
      });
    });
  });

  describe('#_makeResourceName', () => {
    it('constructs the right resource name from params', () => {
      const resource = _makeResourceName('companies/{company}/users/{user}', {
        company: 'Google',
        user: 'Lauren',
      });
      expect(resource).to.equal('companies/Google/users/Lauren');
    });
  });

  describe('#_extractParams', () => {
    it('should not extract any params', () => {
      const params = _extractParams('users/foo', 'users/foo');
      expect(params).to.deep.equal({});
    });

    it('should extract params', () => {
      const params = _extractParams(
        'companies/{company}/users/{user}',
        'companies/Google/users/Lauren'
      );
      expect(params).to.deep.equal({
        company: 'Google',
        user: 'Lauren',
      });
    });
  });

  describe('#makeChange', () => {
    it('should make a Change object with the correct before and after', () => {
      const change = makeChange('before', 'after');
      expect(change instanceof functions.Change).to.be.true;
      expect(change.before).to.equal('before');
      expect(change.after).to.equal('after');
    });
  });

  describe('#mockConfig', () => {
    let config: Record<string, unknown>;

    beforeEach(() => {
      config = { foo: { bar: 'faz ' } };
    });

    afterEach(() => {
      delete process.env.CLOUD_RUNTIME_CONFIG;
    });

    it('should mock functions.config()', () => {
      mockConfig(config);
      expect(functions.config()).to.deep.equal(config);
    });

    it('should purge singleton config object when it is present', () => {
      mockConfig(config);
      config.foo = { baz: 'qux' };
      mockConfig(config);

      expect(functions.config()).to.deep.equal(config);
    });
  });
});
