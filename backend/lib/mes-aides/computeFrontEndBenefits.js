
function computeFrontEndBenefits(droitsDescription, situation, openfiscaResponse) {
  droitsDescription.forEach(function(benefit, benefitId, provider, providerID) {
    if (benefitId == 'a') {
      const period = '2014-11' // getPeriods(situation.dateDeValeur).currentMonth.id

      const age = 21 // date diff
      const eligibilite_geo = true // region il faut un mapping
      //const communes = require('@etalab/decoupage-administratif/data/communes.json')

      const eligibilite_statuts = true //
      //benefits.statuts.map(s => true).reduce((a, v) => a || v, false) // any([true, true, false]) => false
      const montant = 200

      const eligibilite = openfiscaResponse.individus.demandeur.activite[period] == 'chomeur'

      const result = eligibilite ? montant || true : montant ? 0 : false
      openfiscaResponse.individus.demandeur[benefitId] = {[period]: result }
    }
  })
}

exports.computeFrontEndBenefits = computeFrontEndBenefits
