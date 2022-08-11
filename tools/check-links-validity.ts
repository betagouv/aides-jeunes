import Benefits from "../data/all.js"
import axios from "axios"
import fs from "fs"
import Bluebird from "bluebird"

// Extrait la liste des liens référencés dans la base de règles
let links = []
Benefits.all.slice(0, 2).forEach((benefit) => {
  links = links.concat(
    ["link", "instructions", "form", "teleservice"]
      .filter(
        (linkType) => benefit[linkType] && typeof benefit[linkType] === "string"
      )
      .map((linkType) => {
        const link = benefit[linkType]
        return {
          benefit: benefit.id,
          title: `${benefit.label} (${benefit.institution.label})`,
          link,
          type: linkType,
          editLink: ["openfisca", "javascript"].includes(benefit.source)
            ? `https://contribuer-aides-jeunes.netlify.app/admin/#/collections/benefits_${benefit.source}/entries/${benefit.id}`
            : undefined,
        }
      })
  )
})

// Certains sites référencés ont des problèmes de certificats, mais ce n'est pas
// ce que nous cherchons à détecter ici.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

async function fetchAndReport({ benefit, link, title, editLink, type }) {
  let status = await getHTTPStatus(link)

  // Retry one time in case of timeout
  if (status === 499) {
    await sleep(10000)
    status = await getHTTPStatus(link)
  }
  return report({ benefit, status, link, title, editLink, type })
}

async function getHTTPStatus(link) {
  try {
    const res = await axios.get(link, {
      timeout: 15000,
    })
    return res.status
  } catch (err) {
    return err.response?.status || 499
  }
}

function report({ benefit, status, link, title, editLink, type }) {
  console.log(status === 200 ? "✅" : "❌", status, link)
  if (status !== 200) {
    return { benefit, status, link, title, editLink, type }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function main() {
  const results = Bluebird.map(links, fetchAndReport, { concurrency: 5 })
  const detectedErrors = results.filter((i) => i)
  fs.writeFileSync("link-tests.json", JSON.stringify(detectedErrors, null, 2))
  if (detectedErrors.length > 0) {
    // Formattage spécifique pour récupérer le résultat avec l'action Github
    if (process.argv.slice(2).includes("--ci")) {
      const message = `

			Certains liens référencés ne semblent plus fonctionner :

			| Aide | Type | Status HTTP | Lien de modification |
			|---|---|---|---|
			${detectedErrors
        .map(
          ({ status, title, link, editLink, type }) =>
            `| [${title}](${link}) | ${type} | ${status} | ${
              editLink ? `[✎ Modifier](${editLink})` : ""
            } |`
        )
        .join("\n")}`

      const format = (msg) =>
        msg
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .join("<br />")
      console.log(`::set-output name=comment::${format(message)}`)
    } else if (detectedErrors) {
      console.log(
        `Liens invalides : ${detectedErrors.map(({ link }) => `\n- ${link}`)}`
      )
    }

    console.log("Terminé")
  }
}

main()
