import { makeChange, wrap, mockConfig } from '../main';
import * as analytics from '../providers/analytics';
import * as auth from '../providers/auth';
import * as database from '../providers/database';
import * as firestore from '../providers/firestore';
import * as pubsub from '../providers/pubsub';
import * as storage from '../providers/storage';
import { FirebaseFunctionsTest } from '../lifecycle';

export interface LazyFeatures {
  mockConfig: typeof mockConfig;
  wrap: typeof wrap;
  makeChange: typeof makeChange;
  analytics: typeof analytics;
  auth: typeof auth;
  database: typeof database;
  firestore: typeof firestore;
  pubsub: typeof pubsub;
  storage: typeof storage;
}

export interface FeaturesList extends LazyFeatures {
  cleanup: InstanceType<typeof FirebaseFunctionsTest>['cleanup'];
}
