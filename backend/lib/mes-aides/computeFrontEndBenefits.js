const moment = require("moment")
const { generator } = require("./dates")
const communes = require("@etalab/decoupage-administratif/data/communes.json")

function computeFrontEndBenefits(
  droitsDescription,
  situation,
  openfiscaResponse
) {
  droitsDescription.forEach(function (benefit, benefitId) {
    if (benefitId === "benefit_front_test") {
      const period = generator(situation.dateDeValeur).thisMonth.id

      const age = moment().diff(situation.demandeur.date_naissance, "years")
      const elegibiliteAge = age >= benefit.age_min && age <= benefit.age_max

      const listBenefitsCommunes = communes.filter(
        (commune) =>
          (benefit.departements &&
            benefit.departements.includes(commune.departement)) ||
          (benefit.region && benefit.region.includes(commune.region)) ||
          (benefit.communes && benefit.communes.includes(commune.code))
      )
      const depcom = situation.menage.depcom || ""
      const eligibiliteGeo = listBenefitsCommunes.some(
        (commune) =>
          depcom === commune.code || depcom.startsWith(commune.departement)
      )

      const eligibiliteStatuts = benefit.statuts.some(
        (statut) => statut === situation.demandeur.activite
      )

      const montant = 200
      const eligibilite =
        eligibiliteStatuts && elegibiliteAge && period && eligibiliteGeo
      const result = eligibilite ? montant : false
      openfiscaResponse.individus.demandeur[benefitId] = { [period]: result }
    }
  })
}

exports.computeFrontEndBenefits = computeFrontEndBenefits
