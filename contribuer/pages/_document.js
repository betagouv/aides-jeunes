import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head></Head>
      <body>
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
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
