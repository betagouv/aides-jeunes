/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"
import foyer from "../utils/foyer"
import form from "../utils/form"
import "cypress-axe"

const getIframeDocument = () => {
  return cy
    .get('iframe[id="simulateur"]')
    .its("0.contentDocument")
    .should("exist")
}

const getIframe = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap)
}

const getIframeWindow = () => {
  return cy
    .get('iframe[id="simulateur"]')
    .its("0.contentWindow")
    .should("exist")
}

const loadIframe = () => {}

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    navigate.goToIframe()
    cy.injectAxe()
    cy.get('iframe[id="simulateur"]').as("iframe")
  })
  it("accept a basic situation", () => {
    cy.get("@iframe")
      .its("0.contentDocument")
      .should("not.be.empty")
      .its("body")
      .as("iframeBody")

    cy.get("@iframeBody")
      .should("be.visible")
      .should("not.be.empty")
      .then(cy.wrap)

    cy.get("@iframeBody").find("[data-testid='new-simulation']").click()

    /*
    cy.get("@iframeBody")
      .find("[data-testid='date_naissance']")
      .type("12121980")
    */

    cy.get("@iframeBody")
      .first()
      .within(($iframeBody) => {
        profil.defaultIndivu()
      })
  })
})
