import { makeChange, wrap, mockConfig } from './main';
import * as analytics from './providers/analytics';
import * as auth from './providers/auth';
import * as database from './providers/database';
import * as firestore from './providers/firestore';
import * as pubsub from './providers/pubsub';
import * as storage from './providers/storage';
import { LazyFeatures } from './types/commonTypes';

export const features: LazyFeatures = {
  mockConfig,
  wrap,
  makeChange,
  analytics,
  auth,
  database,
  firestore,
  pubsub,
  storage,
};
