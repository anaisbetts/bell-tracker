import * as React from 'react';

import { Button } from '@material-ui/core';

import PageContainer from './page-container';
import RequireGoogleAuth from './require-google-auth';

import { db } from './firebase';

import { fetchAndUpdateCurrentBells, ActivityDefinition } from './database';
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

const ActivityButtonSection: React.FC<{ label: string, items: ActivityDefinition[] }> = ({ label, items }) => {
  const list = itemsIntoRows(items, 2).map(xs =>  {
    const btns = xs.map(x => 
      <div className="btnContainer">
        <Button variant="contained" color="primary" key={x.description}>
          {x.description}
        </Button>
      </div>);

    return <li key={xs[0].createdAt.valueOf()}>{btns}</li>
  });

  return <>
    <h3>{label}</h3>
    <ul>{list}</ul>

    <style jsx global>{`
    `}</style>
    </>;
}

export default () => {
  const bells = usePromise(() => fetchAndUpdateCurrentBells());
  const activityColl = useQuery<ActivityDefinition>(() => db.collection('activity-options'));

  const activities = activityColl.map(xs => {
    if (!xs) return [];
    return xs.docs.map(x => x.data());
  });

  const activityMarkup = activities.mapOrElse(
    <h2>Error loading activities!</h2>,
    (xs) => {
      console.log(`activities has ${xs.length} items!`);

      const gaining = xs.filter(x => x.value > 0);
      const losing = xs.filter(x => x.value < 0 && x.isSpend);
      const spending = xs.filter(x => x.isSpend);

      return <>
        <ActivityButtonSection label="Gaining Bells" items={gaining} />
        <ActivityButtonSection label="Losing Bells" items={losing} />
        <ActivityButtonSection label="Spending Bells" items={spending} />
      </>
    });

  return (
    <>
      <style jsx global>{`
        .container {
          padding: 24px;
        }
      `}</style>

      <PageContainer>
        <RequireGoogleAuth>
          <h2>Available Activities</h2>
          {activityMarkup}
        </RequireGoogleAuth>
      </PageContainer>
    </>
  );
};
