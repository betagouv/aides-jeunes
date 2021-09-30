/// <reference types="Cypress" />
import * as steps from "../support"

context("Full simulation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/init-ci")
  })

  it("accepts a basic situation", () => {
    steps.home()
    steps.demandeur()
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    steps.salaireSeul()
    // steps.sansPensionAlimentaireVersees()
    steps.interestFlagExtra()

    steps.waitForResults()
    steps.hasPrimeActivite()
    steps.captureFiscalResources()
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
    steps.locataire()

    cy.get('input[type="number"').type("45200")
    steps.submit()

    // Parents habitent en france
    steps.checkRadio(false)
    steps.submit()

    // Ressources

    steps.salaireSeul()

    cy.get('input[type="number"]').type("0")
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
    steps.hasAideLogement(3)
  })
})
