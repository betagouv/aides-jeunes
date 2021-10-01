var { Step } = require("./steps")
var { generateBlocks } = require("./blocks")

function processBlock({ journey, subject, situation, isActive }, b) {
  if (b instanceof Step) {
    b.isActive = isActive
    journey.push(b)
  } else if (typeof b == "string") {
    console.warn(`string step should no longer be used: ${b}`)
    journey.push({ isActive, path: b })
  } else {
    if (!b.steps) {
      throw Error("" + b + " (" + (b instanceof Array ? "array" : "?") + ")")
    }
    let blockSubject = b.subject
      ? b.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!b.isActive || (blockSubject && b.isActive(blockSubject, situation)))
    b.steps.forEach((s) =>
      processBlock(
        { journey, subject: blockSubject, situation, isActive: localActive },
        s
      )
    )
  }
}

function generateJourney(situation) {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ situation })
  } catch (e) {
    console.log("error", e)
  }
}

const generateDefaultIndividu = (role, id) => ({
  id: id,
  annee_etude: undefined,
  date_naissance: undefined,
  bourse_criteres_sociaux_echelon: -1,
  enfant_a_charge: {},
  nationalite: undefined,
  _role: role,
})

function generateSituation(answers) {
  const situation = {
    _id: null,
    external_id: null,
    dateDeValeur: new Date(),
    demandeur: generateDefaultIndividu("demandeur", "demandeur"),
    enfants:
      answers && answers.enfants && answers.enfants.length > 0
        ? answers.enfants.map((enfant) => {
            return generateDefaultIndividu("enfant", `enfant_${enfant}`)
          })
        : null,
    famille: {
      en_couple: answers && answers.conjoint,
    },
    conjoint:
      answers && answers.conjoint
        ? generateDefaultIndividu("conjoint", "conjoint")
        : undefined,
    logement: {},
    foyer_fiscal: {},
    menage: {
      aide_logement_date_pret_conventionne: "2018-12-31",
    },
    parents: {},
    version: 3,
  }

  if (!answers) {
    return situation
  }

  answers.current.forEach((answer) => {
    switch (answer.entityName) {
      case "individu": {
        switch (answer.id) {
          case "demandeur": {
            situation.demandeur[answer.fieldName] = answer.value
            break
          }
          case "conjoint": {
            situation.conjoint[answer.fieldName] = answer.value
            break
          }
          default:
            {
              const [role] = answer.id.split("_")
              if (role === "enfant") {
                const enfant =
                  situation.enfants &&
                  situation.enfants.find((enfant) => enfant.id == answer.id)
                if (enfant) {
                  enfant[answer.fieldName] = answer.value
                }
              }
            }
            break
        }
        break
      }
      case "menage": {
        situation.menage[answer.fieldName] = answer.value
        break
      }
      default: {
        console.log("answer.entityName", answer)
        break
      }
    }
  })

  return situation
}

function generateAllSteps(situation) {
  const fullSteps = generateJourney(situation)
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
