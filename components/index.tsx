import * as React from 'react';
import RequireGoogleAuth from './require-google-auth';
import PageContainer from './page-container';

export default () => {
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
      `}</style>

      <RequireGoogleAuth>
        <PageContainer>
          <h2>Hi.</h2>
        </PageContainer>
      </RequireGoogleAuth>
    </>
  );
}