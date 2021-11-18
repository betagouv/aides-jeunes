const Ressource = require("./ressource")
const { ressourceTypes } = require("./resources")
const { datesGenerator } = require("./benefits/compute")

const generateDefaultIndividu = (role, id) => ({
  id: id,
  annee_etude: undefined,
  date_naissance: undefined,
  enfant_a_charge: {},
  nationalite: undefined,
  _role: role,
})

const getIndividu = (situation, id) => {
  let individu
  switch (id) {
    case "demandeur": {
      individu = situation.demandeur
      break
    }
    case "conjoint": {
      individu = situation.conjoint
      break
    }
    default: {
      const [role] = id.split("_")
      if (role === "enfant") {
        individu = situation.enfants?.find((enfant) => enfant.id == id)
      }
      break
    }
  }
  return individu
}

function generateSituation(answers, useAll) {
  const dates = datesGenerator(answers.dateDeValeur)
  const situation = {
    dateDeValeur: answers.dateDeValeur,
    version: answers.version,
    demandeur: generateDefaultIndividu("demandeur", "demandeur"),
    enfants: answers?.enfants
      ? answers.enfants.map((enfant, index) => {
          const countDiplay = index + 1
          const _firstName = `votre ${countDiplay}${
            countDiplay === 1 ? "ᵉʳ" : "ᵉ"
          } enfant`

          return {
            ...generateDefaultIndividu("enfant", `enfant_${enfant}`),
            _firstName,
          }
        })
      : null,
    famille: {},
    menage: {
      aide_logement_date_pret_conventionne: "2018-12-31",
    },
    parents: {},
  }

  if (!answers) {
    return situation
  }

  const allAnswers = useAll ? answers.all : answers.current
  allAnswers.forEach((answer) => {
    if (answer.entityName === "individu") {
      if (answer.id === "enfants") {
        answer.value.forEach((response) => {
          const enfant = situation?.enfants.find(
            (enfant) => enfant.id == response.id
          )
          if (enfant) {
            enfant[answer.fieldName] = response.value
          }
        })
      } else {
        const individu = getIndividu(situation, answer.id)
        if (individu) {
          switch (answer.fieldName) {
            case "depcom":
            case "_bourseCriteresSociauxCommuneDomicileFamilial": {
              Object.keys(answer.value).forEach(
                (key) => (individu[key] = answer.value[key])
              )
              break
            }
            case "enfant_a_charge": {
              individu["enfant_a_charge"][dates.thisYear.id] = answer.value
              break
            }
            case "statut_marital": {
              const demandeur = getIndividu(situation, "demandeur")
              // conjointe
              individu["statut_marital"] = answer.value
              demandeur["statut_marital"] = answer.value
              break
            }
            case "ressources": {
              answer.value.forEach((ressource) => {
                Ressource.setDefaultValueForCurrentYear(
                  dates,
                  individu,
                  ressourceTypes.find(
                    (ressourceType) => ressourceType.id === ressource
                  )
                )
              })
              break
            }
            case "rpns":
            case "revenusActivite":
            case "indemnites":
            case "pensions":
            case "autre":
            case "patrimoine":
            case "allocations": {
              const declaredRessources = allAnswers.find(
                (a) =>
                  a.entityName === answer.entityName &&
                  a.id === answer.id &&
                  a.fieldName === "ressources"
              )
              answer.value.forEach((ressource) => {
                if (
                  declaredRessources &&
                  declaredRessources.value.includes(ressource.id)
                ) {
                  individu[ressource.id] = ressource.amounts
                }
              })
              break
            }
            default: {
              individu[answer.fieldName] = answer.value
              break
            }
          }
        }
      }
    } else {
      if (answer.fieldName === "depcom" || answer.fieldName === "loyer") {
        Object.keys(answer.value).forEach(
          (key) => (situation[answer.entityName][key] = answer.value[key])
        )
      } else if (answer.fieldName === "en_couple") {
        situation[answer.entityName][answer.fieldName] = answer.value
        if (answer.value) {
          situation.conjoint = generateDefaultIndividu("conjoint", "conjoint")
        } else {
          situation.demandeur.statut_marital = "celibataire"
        }
      } else if (situation[answer.entityName]) {
        situation[answer.entityName][answer.fieldName] = answer.value
      }
    }
  })

  if (answers.ressourcesFiscales) {
    const fiscalYear = dates.fiscalYear.id
    Object.keys(answers.ressourcesFiscales).forEach((individuId) => {
      const individu = getIndividu(situation, individuId)
      if (individu) {
        const ressources = answers.ressourcesFiscales[individuId]
        Object.keys(ressources).forEach((ressource) => {
          individu[ressource] = Object.assign({}, individu[ressource], {
            [fiscalYear]: ressources[ressource],
          })
        })
      }
    })
  }

  if (answers.patrimoine) {
    const periodKey = "month:2012-01:120"
    Object.keys(answers.patrimoine).forEach((key) => {
      situation.demandeur[key] = { [periodKey]: answers.patrimoine[key] }
    })
  }

  return situation
}

module.exports = {
  generateSituation,
}
