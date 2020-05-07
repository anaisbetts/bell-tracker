import * as React from 'react';

import * as firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import 'firebase/auth';
import 'firebase/firestore';

import './firebase';

import { from, of } from 'rxjs';
import { useObservable } from './use-helpers';
import { useAuthChanged } from './when-firebase';

function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return from(firebase.auth().signInWithPopup(provider).then(x => x.user));
}

// tslint:disable-next-line:variable-name
const RequireGoogleAuth: React.FunctionComponent = ({ children }) => {
  const user = useAuthChanged();

  const uiConfig = {
    signInFlow: 'popup',
    credentialHelper: 'none',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (a: any) => { console.log(a); return false; },
    },
  };

  if (user && user.ok()) {
    if (user.ok() === undefined) {
      return <></>;
    }

    return <>{children}</>;
  } else {
    return <>
      <style jsx global>{`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;

        justify-content: center;
      }
      `}
      </style>

      <h2>Sign in please!</h2>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </>;
  }
};

export default RequireGoogleAuth;
