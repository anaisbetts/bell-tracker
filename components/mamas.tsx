import * as React from 'react';

import { Button } from '@material-ui/core';

import RequireGoogleAuth from './require-google-auth';

import { db } from './firebase';

import { fetchAndUpdateCurrentBells, ActivityDefinition, populateFromSeeds } from './database';
import { usePromise } from './use-helpers';
import { useQuery } from './when-firebase';

function itemsIntoRows<T>(items: T[], count: number): Array<Array<T>> {
  const ret: Array<Array<T>> = [];
  let current: T[] = [];

  for (let i=0; i < items.length; i++) {
    current.push(items[i]);

    if (current.length >= count) {
      ret.push(current);
      current = [];
    }
  }

  if (current.length > 0) {
    ret.push(current);
  }

  return ret;
}

interface HasDocumentId {
  id: string
};

const ActivityButtonSection: React.FC<{ label: string, items: (ActivityDefinition & HasDocumentId)[] }> = ({ label, items }) => {
  const list = itemsIntoRows(items, 2).map(xs =>  {
    const btns = xs.map(x => 
      <li key={x.description}>
        <Button variant="contained" color="primary" key={x.id}>
          {x.description}
        </Button>
      </li>);

    return <>{btns}</>;
  });

  return <>
    <h4>{label}</h4>
    <ul>{list}</ul>

    <style jsx>{`
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;

        justify-items: center;
        align-items: center;

        padding: 16px;
        grid-gap: 12px;
        border-radius: 8px;
        background: #ffffff44;
      }

      h4 {
        align-self: start;
      }
    `}</style>
    </>;
}

export default () => {
  const bells = usePromise(() => fetchAndUpdateCurrentBells());
  const activityColl = useQuery<ActivityDefinition>(() => db.collection('activity-options'));

  const activities = activityColl.map(xs => {
    if (!xs) return [];
    return xs.docs.map(x => ({
      id: x.id,
      ...x.data()
    }));
  });

  const activityMarkup = activities.mapOrElse(
    <h2>Error loading activities!</h2>,
    (xs) => {
      const gaining = xs.filter(x => x.value > 0);
      const losing = xs.filter(x => x.value < 0 && !x.isSpend);
      const spending = xs.filter(x => x.isSpend);

      return <>
        <ActivityButtonSection label="Add Bells" items={gaining} />
        <ActivityButtonSection label="Take Bells" items={losing} />
        <ActivityButtonSection label="Spend Bells" items={spending} />
      </>
    });

  return (
    <RequireGoogleAuth>
      <h2>Add some Bells!</h2>
      {activityMarkup}
    </RequireGoogleAuth>
  );
};
