import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from './firebase-config';

try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  // tslint:disable-next-line:no-empty
} catch (_e) { }

export const db = firebase.firestore!();
db.settings({});
