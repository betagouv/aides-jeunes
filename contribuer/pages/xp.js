import Head from "next/head"
import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"

import yaml from "js-yaml"

import Form from "@rjsf/mui"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"

import d from "./schema.json"

const log = (type) => console.log.bind(console, type)

function Home() {
  const urlSchema = {
    type: "object",
    properties: {
      url: { type: "string" },
    },
  }
  const [urlData, setUrlData] = useState()

  const [mappingSchema, setMappingSchema] = useState()
  const [mappingData, setMappingData] = useState()
  /*
  useEffect(() => {
    fetch("/admin/json_schema_config.yml")
      .then((r) => r.text())
      .then((t) => yaml.load(t))
      .then((d) => {
        setSchema(d.collections[0].schema)
      })
    netlifyIdentity.init()
  }, [])
*/
  useEffect(() => {
    if (urlData?.url) {
      const fetchData = async () => {
        /*        const r = await fetch(urlData.url)
        const data = await r.json()*/
        const data = d
        const fields = data.revision.champDescriptors

        const properties = fields.reduce((a, v) => {
          a[v.id] = {
            title: `${v.label} - ${v.id}`,
            type: "string",
            description: v.description,
          }
          return a
        }, {})
        setMappingSchema({
          type: "object",
          properties,
        })
        setMappingData()
      }
      fetchData()
    }
  }, [urlData])

  async function updateData(form) {
    /*if (form.url != formData.url) {
      form.fields = [null, null, null]
    }//*/

    setFormData(form)
  }

  const uiSchema = {
    "ui:order": [
      "label",
      "prefix",
      "imgSrc",
      "institution",
      "description",
      "*",
      "password",
    ],
    prefix: {
      "ui:title": "Surname",
    },

    "ui:submitButtonOptions": {
      norender: true,
    },
  }

  return (
    <>
      <Head>
        <title>Comment contribuer à Mes Aides ?</title>
        <meta name="description" content="Comment contribuer à Mes Aides ?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {urlSchema && (
        <>
          <Form
            schema={urlSchema}
            uiSchema={uiSchema}
            validator={validator}
            formData={urlData}
            onChange={(e) => setUrlData(e.formData)}
            onSubmit={log("submitted")}
            onError={log("errors")}
          />
          <code>{JSON.stringify(urlData, null, 2)}</code>
        </>
      )}
      {mappingSchema && (
        <>
          <Form
            schema={mappingSchema}
            uiSchema={uiSchema}
            validator={validator}
            formData={mappingData}
            onChange={(e) => setMappingData(e.formData)}
            onSubmit={log("submitted")}
            onError={log("errors")}
          />
          <code>{JSON.stringify(mappingData, null, 2)}</code>
        </>
      )}
    </>
  )
}

export default Home
