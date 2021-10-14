/*
 * Renomme activite `actif` en `salarie` ou `independant`
 */

const VERSION = 4

const resources = require("../../../src/constants/resources")

const ressourcesIndependant = resources.ressourceTypes.filter(
  (r) => r.category == "rpns"
)

function updatePerson(p) {
  if (!p || p.activite !== "actif") {
    return p
  }
  if (ressourcesIndependant.some((ressource) => p[ressource.id])) {
    p.activite = "independant"
  } else {
    p.activite = "salarie"
  }

  return p
}

module.exports = {
  function: function (situation) {
    situation.demandeur = updatePerson(situation.demandeur)
    situation.conjoint = updatePerson(situation.conjoint)

    return situation
  },
  version: VERSION,
}
