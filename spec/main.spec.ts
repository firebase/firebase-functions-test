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
import * as functions from 'firebase-functions';
import { set } from 'lodash';

import { mockConfig, makeChange, _makeResourceName, wrap } from '../src/main';

describe('main', () => {
  describe('#wrap', () => {
    const constructCF = (eventType?: string) => {
      const cloudFunction = (input) => input;
      set(cloudFunction, 'run', (data, context) => {
        return { data, context };
      });
      set(cloudFunction, '__trigger', {
        eventTrigger: {
          resource: 'ref/{wildcard}/nested/{anotherWildcard}',
          eventType: eventType || 'event',
          service: 'service',
        },
      });
      return cloudFunction as functions.CloudFunction<any>;
    };

    it('should invoke the function with the supplied data', () => {
      const wrapped = wrap(constructCF());
      expect(wrapped('data').data).to.equal('data');
    });

    it('should generate the appropriate context if no fields specified', () => {
      const context = wrap(constructCF())('data').context;
      expect(typeof context.eventId).to.equal('string');
      expect(context.resource.service).to.equal('service');
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
      const wrapped = wrap(constructCF());
      const context = wrapped('data', {
        eventId: '111',
        timestamp: '2018-03-28T18:58:50.370Z',
      }).context;
      expect(context.eventId).to.equal('111');
      expect(context.timestamp).to.equal('2018-03-28T18:58:50.370Z');
    });

    it('should generate auth and authType for database functions', () => {
      const context = wrap(constructCF('google.firebase.database.ref.write'))(
        'data'
      ).context;
      expect(context.auth).to.equal(null);
      expect(context.authType).to.equal('UNAUTHENTICATED');
    });

    it('should allow auth and authType to be specified for database functions', () => {
      const wrapped = wrap(constructCF('google.firebase.database.ref.write'));
      const context = wrapped('data', {
        auth: { uid: 'abc' },
        authType: 'USER',
      }).context;
      expect(context.auth).to.deep.equal({ uid: 'abc' });
      expect(context.authType).to.equal('USER');
    });

    it('should throw when passed invalid options', () => {
      const wrapped = wrap(constructCF());
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
      const wrapped = wrap(constructCF());
      const context = wrapped('data', { params }).context;
      expect(context.params).to.deep.equal(params);
      expect(context.resource.name).to.equal('ref/a/nested/b');
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

    it('should not throw an error when functions.config.singleton is missing', () => {
      delete functions.config.singleton;

      expect(() => mockConfig(config)).to.not.throw(Error);
    });
  });
});
