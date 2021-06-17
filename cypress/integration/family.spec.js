/// <reference types="Cypress" />
import * as steps from "../support"

context("Full simulation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/init-ci")
  })

  it("accepts a family situation", () => {
    steps.home()
    steps.demandeur()
    steps.deuxEnfants()
    steps.couple()
    steps.conjoint()
    steps.sansDomicileStable()
    steps.salaireSeul()

    cy.get('button[type="submit"]').click()

    cy.contains("fieldset", "Votre 1ᵉʳ enfant")
      .find("input[value=true]")
      .check()
    cy.get('button[type="submit"]').click()

    cy.get("div").find('input[type="checkbox"]').first().check()
    cy.get('button[type="submit"]').click()

    cy.get("div").as("salarySection")
    cy.get("@salarySection")
      .find('input[type="radio"][value="false"]')
      .first()
      .check()
    cy.get("@salarySection").find('input[type="text"]').as("inputs")
    cy.get("@inputs").its("length").should("equal", 13)

    cy.get("@inputs").eq(0).type(400)
    cy.get("@inputs").eq(2).type("{selectall}0")
    cy.get('button[type="submit"]').click()

    // steps.sansPensionAlimentaireVersees()
    steps.interestFlagExtra()
    steps.hasPrimeActivite(2)
    // steps.hasLogementSocial()
  })

  it("accept a student situation", () => {
    steps.home()
    steps.etudiant_public()
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
    cy.get("legend").invoke("text").should("contain", "revenu brut global")
    cy.get('input[type="text"]').type("17860.35")
    steps.submit()
    steps.checkRadio("false")
    steps.submit()
    steps.checkRadio("true")
    steps.submit()
    steps.checkRadio("false")
    steps.submit()
    steps.checkRadio("true")
    steps.submit()
    cy.get('input[type="text"]').type("2")
    steps.submit()
    steps.hasBourseCriteresSociaux(3)
  })
})
