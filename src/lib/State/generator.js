var { Step } = require("./steps")
var { generateBlocks } = require("./blocks")
var Ressource = require("@/lib/Ressource").default
var { ressourceTypes } = require("@/constants/resources")

function processBlock(
  { journey, subject, situation, isActive, parameters },
  block
) {
  if (block instanceof Step) {
    block.isActive = isActive
    journey.push(block)
  } else if (typeof block == "string") {
    console.warn(`string step should no longer be used: ${block}`)
    journey.push({ isActive, path: block })
  } else {
    if (!block.steps) {
      throw Error(`${block} (${block instanceof Array ? "array" : "?"})`)
    }
    let blockSubject = block.subject
      ? block.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!block.isActive ||
        (blockSubject && block.isActive(blockSubject, situation, parameters)))
    block.steps.forEach((step) =>
      processBlock(
        {
          journey,
          subject: blockSubject,
          situation,
          parameters,
          isActive: localActive,
        },
        step
      )
    )
  }
}

function generateJourney(situation, parameters) {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation, parameters }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true, parameters },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ situation, parameters })
  } catch (e) {
    console.log("error", e)
  }
}

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
        individu =
          situation.enfants &&
          situation.enfants.find((enfant) => enfant.id == id)
      }
      break
    }
  }
  return individu
}

function generateSituation(answers, dates) {
  const situation = {
    dateDeValeur: answers.dateDeValeur,
    version: answers.version,
    demandeur: generateDefaultIndividu("demandeur", "demandeur"),
    enfants:
      answers && answers.enfants
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

  answers.current.forEach((answer) => {
    if (answer.entityName === "individu") {
      if (answer.id === "enfants") {
        answer.value.forEach((response) => {
          const enfant =
            situation.enfants &&
            situation.enfants.find((enfant) => enfant.id == response.id)
          if (enfant) {
            enfant[answer.fieldName] = response.value
          }
        })
      } else {
        const individu = getIndividu(situation, answer.id)
        if (individu) {
          switch (answer.fieldName) {
            case "depcom": {
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
              answer.value.forEach((ressource) => {
                individu[ressource.id] = ressource.amounts
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
      if (answer.fieldName === "depcom") {
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
      } else {
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
          individu[ressource] = { [fiscalYear]: ressources[ressource] }
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

function generateAllSteps(situation, parameters) {
  const fullSteps = generateJourney(situation, parameters)
  fullSteps.pop()
  let lastChapter
  return fullSteps.map((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
    return s
  })
}

module.exports = {
  generateAllSteps,
  generateSituation,
}
