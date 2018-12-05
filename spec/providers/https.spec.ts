import { expect } from 'chai';
import * as functions from 'firebase-functions';
import fft = require('../../src/index');

const cfToUpperCaseOnRequest = functions.https.onRequest((req, res) => {
    res.json({msg: req.params.message.toUpperCase()});
});

const cfToUpperCaseOnCall = functions.https.onCall((data, context) => {
    const result = {
        msg: data.message.toUpperCase(),
        from: 'anonymous',
    };

    if (context.auth && context.auth.uid) {
        result.from = context.auth.uid;
    }

    return result;
});

describe('providers/https', () => {
    it('should not throw when passed onRequest function', async () => {
        const test = fft();
        /*
            Note that we must cast the function to any here because onRequst functions
            do not fulfill Runnable<>, so these checks are solely for usage of this lib
            in JavaScript test suites.
         */
        expect(() => test.wrap(cfToUpperCaseOnRequest as any)).to.throw();
    });

    it('should run the wrapped onCall function and return result', async () => {
        const test = fft();
        const result = await test.wrap(cfToUpperCaseOnCall)({message: 'lowercase'});
        expect(result).to.deep.equal({msg: 'LOWERCASE', from: 'anonymous'});
    });

    it('should accept auth params', async () => {
        const test = fft();
        const options = {auth: {uid: 'abc'}};
        const result = await test.wrap(cfToUpperCaseOnCall)({message: 'lowercase'}, options);
        expect(result).to.deep.equal({msg: 'LOWERCASE', from: 'abc'});
    });
});
