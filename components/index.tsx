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
        ul {
          margin: 0;
          padding: 0;
          list-style-type: none
        }

        .container {
          padding: 128px;
          height: 100vw;
        }

        a {
          color: inherit;
        }

        ul {
          overflow-y: auto;
        }

        .MuiButtonBase-root {
          border-radius: 16px !important;
        }
      `}</style>

      <PageContainer>
        <h1>{content}</h1>
      </PageContainer>
    </>
  );
};
