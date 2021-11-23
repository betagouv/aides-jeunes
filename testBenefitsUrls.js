const axios = require("axios")
const subject = require("./data/all")

let links = []
let done = 0

subject.all.forEach((benefit) => {
  links = links.concat(
    [benefit.link, benefit.instructions, benefit.form, benefit.teleservice]
      .filter((link) => link)
      .map((link) => {
        return {
          benefitId: benefit.id,
          url: link,
        }
      })
  )
})

links.forEach((link) => {
  axios
    .get(link.url)
    .then(() => {
      done += 1
      console.log(`[${done} / ${links.length}] Ok ${link.benefitId}`)
    })
    .catch(() => {
      done += 1
      console.log(
        `[${done} / ${links.length}] Warning ${link.benefitId} lien potentiellement invalide: ${link.url}`
      )
    })
})
