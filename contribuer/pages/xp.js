import Head from "next/head"
import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"

import yaml from "js-yaml"

import Form from "@rjsf/mui"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"

const log = (type) => console.log.bind(console, type)

function Home() {
  const [schema, setSchema] = useState()
  useEffect(() => {
    fetch("/admin/json_schema_config.yml")
      .then((r) => r.text())
      .then((t) => yaml.load(t))
      .then((d) => {
        setSchema(d.collections[1].schema)
      })
    netlifyIdentity.init()
  }, [])

  return (
    <>
      <Head>
        <title>Comment contribuer à Mes Aides ?</title>
        <meta name="description" content="Comment contribuer à Mes Aides ?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {schema && (
        <Form
          schema={schema}
          validator={validator}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")}
        />
      )}
    </>
  )
}

export default Home
