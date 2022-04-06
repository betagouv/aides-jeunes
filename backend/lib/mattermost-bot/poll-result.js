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

function postPollResult(simulation, answers) {
  if (answers.length == 0) {
    return
  }
  const score = {
    asked: [":icon-valid:", "Demande réussie"],
    failed: [":icon-danger:", "Demande échouée"],
    nothing: [":icon-warning:", "Aucune demande"],
    already: [":icon-info:", "Déjà perçue"],
  }
  const orderedAnswers = []
  for (let benefit of simulation.benefits) {
    let answer =
      answers.filter((element) => {
        return element["id"] == benefit["id"]
      })[0] || {}
    answer.unit = benefit.unit
    answer.amount = benefit.amount
    orderedAnswers.push(answer)
  }
  const result = [
    `#### Résultat du sondage de suivi d'utilisateur du ${parseCurrentDate()} - [Accéder au suivi](${
      process.env.MES_AIDES_ROOT_URL
    }/accompagnement/${simulation._id})`,
    `${Object.values(score)
      .map((val) => val.join(" "))
      .join("  ")}\n  `,
  ]
  for (let key of orderedAnswers) {
    result.push(
      `${score[key.value] ? score[key.value][0] : ""} [${key.id}](${
        process.env.MES_AIDES_ROOT_URL
      }/aides/${key.id}) ${
        key.unit && typeof key.amount === "number"
          ? `**${key.amount}${key.unit}**`
          : ""
      } ${key.comments.length > 0 ? `*(${key.comments})*` : ""}`
    )
  }

  const json = JSON.stringify({ text: result.join("\n") })
  Mattermost.post(json)
}

module.exports = {
  postPollResult,
}
