/*
 * Rename echelon_bourse in bourse_criteres_sociaux_echelon
 */
var _ = require("lodash")

var VERSION = 3

const renames = {
  aide_mobilite_master_sortie_region_academique: "sortie_region_academique",
  aide_mobilite_parcoursup_sortie_academie: "sortie_academie",
  classe_scolarite: "annee_etude",
}

function updatePerson(p) {
  if (!p) {
    return
  }

  const old_props = Object.keys(renames)
  old_props.forEach((prop) => {
    p[renames[prop]] = p[prop]
  })

  extras = [
    "tns_auto_entrepreneur_type_activite",
    "tns_micro_entreprise_type_activite",
  ]

  AE_map = {
    achat_revente: "rpns_auto_entrepreneur_CA_achat_revente",
    bic: "rpns_auto_entrepreneur_CA_bic",
    bnc: "rpns_auto_entrepreneur_CA_bnc",
  }
  if (p.tns_auto_entrepreneur_chiffre_affaires) {
    var dest_field = AE_map[p.tns_auto_entrepreneur_type_activite]
    if (dest_field) {
      p[dest_field] = p.tns_auto_entrepreneur_chiffre_affaires
    }
  }

  micro_map = {
    achat_revente: "rpns_micro_entreprise_CA_bic_vente_imp",
    bic: "rpns_micro_entreprise_CA_bic_service_imp",
    bnc: "rpns_micro_entreprise_CA_bnc_imp",
  }
  if (p.tns_micro_entreprise_chiffre_affaires) {
    var dest_field = AE_map[p.tns_micro_entreprise_type_activite]
    if (dest_field) {
      p[dest_field] = p.tns_micro_entreprise_chiffre_affaires
    }
  }

  old_CA = [
    "tns_auto_entrepreneur_chiffre_affaires",
    "tns_micro_entreprise_chiffre_affaires",
  ]

  return _.omit(p, old_props.concat(...extras, ...old_CA))
}

module.exports = {
  function: function (situation) {
    situation.demandeur = updatePerson(situation.demandeur)
    situation.conjoint = updatePerson(situation.conjoint)

    situation.enfants = situation.enfants.map((e) => {
      return updatePerson(e)
    })

    situation.famille.bourse_lycee =
      situation.demandeur.aide_mobilite_parcoursup_boursier_lycee
    delete situation.demandeur.aide_mobilite_parcoursup_boursier_lycee

    return situation
  },
  version: VERSION,
}
