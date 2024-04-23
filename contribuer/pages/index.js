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
          <a href="/admin/index.html">Outil de contribution</a>
        </h3>
        <h3>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://drive.google.com/drive/folders/1dSsjM6LmLkaPPTe6aNLODtKcfeIruMlG"
          >
            Guides de contribution (nouvelle fenêtre)
          </a>
        </h3>
        <br />
        <h4>
          Tutoriel vidéo pour ajouter une aide dans l’outil de contribution ⬇️
        </h4>
        <video width="600" controls preload="auto">
          <source
            src="https://betagouv.github.io/aides-jeunes-files/public/demo-outil-contribution.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </main>
    </>
  )
}

export default Home
