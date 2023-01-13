import Head from "next/head"
import { useEffect } from "react"
import netlifyIdentity from "netlify-identity-widget"

function Home() {
  useEffect(() => {
    netlifyIdentity.init()
  })

  return (
    <>
      <Head>
        <title>Comment contribuer à Mes Aides ?</title>
        <meta name="description" content="Comment contribuer à Mes Aides ?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Comment contribuer à Mes Aides ?</h1>
        <h2>Bienvenue</h2>
        <p>
          Nous avons mis en place ce site pour faciliter la contribution du plus
          grand nombre 🌍.
        </p>
        <h3>
          <a href="/admin/#/">
            C’est par ici pour accéder à l’outil de contribution
          </a>
        </h3>
      </main>
    </>
  )
}

export default Home
