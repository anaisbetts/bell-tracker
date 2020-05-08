import * as React from 'react';
import { useMemo } from 'react';

import { Button } from '@material-ui/core';

import RequireGoogleAuth from './require-google-auth';

import { ActivityDefinition, addBellEvent, listenCurrentBells, activityListColl, useBellEventsForToday, BellEvent, eventsColl, deleteBellEvent } from './database';
import { useObservable } from './use-helpers';
import { useQuery } from './when-firebase';
import { firestore } from 'firebase';

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

const ActivityButtonSection: React.FC<{ currentBells: number, label: string, items: firestore.DocumentSnapshot<ActivityDefinition>[] }> = ({ currentBells, label, items }) => {
  const list = itemsIntoRows(items, 2).map(xs =>  {
    const btns = xs.map(x => {
      const d = x.data()!;
      return <li key={x.id}>
        <Button disabled={d.isSpend && currentBells + d.value < 0} variant="contained" color="primary" key={x.id} onClick={() => addBellEvent(x.id)}>
          {d.description}
        </Button>
      </li>;
    });

    return btns;
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
};

const EventsList: React.FC<{events: firestore.DocumentSnapshot<BellEvent>[], activities: firestore.DocumentSnapshot<ActivityDefinition>[]}> = ({events, activities}) => {
  const activityLookup = useMemo(() => activities.reduce((acc, x) => {
    acc[x.id] = x.data()!;
    return acc;
  }, {}), [activities]);

  const items = events.reduce((acc: JSX.Element[], x) => {
    const del = () => deleteBellEvent(x.id);

    acc.push(
      <li key={x.id + "desc"}>{activityLookup[x.data()!.activityId.id].description}</li>,
      <li style={{justifySelf: 'right', alignSelf: 'center'}} key={x.id + "val"}>{x.data()!.value}</li>,
      <Button key={x.id + "btn"} onClick={del} style={{justifySelf: 'right', minWidth: 8, alignSelf: 'center'}}>❌</Button>
    );

    return acc;
  }, []);

  return <>
    <ul>{items}</ul>

    <style jsx>{`
      ul {
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-template-rows: auto;

        justify-items: start;
        align-items: center;

        padding: 16px;
        grid-gap: 4px;
        border-radius: 8px;
        background: #ffffff44;

        margin-top: 16px;
      }

      h4 {
        align-self: start;
      }
    `}</style>
  </>;
};

export default () => {
  const bells = useObservable(() => listenCurrentBells());
  const activityColl = useQuery<ActivityDefinition>(() => activityListColl());
  const eventsColl = useBellEventsForToday();

  const activityMarkup = bells.and(eventsColl).and(activityColl).mapOrElse(
    <h2>Error loading activities!</h2>,
    (xs) => {
      if (bells.isUndefined() || activityColl.isUndefined()) {
        return <h2>Loading...</h2>;
      }

      const gaining = xs!.docs.filter(x => x.data()!.value > 0);
      const losing = xs!.docs.filter(x => x.data().value < 0 && !x.data().isSpend);
      const spending = xs!.docs.filter(x => x.data().isSpend);

      const bellCount = bells.ok()!;

      const events = eventsColl.ok() ? eventsColl.ok()!.docs : [];
      return <>
        <h2>Adeline has {bellCount} bells!</h2>

        <EventsList events={events} activities={activityColl.ok()!.docs} />

        <ActivityButtonSection currentBells={bellCount} label="Add Bells" items={gaining} />
        <ActivityButtonSection currentBells={bellCount} label="Take Bells" items={losing} />
        <ActivityButtonSection currentBells={bellCount} label="Spend Bells" items={spending} />
      </>
    });

  return (
    <RequireGoogleAuth>
      {activityMarkup}
    </RequireGoogleAuth>
  );
};
