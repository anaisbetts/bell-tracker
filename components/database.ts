import { db } from './firebase';

import { firestore, auth } from 'firebase/app';
import { seeds } from './seeds';
import { asyncMap } from './promise-extra';
import { listenDocument, useQuery } from './when-firebase';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface BellAggregate {
  computedAt: firestore.Timestamp | Date;
  value: number;
};

export interface RowBase {
  createdAt: firestore.Timestamp | Date;
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

export function eventsColl() {
  return db.collection('events');
}

export function currentUserName() {
  return auth().currentUser?.email;
}

export function listenCurrentBells() {
  return listenDocument(currentBellsDoc()).pipe(
    flatMap(x => x.exists ? of(x.data()!.value as number) : fetchAndUpdateCurrentBells())
  );
}

export function useBellEventsForToday() {
  let now = new Date();
  const toSubtract = 
    (now.getHours() * 60 * 60 * 1000) +
    (now.getMinutes() * 60 * 1000);
  const time = new Date(now.getTime() - toSubtract);

  return useQuery<BellEvent>(() => eventsColl().where('createdAt', '>=', time));
}

function seedNewAggregate() {
  return currentBellsDoc().set({
    value: 0,
    computedAt: new Date(0)
  });
}

export async function fetchAndUpdateCurrentBells(): Promise<number> {
  const existingAggregate = await (currentBellsDoc().get());

  if (!existingAggregate.exists) {
    await seedNewAggregate();
    return await fetchAndUpdateCurrentBells();
  }

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

export async function addBellEvent(activityId: string) {
  const user = currentUserName();

  if (!user) {
    throw new Error("Must be authenticated!");
  }

  const activity = await activityListColl().doc(activityId).get() as firestore.DocumentSnapshot<ActivityDefinition>;
  if (!activity.exists) {
    throw new Error("Can't add bell event, the activity doesn't exist!");
  }

  const newEvent: BellEvent = {
    activityId: activity.ref,
    createdAt: new Date(),
    createdBy: user,
    value: activity.data()!.value
  };

  const ret = await eventsColl().add(newEvent);
  await fetchAndUpdateCurrentBells();

  return ret;
}

export async function deleteBellEvent(eventId: string) {
  const ev  = await eventsColl().doc(eventId).get() as firestore.DocumentSnapshot<BellEvent>;
  if (!ev.exists) {
    throw new Error("Event doesn't exist!");
  }

  const bells = await fetchAndUpdateCurrentBells();
  await currentBellsDoc().update({
    computedAt: new Date(),
    value: bells - ev.data()!.value,
  });

  await ev.ref.delete();
  await fetchAndUpdateCurrentBells();
}

export async function populateFromSeeds() {
  const user = currentUserName();

  if (!user) {
    throw new Error("Must be authenticated!");
  }

  const coll = activityListColl();
  const ret = await asyncMap(seeds, x => coll.add({
    ...x,
    createdAt: new Date(),
    createdBy: user,
  }));

  return Array.from(ret.values());
}