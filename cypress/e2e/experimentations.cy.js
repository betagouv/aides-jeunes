/// <reference types="Cypress" />
import "cypress-axe"

context("Test du site d'expérimentations", () => {
  it("Ensures a full redirection and a functional external computation", () => {
    cy.visit("http://localhost:3000")
    cy.get("a:contains('Service Logement')").click()
    cy.get("button:contains('Simuler une boucle (dev)')").click()
    cy.url().should("contain", "service-logement?token=")
    cy.get("[data-testid-index=0]").within(() => {
      cy.get("[data-testid='action']").within(() => {
        cy.get("button").click()
      })
      cy.get("[data-testid='action']", { timeout: 10000 })
        .its("text")
        .should("match", /(\d+)/)
    })
  })
})
