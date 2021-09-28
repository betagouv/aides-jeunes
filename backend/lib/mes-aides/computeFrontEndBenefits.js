const moment = require("moment")
const { generator } = require("./dates")
const communes = require("@etalab/decoupage-administratif/data/communes.json")

const STATUT_STATEGY = {
  apprenti: (situation) => {
    return situation.demandeur._contrat_alternant === "apprenti"
  },
  chomeur: (situation) => {
    return situation.demandeur.activite === "chomeur"
  },
  etudiant: (situation) => {
    return situation.demandeur.activite === "etudiant"
  },
  independant: (situation) => {
    return situation.demandeur.activite === "actif"
  },
  lyceen: (situation) => {
    return ["seconde", "premiere", "terminale"].includes(
      situation.demandeur.annee_etude
    )
  },
  professionnalisation: (situation) => {
    return situation.demandeur._contrat_alternant === "professionnalisation"
  },
  salarie: (situation) => {
    return situation.demandeur.activite === "actif"
  },
  service_civique: (situation) => {
    return situation.demandeur.activite === "service_civique"
  },
}

function testEligibiliteGeographique(commune, benefit) {
  var tests = [
    { item: "code", list: benefit.communes || [] },
    { item: "departement", list: benefit.departements || [] },
    { item: "region", list: benefit.regions || [] },
  ]

  // Pas de contrainte géographique
  if (tests.every((test) => test.list.length === 0)) {
    return true
  }

  // Depcom invalide
  if (!commune) {
    return false
  }

  return tests.some((test) => test.list.includes(commune[test.item]))
}

function computeFrontEndBenefits(
  droitsDescription,
  situation,
  openfiscaResponse
) {
  const age = moment().diff(situation.demandeur.date_naissance, "years")
  const period = generator(situation.dateDeValeur).thisMonth.id
  const commune = communes.find((com) => com.code === situation.menage.depcom)

  droitsDescription.forEach(function (benefit, benefitId) {
    if (benefit.computesLocally) {
      const elegibiliteAge =
        (benefit.age_min === undefined || age >= benefit.age_min) &&
        (benefit.age_max === undefined || age <= benefit.age_max)

      const eligibiliteStatuts =
        benefit.statuts === undefined ||
        benefit.statuts.some((statut) => {
          return STATUT_STATEGY[statut] && STATUT_STATEGY[statut](situation)
        })

      const eligibiliteGeo = testEligibiliteGeographique(commune, benefit)

      const montant = benefit.montant

      const eligibilite = eligibiliteStatuts && elegibiliteAge && eligibiliteGeo

      const result =
        benefit.type === "float" ? (eligibilite ? montant : 0) : eligibilite

      openfiscaResponse.individus.demandeur[benefitId] = { [period]: result }
    }
  })
}

exports.testEligibiliteGeographique = testEligibiliteGeographique
exports.computeFrontEndBenefits = computeFrontEndBenefits
