import { makeChange, wrap, mockConfig } from './main';
import * as analytics from './providers/analytics';
import * as crashlytics from './providers/crashlytics';
import * as database from './providers/database';
import * as firestore from './providers/firestore';
import * as pubsub from './providers/pubsub';
import * as storage from './providers/storage';

export interface FeaturesList {
  mockConfig: typeof mockConfig;
  wrap: typeof wrap;
  makeChange: typeof makeChange;
  analytics: typeof analytics;
  crashlytics: typeof crashlytics;
  database: typeof database;
  firestore: typeof firestore;
  pubsub: typeof pubsub;
  storage: typeof storage;
}

export const features: FeaturesList = {
  mockConfig,
  wrap,
  makeChange,
  analytics,
  crashlytics,
  database,
  firestore,
  pubsub,
  storage,
};
