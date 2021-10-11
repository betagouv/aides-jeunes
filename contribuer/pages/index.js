import Head from "next/head"
import { Component, useEffect } from "react"
import netlifyIdentity from "netlify-identity-widget"
import { attributes, react as HomeContent } from "../content/home.md"
import tasks from "../lib/tasks"

function Home() {
  let { title } = attributes
  useEffect(() => {
    netlifyIdentity.init()
  })

  return (
    <>
      <style jsx>{`
        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }
      `}</style>
      <Head></Head>
      <article>
        <HomeContent />
      </article>
    </>
  )
}

export default Home
