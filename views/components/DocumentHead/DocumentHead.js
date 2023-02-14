import { usePageMeta } from "@ktwebsite/hooks";
import { Head } from "@react-ssr/express";
import React from "react";

const DocumentHead = (props) => {
  const { children } = props;

  const meta = usePageMeta();

  return (
    <Head>
      <title>{meta.title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <meta http-equiv="Content-Security-Policy" content="default-src *;
        img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
        style-src  'self' 'unsafe-inline' *" />

      <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/assets/favicon/manifest.json" />
      <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
      <meta name="msapplication-config" content="/assets/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />

      {children}
    </Head>
  );
};

export default DocumentHead;
