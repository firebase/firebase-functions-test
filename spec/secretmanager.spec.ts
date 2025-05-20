import { expect } from 'chai';
import { mockSecretManager } from '../src/secretManager';

describe('mockSecretManager', () => {
  let originalEnv;

  before(() => {
    // Capture the original environment variables
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Reset any mutations made by the test run
    process.env = { ...originalEnv };
  });

  it('applies each key/value pair to process.env', () => {
    const conf = { FOO: 'bar', BAZ: 'qux' };

    mockSecretManager(conf);

    expect(process.env.FOO).to.equal('bar');
    expect(process.env.BAZ).to.equal('qux');
  });

  it('overwrites an existing variable with the new value', () => {
    process.env.EXISTING = 'old';
    const conf = { EXISTING: 'new' };

    mockSecretManager(conf);

    expect(process.env.EXISTING).to.equal('new');
  });

  it('supports non-string values (coerced to string)', () => {
    const conf: Record<string, string> = {
      NUM_VALUE: '123',
      BOOL_VALUE: 'true',
    };

    mockSecretManager(conf);

    expect(process.env.NUM_VALUE).to.equal('123');
    expect(process.env.BOOL_VALUE).to.equal('true');
  });
});
