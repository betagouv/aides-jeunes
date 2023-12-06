/// <reference types="Cypress" />
import profil from "../utils/profil.js"
import navigate from "../utils/navigate.js"
import logement from "../utils/logement.js"
import revenu from "../utils/revenu.js"
import projet from "../utils/projet.js"
import results from "../utils/results.js"
import foyer from "../utils/foyer.js"
import "cypress-axe"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    cy.injectAxe()
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

    logement.fill__logementType("locataire")
    logement.fill__locationType("vide")
    logement.fill_coloc(false)
    logement.fill_logement_chambre(false)
    logement.fill_proprietaire_proche_famille(false)
    logement.fill_loyer(600, 100)
    logement.fill_depcom("75001")
    logement.fill__difficultes_acces_ou_frais_logement(false)
    logement.fill_parisien(true)
    logement.fill__en_france(true)
    logement.fill_depcom(
      "75001",
      "_bourseCriteresSociauxCommuneDomicileFamilial"
    )
    logement.fill__nombreMoisEntreeLogement(-2)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)
    revenu.checkFieldRequired()
    revenu.fillRevenuBrut(1)

    projet.fill__interetsAidesVelo(["velo_mecanique", "velo_electrique"])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetEtudesEtranger(true)
    projet.fill__dureeMoisEtudesEtranger(2)

    results.wait()

    results.hasIleDeFranceAideAuMerite()
    results.hasBourseCriteresSociaux()
    results.back()
    results.hasAideVeloNationale()
    results.hasHousingBenefit()
    navigate.goRecap()
    navigate.checkRecap()
  })
})
