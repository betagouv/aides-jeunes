import Head from "next/head"
import { useRouter } from 'next/router'
import { Component, useEffect } from 'react'
import tasks from '../../../lib/tasks'


export async function getStaticPaths() {
  const paths = tasks.map(task => `/tasks/${task.slug}`)
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { id } = params

  return { props: { id } }
}

function Task ({id}) {
  const task = tasks.find(t => t.slug === id)

  const notFound = () => (<div>
    <h1>{id} not found</h1>
    <pre>
      {JSON.stringify(tasks.map(t => t.slug))}
    </pre>
    <p><a href="/">Retourner à l'accueil</a></p>
  </div>)

  const buildHref = ({url, title, body}) => {
    let params = [];
    if (title) {
      params.push('title=' + encodeURIComponent(title))
    }
    if (body) {
      params.push('body=' + encodeURIComponent(body))
    }
    let comps = [url, params.join('&')]
    return comps.join('?')
  }

  const metaContributionCTA = () => (
    <blockquote>
      Si vous souhaitez modifier les informations disponible sur cette page (corrections, reformations), vous pouvez le faire à partir
      de <a target="_blank" rel="noopener"
        href={`https://github.com/mes-aides/simulateur/edit/master/contribuer/content/tasks/${id}.md`}>
        la page suivante</a>. En cas de difficultés ou d'interrogations,
        vous pouvez nous contacter <a href="mailto:aides-jeunes@beta.gouv.fr&subject=Contribuer">par email</a> ou les
        partager <a target="_blank" rel="noopener"
        href={buildHref({
          url: 'https://github.com/mes-aides/simulateur/issues/new',
          title: `Question sur ${task.attributes.title}`,
          body: 'En contribuant à Mes Aides, je…'
        })}>directement sur GitHub</a>.
    </blockquote>
  )

  return (
    <>
      <article>
        <h1>{task.attributes.title}</h1>
        {metaContributionCTA()}
        <task.react />
      </article>
      <div>
        {metaContributionCTA()}
        <a href="/">Revenir à la liste</a>
      </div>
    </>
  )
}

export default Task
