const Promise = require("bluebird")
const openfisca = Promise.promisifyAll(require(".."))
const common = require("../mapping/common")

const entityGroups = {
  individus: [],
  familles: ["parents", "enfants"],
  foyers_fiscaux: ["declarants", "personnes_a_charge"],
  menages: ["personne_de_reference", "conjoint", "enfants"],
}

function init() {
  const result = Object.keys(entityGroups).reduce((accum, entityName) => {
    accum[entityName] = {}
    return accum
  }, {})
  result["individus"] = {}

  return result
}

function prefix(prefix, situation) {
  Object.keys(entityGroups).forEach((entityName) => {
    const oldKeys = Object.keys(situation[entityName])
    oldKeys.forEach((name) => {
      situation[entityName][prefix + name] = situation[entityName][name]
      delete situation[entityName][name]
    })

    entityGroups[entityName].forEach((property) => {
      Object.keys(situation[entityName]).forEach((id) => {
        let entity = situation[entityName][id]

        if (entity[property]) {
          entity[property] = entity[property].map((id) => prefix + id)
        }
      })
    })
  })

  return situation
}

function append(acummulator, situation) {
  Object.keys(entityGroups).forEach((entityName) => {
    Object.keys(situation[entityName]).forEach((id) => {
      acummulator[entityName][id] = situation[entityName][id]
    })
  })

  return acummulator
}

const defaultValues = []
const max = 3500
const base = 25
const steps = max / base + 1
for (let i = 0; i < steps; i = i + 1) {
  defaultValues.push((i * max) / (steps - 1))
}

function build(situation, variable, values) {
  values = values || defaultValues
  const periods = common.getPeriods(situation.dateDeValeur)

  const fullTimePeriodLength = 12 * 4
  const fullTimePeriod =
    "month:" + periods["threeYearsAgo"] + ":" + fullTimePeriodLength.toString()

  return values.reduce((a, v) => {
    situation.demandeur[variable] = {}
    situation.demandeur[variable][fullTimePeriod] = fullTimePeriodLength * v
    const ss = openfisca.buildOpenFiscaRequest(situation)

    ss.foyers_fiscaux._.irpp = { [periods.thisYear]: null }

    const prefixed = prefix(v.toString() + "_", ss)
    return append(a, prefixed)
  }, init())
}

function extractResults({ source, response }, benefitIds) {
  const periods = common.getPeriods(source.dateDeValeur)
  const entities = ["familles", "individus", "foyers_fiscaux", "menages"]

  return entities.reduce((groupAccum, group) => {
    const entityNames = Object.keys(response[group])
    return entityNames.reduce((entityAccum, id) => {
      const prefix = id.split("_")[0]
      entityAccum[prefix] = entityAccum[prefix] || {}

      return benefitIds.reduce((benefitAccum, variable) => {
        const base = response[group][id][variable]
        if (base) {
          benefitAccum[prefix][variable] = benefitAccum[prefix][variable] || 0
          benefitAccum[prefix][variable] +=
            1 * (base[periods.thisMonth] || base[periods.thisYear] / 12 || 0)
        }

        return benefitAccum
      }, entityAccum)
    }, groupAccum)
  }, {})
}

module.exports = {
  base,
  build,
  extractResults,
  init,
  prefix,
  append,
}
