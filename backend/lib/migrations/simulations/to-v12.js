/*
 * Migre les valeurs de _bourseCriteresSociauxCommuneDomicileFamilial
 */

const VERSION = 12
const VALUE_MAP = {
  _bourseCriteresSociauxCommuneDomicileFamilial: "depcom",
  _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: "_codePostal",
  _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: "_nomCommune",
  _bourseCriteresSociauxCommuneDomicileFamilialDepartement: "_departement",
  _bourseCriteresSociauxCommuneDomicileFamilialRegion: "_region",
  _bourseCriteresSociauxCommuneDomicileFamilialEpci: "_epci",
  _bourseCriteresSociauxCommuneDomicileFamilialEpciType: "_epciType",
}

function updateBourseCriteresSociauxCommuneDomicileFamilial(answers) {
  const answer = answers.find(
    (answer) =>
      answer.id === "demandeur" &&
      answer.entityName === "individu" &&
      answer.fieldName === "_bourseCriteresSociauxCommuneDomicileFamilial"
  )

  if (!answer) return

  const newValue = Object.keys(answer.value).reduce((accum, key) => {
    accum[VALUE_MAP[key]] = answer.value[key]
    return accum
  }, {})

  answer.set("value", newValue, {
    strict: false,
  })
}

module.exports = {
  function: function (simulation) {
    updateBourseCriteresSociauxCommuneDomicileFamilial(simulation.answers.all)
    updateBourseCriteresSociauxCommuneDomicileFamilial(
      simulation.answers.current
    )
    return simulation
  },
  version: VERSION,
}
