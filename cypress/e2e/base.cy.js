/// <reference types="Cypress" />
import navigate from "../utils/navigate"
import profil from "../utils/profil"
import foyer from "../utils/foyer"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"
import "cypress-axe"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    cy.injectAxe()
  })

  it("Go to the recap during a basic situation and modify/continue the simulation", () => {
    navigate.goHome()

    // Global accessibility check
    cy.get("main").then(() => {
      cy.checkA11y()
    })

    profil.defaultIndivu()
    foyer.children(0)
    foyer.fill_en_couple(false)
    navigate.goRecap()
    navigate.updateFromRecap("Mon foyer", "Mes enfants à charge")
    foyer.children(1)
    foyer.fill_en_couple(false)
    foyer.fill_rsa_isolement_recent(false)
    navigate.goRecap()
    navigate.next()

    // Test the monthly payments page as an owner
    logement.fill__logementType("proprietaire")
    logement.fill__primoAccedant(false)
    logement.fill_loyer(800)
    navigate.goRecap()
    navigate.updateFromRecap("Mon logement", "Êtes-vous ?")

    // Test the monthly payments page as an owner first-time buyer
    logement.fill__logementType("proprietaire")
    logement.fill__primoAccedant(true)
    logement.fill_loyer(800)
    navigate.goRecap()
    navigate.updateFromRecap("Mon logement", "Êtes-vous ?")

    // Continue the test as an homeless person
    logement.fill__logementType("sansDomicile")
    logement.fill_depcom("94120")
    logement.fill__nombreMoisEntreeLogement(-12)
    revenu.fill_ressources_types([
      "salaire_net",
      "rpns_micro_entreprise_CA_bnc_imp",
    ])
    revenu.fillConstantRevenu(1101.42)
    revenu.ignore()
    revenu.fillChildrenRessources([true])
    revenu.fill_ressources_types([])
    projet.fill__interetsAidesVelo([])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)
    results.wait()
    results.hasPrimeActivite()
    results.hasPrimeActiviteNearbyPlaces()
    results.back()
    results.captureFiscalResources()
    results.checkResultsRequests()
    results.receiveResultsEmail()
    results.hasSituationNearbyPlaces()
  })
})
