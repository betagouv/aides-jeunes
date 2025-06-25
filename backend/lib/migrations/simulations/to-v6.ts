/*
 * Supprime le field nombre_enfants qui n'est plus utilisé
 */

const VERSION = 6

function removeOldField(answers, field) {
  const newAnswers = answers[field].filter(
    (answer) => answer.fieldName !== "nombre_enfants",
  )
  answers.set(field, newAnswers, { strict: true })
}

export default {
  apply(simulation) {
    removeOldField(simulation.answers, "all")
    removeOldField(simulation.answers, "current")
    return simulation
  },
  version: VERSION,
}
