var Promise = require("bluebird")
var openfisca = Promise.promisifyAll(require(".."))
var common = require("../mapping/common")

var entityGroups = {
  individus: [],
  familles: ["parents", "enfants"],
  foyers_fiscaux: ["declarants", "personnes_a_charge"],
  menages: ["personne_de_reference", "conjoint", "enfants"],
}

function init() {
  var result = Object.keys(entityGroups).reduce((accum, entityName) => {
    accum[entityName] = {}
    return accum
  }, {})
  result["individus"] = {}

  return result
}

function prefix(prefix, situation) {
  Object.keys(entityGroups).forEach((entityName) => {
    var oldKeys = Object.keys(situation[entityName])
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

var defaultValues = []
var max = 3500
var base = 25
var steps = max / base + 1
for (var i = 0; i < steps; i = i + 1) {
  defaultValues.push((i * max) / (steps - 1))
}

function build(situation, variable, values) {
  values = values || defaultValues
  var periods = common.getPeriods(situation.dateDeValeur)

  var fullTimePeriodLength = 12 * 4
  var fullTimePeriod =
    "month:" + periods["threeYearsAgo"] + ":" + fullTimePeriodLength.toString()

  return values.reduce((a, v) => {
    situation.demandeur[variable] = {}
    situation.demandeur[variable][fullTimePeriod] = fullTimePeriodLength * v
    var ss = openfisca.buildOpenFiscaRequest(situation)

    ss.foyers_fiscaux._.irpp = { [periods.thisYear]: null }

    var prefixed = prefix(v.toString() + "_", ss)
    return append(a, prefixed)
  }, init())
}

function extractResults({ source, response }, benefitIds) {
  var periods = common.getPeriods(source.dateDeValeur)
  var entities = ["familles", "individus", "foyers_fiscaux", "menages"]

  return entities.reduce((groupAccum, group) => {
    var entityNames = Object.keys(response[group])
    return entityNames.reduce((entityAccum, id) => {
      var prefix = id.split("_")[0]
      entityAccum[prefix] = entityAccum[prefix] || {}

      return benefitIds.reduce((benefitAccum, variable) => {
        var base = response[group][id][variable]
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
