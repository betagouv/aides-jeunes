/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"
import foyer from "../utils/foyer"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accept a student situation", () => {
    navigate.goHome()

    profil.publicStudent()

    foyer.children(0)
    foyer.fill_en_couple(false)
    foyer.fill__situation("separes")
    foyer.fill_bourse_criteres_sociaux_nombre_enfants_a_charge(1)
    foyer.fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur(
      1
    )

    logement.fill_logement("heberge")
    logement.fill_participation_frais(false)
    logement.fill_habite_chez_parents(true)
    logement.fill_depcom("45200")

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(17860.35)
    revenu.fillRevenuBrut(1)

    projet.fill__interetPermisDeConduire(false)
    projet.fill_sortie_region_academique(true)
    projet.fill_boursier(false)
    projet.fill__interetEtudesEtranger(true)
    projet.fill__dureeMoisEtudesEtranger(2)

    results.wait()

    results.hasBourseCriteresSociaux(3)
  })
})
