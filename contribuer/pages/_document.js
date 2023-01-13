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
                    var _paq = (window._paq = window._paq || [])
                    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                    _paq.push(["trackPageView"])
                    _paq.push(["enableLinkTracking"])
                    ;(function () {
                      var u = "https://stats.data.gouv.fr/"
                      _paq.push(["setTrackerUrl", ${`$\{u}piwik.php`}])
                      _paq.push(["setSiteId", "240"])
                      var d = document,
                        g = d.createElement("script"),
                        s = d.getElementsByTagName("script")[0]
                      g.async = true
                      g.src = ${`$\{u}piwik.js`}
                      s.parentNode.insertBefore(g, s)
                    })()
                  `,
              }}
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
