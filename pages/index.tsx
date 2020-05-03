import * as React from 'react';

import dynamic from 'next/dynamic';
import PageContainer from '../components/page-container';

// tslint:disable-next-line:variable-name
const SSRIsAStupidFeatureThatIsMoreTroubleThanItsWorth = dynamic(() => import('../components/index'), {
  ssr: false,
});

export default () => (
  <>
    <style jsx global>{`
      .container {
        padding: 128px;
      }
    `}</style>


    <PageContainer>
      <SSRIsAStupidFeatureThatIsMoreTroubleThanItsWorth />
    </PageContainer>
  </>
);
