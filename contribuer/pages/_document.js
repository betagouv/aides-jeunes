import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {process.env.NODE_ENV === "production" && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    const _paq = _paq || [];
                    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                    _paq.push(['trackPageView']);
                    _paq.push(['enableLinkTracking']);
                    (function() {
                      const u="//stats.data.gouv.fr/";
                      _paq.push(['setTrackerUrl', u+'piwik.php']);
                      _paq.push(['setSiteId', '25']);
                      const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
                    })();
                  `,
              }}
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
          <footer>
            <p>
              Dans tous les cas, nous sommes à votre disposition par{" "}
              <a href="mailto:aides-jeunes@beta.gouv.fr&subject=Contribuer">
                email
              </a>
              .
            </p>
            <p>L’équipe du simulateur d’aides pour les jeunes</p>
          </footer>
        </body>
      </Html>
    )
  }
}

export default MyDocument
