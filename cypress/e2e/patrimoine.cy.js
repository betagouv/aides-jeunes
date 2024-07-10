/// <reference types="Cypress" />
import profil from "../utils/profil.js"
import navigate from "../utils/navigate.js"
import logement from "../utils/logement.js"
import revenu from "../utils/revenu.js"
import projet from "../utils/projet.js"
import results from "../utils/results.js"
import foyer from "../utils/foyer.js"
import form from "../utils/form.js"
import "cypress-axe"

context("Full simulation", () => {
  before(() => {
    navigate.init()
    navigate.goToIframe()
    cy.injectAxe()
    cy.get('iframe[id="simulateur"]', { timeout: 7000 }).as("iframe")
  })

  it("accept a basic situation in an iframe", () => {
    cy.get("@iframe").its("0.contentDocument").as("iframeDoc")
    cy.get("@iframeDoc").should("not.be.empty")
    cy.get("@iframeDoc").its("body").as("iframeBody")
    cy.get("@iframeBody").should("not.be.empty")

    cy.get("@iframeBody")
      .first()
      .within(() => {
        cy.get("@iframeBody").find("[data-testid='new-simulation']").click()
        profil.defaultIndivu()
        foyer.children(0)
        foyer.fill_en_couple(false)

        logement.fill__logementType("locataire")
        logement.fill__locationType("vide")
        logement.fill_coloc(false)
        logement.fill_logement_chambre(false)
        logement.fill_proprietaire_proche_famille(false)
        logement.fill_loyer(600, 100)
        logement.fill_depcom("34000")
        logement.fill__difficultes_acces_ou_frais_logement(false)
        logement.fill__nombreMoisEntreeLogement(-2)

        revenu.fill_ressources_types(["salaire_net"])
        revenu.fillConstantRevenu(400)

        projet.fill__interetsAidesVelo(["velo_mecanique"])
        projet.fill__interetBafa(false)
        projet.fill__interetPermisDeConduire(false)
        projet.fill__interetAidesSanitaireSocial(false)

        results.wait()
        results.hasAideVeloNationale()

        /** Vérifie que l'incitation de Montpellier est présente
         * mais elle se termine le 31/12/2024
         * Donc il faudra faire évoluer le test à ce moment là*/
        results.hasIncitationCovoiturage()
        results.hasHousingBenefit()
        results.back()
        results.hasRSA()
        form.fillPatrimoine()
        results.wait()
        results.hasNotBenefit("rsa")
        navigate.goRecap()
        navigate.checkRecap()
      })
  })
})
