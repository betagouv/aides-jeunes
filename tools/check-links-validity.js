const fetch = require("node-fetch")
const Benefits = require("../data/all")

// Extrait la liste des liens référencés dans la base de règles
let links = []
Benefits.all.forEach((benefit) => {
  links = links.concat(
    [benefit.link, benefit.instructions, benefit.form, benefit.teleservice]
      .filter((link) => link)
      .map((link) => {
        return {
          title: benefit.label,
          link,
          filepath: `${benefit.source}/${benefit.id}.yml`,
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

async function fetchAndReport({ link, title, filepath }) {
  let status = await getHTTPStatus(link)

  // Retry one time in case of timeout
  if (status === 499) {
    await sleep(10_000)
    status = await getHTTPStatus(link)
  }
  report({ status, link, title, filepath })
}

async function getHTTPStatus(link) {
  const maxTime = 15_000
  const controller = new AbortController()
  setTimeout(() => controller.abort(), maxTime)

  try {
    const res = await fetch(link, { signal: controller.signal })
    return res.status
  } catch (err) {
    return 499
  }
}

async function report({ status, link, title, filepath }) {
  console.log(status === 200 ? "✅" : "❌", status, link)
  if (status !== 200) {
    detectedErrors.push({ status, link, title, filepath })
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

			| Aide | Status HTTP | Lien de modification |
			|---|---|---|
			${detectedErrors
        .map(
          ({ status, title, link, filepath }) =>
            `| [${title}](${link}) | ${status} | [https://github.com/betagouv/aides-jeunes/blob/master/data/benefits/${filepath}](✎ Modifier) |`
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
