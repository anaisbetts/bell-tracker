import * as React from 'react';
import { useLayoutEffect } from 'react';

import Head from 'next/head';

import {
  BACKGROUND_COLOR, TEXT_ON_BACKGROUND_COLOR,
} from './size-constants';

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

  .container {
    font-family: "Source Sans Pro", Arial;
    font-size: 1.35em;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);

    display: flex;
    flex-direction: column;
    align-items: center;
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
  useLayoutEffect(() => {
    const fix = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', fix);
    fix();
  });

  return (
    <>
      <Head>
        <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
      </Head>

      {stylesheet}

      <div className='container backgroundImage'>
        {children}
      </div>
    </>
  );
};

export default PageContainer;
