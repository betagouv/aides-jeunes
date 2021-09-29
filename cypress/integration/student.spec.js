/// <reference types="Cypress" />
import * as steps from "../support"

context("Full simulation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/init-ci")
  })

  it("accept a student situation", () => {
    steps.home()
    steps.etudiant_public()

    cy.get("div").find('input[type="radio"][value="true"]').first().check()
    cy.get('button[type="submit"]').click()

    steps.zeroEnfants()
    steps.celibataire()
    steps.parentsSepares()
    steps.unEnfantSuperieur()
    steps.heberge()
    steps.neParticipePasLogement()
    steps.hebergeParents()

    cy.get('input[type="number"').type("45200")
    steps.submit()
    // Ressources
    steps.submit()
    cy.get(".aj-tooltip")
    cy.get(".aj-question")
      .invoke("text")
      .should("contain", "revenu brut global")
    cy.get('input[type="number"]').type("17860.35")
    steps.submit()
    cy.get('input[type="number"]').type("1")
    steps.submit()
    steps.checkRadio("false")
    steps.submit()
    steps.checkRadio("true")
    steps.submit()
    steps.checkRadio("false")
    steps.submit()
    steps.checkRadio("true")
    steps.submit()
    cy.get('input[type="number"]').type("2")
    steps.submit()

    steps.waitForResults()
    steps.hasBourseCriteresSociaux(3)
  })
})
