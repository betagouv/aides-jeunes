const axios = require("axios")
const subject = require("./data/all")

let links = []
let done = 0
const levels = ["prestationsNationales", "partenairesLocaux"]
levels.forEach((level) => {
  Object.keys(subject[level]).forEach(function (providerName) {
    const provider = subject[level][providerName]
    Object.keys(provider.prestations).forEach(function (aideName) {
      const aide = provider.prestations[aideName]
      links = links.concat(
        [aide.link, aide.instructions, aide.form, aide.teleservice]
          .filter((link) => link)
          .map((link) => {
            return {
              aideName: aideName,
              url: link,
            }
          })
      )
    })
  })
})

links.forEach((link) => {
  axios
    .get(link.url)
    .then(() => {
      done += 1
      console.log(`[${done} / ${links.length}] Ok ${link.aideName}`)
    })
    .catch(() => {
      done += 1
      console.log(
        `[${done} / ${links.length}] Warning ${link.aideName} lien potentiellement invalide: ${link.url}`
      )
    })
})
