import * as React from 'react';

import { fetchAndUpdateCurrentBells } from './database';
import { usePromise } from './use-helpers';

export default () => {
  const bells = usePromise(() => fetchAndUpdateCurrentBells());

  const content = bells.mapOrElse(
    "Couldn't load the bells!",
    b => b ? `Adeline has ${b} Bells!` : 'Counting how many bells Adeline has!');

  return (
    <h1>{content}</h1>
  );
};
