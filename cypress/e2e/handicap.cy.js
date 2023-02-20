/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
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
    cy.on("fail", () => {
      return false
    })
  })

  it("accepts a situation with handicap", () => {
    navigate.goHome()

    profil.handicaped()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill__logementType("sansDomicile")
    logement.fill_depcom("94120")
    logement.fill__nombreMoisEntreeLogement(-12)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fill__interetsAidesVelo([])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)

    results.wait()
    results.hasAAH()
  })
})
