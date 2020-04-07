import { db } from './firebase';

import { firestore } from 'firebase/app';

export interface BellAggregate {
  computedAt: firestore.Timestamp;
  value: number;
}

export interface BellEvent {
  activityId: firestore.DocumentReference;
  createdAt: firestore.Timestamp;
  value: number;
}

export async function fetchAndUpdateCurrentPoints() {
  const existingAggregate = await db.doc('aggregates/bellValues').get();
  const currentBells =  existingAggregate.data() as BellAggregate;

  const eventsSince = await db.collection('events').where('createdAt', '>=', currentBells.computedAt).get();
  if (eventsSince.docs.length === 0) {
    console.log('No changes to bells since last aggregate!');
    return currentBells;
  }

  const newBells = eventsSince.docs
    .reduce((acc, x) => acc += (x.data() as BellEvent).value, currentBells.value);

  db.doc('aggregates/bellValues').update({
    computedAt: new Date(),
    value: newBells,
  }).then(
    _ => console.log(`Updated bell aggregate: ${newBells}`),
    ex => console.error(`Failed to update bell aggregate: ${ex.message}`));

  return newBells;
}
