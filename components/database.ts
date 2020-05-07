import { db } from './firebase';

import { firestore, auth } from 'firebase/app';
import { seeds } from './seeds';
import { asyncMap } from './promise-extra';

export interface BellAggregate {
  computedAt: firestore.Timestamp;
  value: number;
}

export interface RowBase {
  createdAt: firestore.Timestamp;
  createdBy: string;
}

export interface BellEvent extends RowBase {
  activityId: firestore.DocumentReference;
  value: number;
}

export interface ActivityDefinition extends RowBase {
  description: string;
  value: number;
  isSpend: boolean;
}

export function currentBellsDoc() {
  return db.doc('aggregates/bellValues');
}

export function activityListColl() {
  return db.collection('activity-options');
}

export function currentUserName() {
  return auth().currentUser?.email;
}

export async function fetchAndUpdateCurrentBells() {
  const existingAggregate = await (currentBellsDoc().get());
  const currentBells = existingAggregate.data() as BellAggregate;

  const eventsSince = await db.collection('events').where('createdAt', '>=', currentBells.computedAt).get();
  if (eventsSince.docs.length === 0) {
    console.log('No changes to bells since last aggregate!');
    return currentBells.value;
  }

  const newBells = eventsSince.docs
    .reduce((acc, x) => acc += (x.data() as BellEvent).value, currentBells.value);

  currentBellsDoc().update({
    computedAt: new Date(),
    value: newBells,
  }).then(
    _ => console.log(`Updated bell aggregate: ${newBells}`),
    ex => console.error(`Failed to update bell aggregate: ${ex.message}`));

  return newBells;
}

export async function populateFromSeeds() {
  const coll = db.collection('activity-options');
  const user = currentUserName();

  if (!user) {
    throw new Error("Must be authenticated!");
  }

  const ret = await asyncMap(seeds, x => coll.add({
    ...x,
    createdAt: new Date(),
    createdBy: user,
  }));

  return Array.from(ret.values());
}