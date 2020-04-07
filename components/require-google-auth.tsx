import * as React from 'react';

import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

import './firebase';

import { from, of } from 'rxjs';
import { useObservable } from './use-helpers';

function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return from(firebase.auth().signInWithPopup(provider).then(x => x.user));
}

// tslint:disable-next-line:variable-name
const RequireGoogleAuth: React.FunctionComponent = ({ children }) => {
  const user = useObservable(() => {
    const auth = firebase.auth();
    if (auth.currentUser) {
      return of(auth.currentUser);
    } else {
      return googleSignIn();
    }
  });

  if (user) {
    return <>{children}</>;
  } else {
    return <p>Sign in please!</p>;
  }
};

export default RequireGoogleAuth;
