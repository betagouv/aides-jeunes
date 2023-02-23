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

const loadIframe = () => {}

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    cy.injectAxe()
  })
  it("accept a basic situation", () => {
    navigate.goToIframe()
    cy.get('iframe[id="simulateur"]')
      .its("0.contentDocument")
      .should("not.be.empty")
      .its("body")
      .as("iframeBody")

    cy.get("@iframeBody")
      .should("be.visible")
      .should("not.be.empty")
      .then(cy.wrap)

    cy.get("@iframeBody").find("[data-testid='new-simulation']").click()

    cy.get("@iframeBody")
      .find("[data-testid='date_naissance']")
      .type("12121980")

    cy.url().then((url) => {
      cy.log(url)
    })
    //getIframe().find("[data-testid='new-simulation']").click()
    //getIframe().find("[data-testid='date_naissance']").type("12121980")
  })
})
