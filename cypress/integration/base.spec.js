/// <reference types="Cypress" />
import navigate from "../utils/navigate"
import profil from "../utils/profil"
import foyer from "../utils/foyer"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accepts a basic situation", () => {
    navigate.goHome()

    profil.defaultIndivu()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill_logement("sansDomicile")
    logement.fill_depcom("94120")

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fill_interetPermisDeConduire(false)

    results.wait()

    results.hasPrimeActivite(1)
    results.captureFiscalResources(2)
  })

  it("accept a student situation", () => {
    navigate.goHome()

    profil.etudiantPublic()

    foyer.children(0)
    foyer.fill_en_couple(false)
    foyer.fill_situation("separes")
    foyer.fill_bourse_criteres_sociaux_nombre_enfants_a_charge(1)
    foyer.fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur(
      1
    )

    logement.fill_logement("locataire", "nonmeuble")
    logement.fill_coloc(false)
    logement.fill_logement_chambre(false)
    logement.fill_proprietaire_proche_famille(false)
    logement.fill_loyer(600, 100)
    logement.fill_depcom("94120")
    logement.fill_en_france(false)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)
    revenu.fillRevenuBrut(0)

    projet.fill_interetPermisDeConduire(false)
    projet.fill_sortie_region_academique(true)
    projet.fill_boursier(false)
    projet.fill_interetEtudesEtranger(true)
    projet.fill_dureeMoisEtudesEtranger(2)

    results.wait()
    results.hasHousingBenefit(3)
  })
})
