import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="sv" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="SuveranKoll – Digital suveränitetsanalys för svenska organisationer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-zinc-950 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
