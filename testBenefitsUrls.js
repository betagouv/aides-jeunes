const axios = require("axios")
const subject = require("./app/js/constants/benefits/back")

const levels = ["prestationsNationales", "partenairesLocaux"]
levels.forEach((level) => {
  Object.keys(subject[level]).forEach(function (providerName) {
    const provider = subject[level][providerName]
    Object.keys(provider.prestations).forEach(function (aideName) {
      const aide = provider.prestations[aideName]
      const links = [
        aide.link,
        aide.instructions,
        aide.form,
        aide.teleservice,
      ].filter((link) => link)

      links.forEach((link) => {
        axios
          .get(link)
          .then(() => {
            console.log(`Ok ${aideName}`)
          })
          .catch((err) => {
            console.log(
              `Warning ${aideName} lien potentiellement invalide: ${link}`
            )
          })
      })
    })
  })
})
