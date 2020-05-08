import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
          <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap' rel='stylesheet'></link>
          <link rel="manifest" href="/manifest.json"></link>

          <meta name='application-name' content='Bells Tracker' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Bells Tracker' />
          <meta name='description' content='Like Tom Nook motherfucker' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content='#4f6bbf' />
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}