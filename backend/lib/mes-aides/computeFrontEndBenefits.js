const moment = require("moment")
const { generator } = require("./dates")
const communes = require("@etalab/decoupage-administratif/data/communes.json")

function computeFrontEndBenefits(
  droitsDescription,
  situation,
  openfiscaResponse
) {
  const depcom = situation.menage.depcom || ""
  const age = moment().diff(situation.demandeur.date_naissance, "years")
  const period = generator(situation.dateDeValeur).thisMonth.id
  const commune = communes.find((com) => com.code === depcom)

  droitsDescription.forEach(function (benefit, benefitId) {
    if (benefitId === "benefit_front_test") {
      const elegibiliteAge = age >= benefit.age_min && age <= benefit.age_max

      const eligibiliteStatuts = benefit.statuts.some(
        (statut) => statut === situation.demandeur.activite
      )

      let eligibiliteGeo = true

      if (benefit.communes)
        eligibiliteGeo = eligibiliteGeo && benefit.communes.includes(depcom)

      if (benefit.departements)
        eligibiliteGeo =
          eligibiliteGeo &&
          benefit.departements.some((department) =>
            depcom.startsWith(department)
          )

      if (benefit.region) {
        eligibiliteGeo =
          eligibiliteGeo && benefit.regions.includes(commune.region)
      }

      const montant = 200

      const eligibilite =
        eligibiliteStatuts && elegibiliteAge && period && eligibiliteGeo

      const result = montant ? eligibilite * montant : eligibilite

      openfiscaResponse.individus.demandeur[benefitId] = { [period]: result }
    }
  })
}

exports.computeFrontEndBenefits = computeFrontEndBenefits
