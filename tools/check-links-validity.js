const Benefits = require("../data/all")
const axios = require("axios")

// Extrait la liste des liens référencés dans la base de règles
let links = []
Benefits.all.forEach((benefit) => {
  links = links.concat(
    ["link", "instructions", "form", "teleservice"]
      .filter(
        (linkType) => benefit[linkType] && typeof benefit[linkType] === "string"
      )
      .map((linkType) => {
        const link = benefit[linkType]
        return {
          title: benefit.label,
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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// Création d'une queue permettant de paralléliser la vérification des liens
const queue = [...links]
const detectedErrors = []
const simultaneousItems = 5

async function processNextQueueItem() {
  if (queue.length !== 0) {
    await fetchAndReport(queue.shift())
    await processNextQueueItem()
  }
}

async function fetchAndReport({ link, title, editLink, type }) {
  let status = await getHTTPStatus(link)

  // Retry one time in case of timeout
  if (status === 499) {
    await sleep(10000)
    status = await getHTTPStatus(link)
  }
  report({ status, link, title, editLink, type })
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

async function report({ status, link, title, editLink, type }) {
  console.log(status === 200 ? "✅" : "❌", status, link)
  if (status !== 200) {
    detectedErrors.push({ status, link, title, editLink, type })
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

;(async () => {
  await Promise.allSettled(
    Array.from({ length: simultaneousItems }).map(processNextQueueItem)
  )
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
        "Liens invalides :" + detectedErrors.map(({ link }) => `\n- ${link}`)
      )
    }

    console.log("Terminé")
  }
})()
