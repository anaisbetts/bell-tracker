import {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
} from '@firebase/firestore-types';

import {
  lazyFor,
  Model,
  propertySelectorToNames,
  PropSelector,
} from '@whenjs/when';

import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

import { useState } from 'react';
import { concat, Observable, Observer, of, throwError } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { useObservable } from './use-helpers';

function queryUpdates<T>(query: Query): Observable<QuerySnapshot<T>> {
  return Observable.create(query.onSnapshot.bind(query));
}

function documentUpdates(doc: DocumentReference): Observable<DocumentSnapshot> {
  return Observable.create(doc.onSnapshot.bind(doc));
}

export function toData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) {
    return null;
  }

  const data: any = doc.data();
  return data as T;
}

function toDatas<T>(query: QuerySnapshot): T[] {
  return query.docs.reduce((acc: T[], x) => {
    const item = toData<T>(x);
    if (item) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function useDocumentData<T>(
  doc: () => DocumentReference,
  snapshot?: DocumentSnapshot,
) {
  const [d] = useState(doc);

  return useObservable<T | null>(() => {
    const initial = snapshot
      ? of(toData<T>(snapshot))
      : d.get().then(x => toData<T>(x));

    const update = documentUpdates(d).pipe(map(x => toData<T>(x)));

    return concat(initial, update);
  });
}

export function useDocument(doc: () => DocumentReference) {
  return useObservable(() => {
    return new Observable((subj: Observer<DocumentSnapshot>) =>
      doc().onSnapshot(subj));
  });
}

export function useAuthChanged() {
  return useObservable(() =>
    new Observable((subj: Observer<firebase.User | null>) =>
      firebase.auth().onAuthStateChanged(subj)));
}

export function useQuery<T>(query: () => Query) {
  return useObservable(() =>
    queryUpdates<T>(query()).pipe(filter(x => x && x.docChanges().length > 0)),
  );
}
