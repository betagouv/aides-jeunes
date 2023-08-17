/// <reference types="Cypress" />
import profil from "../utils/profil.js"
import navigate from "../utils/navigate.js"
import foyer from "../utils/foyer.js"
import logement from "../utils/logement.js"
import revenu from "../utils/revenu.js"
import projet from "../utils/projet.js"
import results from "../utils/results.js"
import "cypress-axe"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    cy.injectAxe()
  })

  it("accepts a situation with handicap", () => {
    navigate.goHome()

    profil.handicaped()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill__logementType("sansDomicile")
    logement.fill_depcom("94120")
    logement.fill__difficultes_acces_ou_frais_logement(true)
    logement.fill__nombreMoisEntreeLogement(-12)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fill__interetsAidesVelo([])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)

    results.wait()
    results.hasAAH()
    navigate.goRecap()
    navigate.checkRecap()
  })
})
