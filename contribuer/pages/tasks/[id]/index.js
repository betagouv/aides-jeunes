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

  return (
    <>
      <article>
        <h1>{task.attributes.title}</h1>
        <task.react />
      </article>
      <div>
        <a href="/">Revenir à la liste</a>
      </div>
    </>
  )
}

export default Task
