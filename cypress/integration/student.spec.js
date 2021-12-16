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

    logement.fill_logement("locataire", "nonmeuble")
    logement.fill__nombreMoisEntreeLogement(12)
    logement.fill_coloc(false)
    logement.fill_logement_chambre(false)
    logement.fill_proprietaire_proche_famille(false)
    logement.fill_loyer(600, 100)
    logement.fill_depcom("75001")
    logement.fill_parisien(true)
    logement.fill__en_france(true)
    logement.fill_depcom(
      "75001",
      "_bourseCriteresSociauxCommuneDomicileFamilial"
    )

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)
    revenu.fillRevenuBrut(1)

    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetEtudesEtranger(true)
    projet.fill__dureeMoisEtudesEtranger(2)

    results.wait()

    results.hasIleDeFranceAideBachelierMeritants()
    results.hasBourseCriteresSociaux()
    results.back()
    results.hasHousingBenefit()
  })
})
