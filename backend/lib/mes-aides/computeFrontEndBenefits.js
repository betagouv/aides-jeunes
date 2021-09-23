const moment = require("moment")
const { generator } = require("./dates")
const { datesGenerator } = require("./index")

function computeFrontEndBenefits(
  droitsDescription,
  situation,
  openfiscaResponse
) {
  droitsDescription.forEach(function (
    benefit,
    benefitId
    /*
    provider,
    providerID
    */
  ) {
    if (benefitId === "benefit_front_test") {
      let period = generator(situation.dateDeValeur).thisMonth.id
      console.log(period)
      const elegibilite_age =
        moment().diff(situation.demandeur.date_naissance, "years") >=
          benefit.age_min &&
        moment().diff(situation.demandeur.date_naissance, "years") <=
          benefit.age_max

      const communes = require("@etalab/decoupage-administratif/data/communes.json")
      const listBenefitsCommunes = communes.filter(
        (commune) =>
          (benefit.departements &&
            benefit.departements.includes(commune.departement)) ||
          (benefit.region && benefit.region.includes(commune.region)) ||
          (benefit.communes && benefit.communes.includes(commune.code))
      )
      const depcom = situation.menage.depcom || ""
      const eligibilite_geo = listBenefitsCommunes.some(
        (commune) =>
          depcom === commune.code || depcom.startsWith(commune.departement)
      )

      const eligibilite_statuts = benefit.statuts
        .map((statut) => statut === situation.demandeur.activite)
        .reduce((a, v) => a || v, false) // any([true, true, false])

      const montant = 200
      const eligibilite =
        eligibilite_statuts && elegibilite_age && period && eligibilite_geo
      const result = eligibilite ? montant || true : montant ? 0 : false
      openfiscaResponse.individus.demandeur[benefitId] = { [period]: result }
    }
  })
}

exports.computeFrontEndBenefits = computeFrontEndBenefits
