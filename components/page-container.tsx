import * as React from 'react';
import { useLayoutEffect } from 'react';

import Head from 'next/head';

import {
  BACKGROUND_COLOR, TEXT_ON_BACKGROUND_COLOR,
} from './size-constants';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const backgrounds = ['endless-clouds.svg', 'topography.svg'];

const directionX = Math.random() > 0.5 ? 1 : -1;
const directionY = Math.random() > 0.5 ? 1 : -1;

function randomElement<T>(items: T[]) {
  return items[Math.floor((Math.random() * items.length))];
}

const stylesheet = (<style jsx global>{`
  body,html,main,aside,footer,h1,h2 {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  @keyframes animatedBackground {
    from {
      background-position: 0 0;
    }
    to {
      background-position: ${(Math.random() * 50 + 50) * directionX}% ${(Math.random() * 50 + 50) * directionY}%;
    }
  }

  .backgroundImage {
    background: ${BACKGROUND_COLOR};
    background-image: url('/static/${randomElement(backgrounds)}');
    color: ${TEXT_ON_BACKGROUND_COLOR};

    background-position: 0px 0px;
    background-repeat: repeat-x repeat-y;
    animation: animatedBackground 120s linear infinite alternate;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none
  }

  a {
    color: inherit;
  }

  .MuiButtonBase-root {
    border-radius: 16px !important;
  }

  .container {
    font-family: "Source Sans Pro", Arial;
    font-size: 1.35em;
    height: 100vh;
  }

  .container h1,h2,h3,h4,h5 {
    filter: drop-shadow(4px 2px 4px #444);
    font-family: Pacifico;
  }

  .container h2 {
    margin-bottom: 2px;
    font-size: 1.5rem;
    padding-right: 4px;
  }
`}</style>);

// tslint:disable-next-line:variable-name
const PageContainer: React.FunctionComponent = ({ children }) => {
  const theme = createMuiTheme({
    palette: {
      primary: purple,
      secondary: green,
    },
    typography: {
      fontFamily: '"Source Sans Pro", Arial',
      button: {
        textTransform: 'none'
      }
    },
  });

  return (
    <>
      <Head>
      </Head>

      {stylesheet}

      <ThemeProvider theme={theme}>
        <div className='container backgroundImage'>
          {children}
        </div>
      </ThemeProvider>
    </>
  );
};

export default PageContainer;
