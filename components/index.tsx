import * as React from 'react';

import PageContainer from './page-container';

import { fetchAndUpdateCurrentBells } from './database';
import { usePromise } from './use-helpers';

export default () => {
  const bells = usePromise(() => fetchAndUpdateCurrentBells());

  const content = bells.mapOrElse(
    "Couldn't load the bells!",
    b => b ? `Adeline has ${b} Bells!` : 'Counting how many bells Adeline has!');

  return (
    <>
      <style jsx global>{`
        .container {
          padding: 128px;
        }
      `}</style>

      <PageContainer>
        <h1>{content}</h1>
      </PageContainer>
    </>
  );
};
