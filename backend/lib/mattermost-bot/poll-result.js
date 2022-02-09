const Mattermost = require("./mattermost")

function parseCurrentDate() {
  const isoDateTime = new Date(Date.now())
  return `${isoDateTime.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} à ${isoDateTime.toLocaleTimeString("fr-FR")}`
}

function postPollResult(answers) {
  if (answers.length == 0) {
    return
  }
  const score = {
    asked: [":icon-valid:", "Demande réussie"],
    failed: [":icon-danger:", "Demande échouée"],
    nothing: [":icon-warning:", "Aucune demande"],
    already: [":icon-info:", "Déjà perçue"],
  }
  const result = [
    `#### Résultat du sondage de suivi d'utilisateur du ${parseCurrentDate()}`,
    `${Object.values(score)
      .map((val) => val.join(" "))
      .join("  ")}\n  `,
  ]
  for (let key of answers) {
    result.push(
      `${score[key.value][0]} ${key.id} ${
        key.comments.length > 0 ? `*(${key.comments})*` : ""
      }`
    )
  }

  const json = JSON.stringify({ text: result.join("\n") })
  Mattermost.post(json)
}

module.exports = {
  postPollResult,
}
