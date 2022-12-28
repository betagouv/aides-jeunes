import { urlInclude } from "./controllers"

const submit = () => cy.get('button[type="submit"]').click()

const fillRadio = (url, value, noSubmit) => {
  urlInclude(url)
  cy.checkA11y()
  cy.get(`input[type="radio"][value="${value}"]`)
    .invoke("attr", "id")
    .then((id) => {
      return cy.get(`label[for="${id}"]`)
    })
    .click()

  if (!noSubmit) {
    submit()
  }
}

const fillRange = (url, value) => {
  cy.url().should("include", url)
  cy.checkA11y()
  cy.get(`input[type="range"]`).invoke("val", value).trigger("change")
  submit()
}

const fillCheckboxes = (url, values) => {
  urlInclude(url)
  cy.checkA11y()
  for (const value of values) {
    cy.get(`input[type="checkbox"][data-testid="${value}"]`)
      .invoke("attr", "id")
      .then((id) => {
        return cy.get(`label[for="${id}"]`)
      })
      .click()
  }
  submit()
}

const fillNumber = (url, value) => {
  urlInclude(url)
  cy.checkA11y()
  cy.get("form").find('input[type="text"]').type(value)
  submit()
}

const fillPatrimoine = () => {
  cy.get('[data-testid="aide_logement"]').click()
  cy.get('[data-testid="patrimoine-link"]').click()
  cy.get('[data-testid="immobilier-title"]').should("exist")
  cy.checkA11y()
  cy.get(
    "[data-testid='patrimoine-terrain-non-loues'] label[for*='yes-field']"
  ).click()
  cy.get("input#valeur_terrains_non_loues").type("500000")
  cy.get("input#valeur_locative_terrains_non_loues").type("50000")
  cy.get(
    "[data-testid='patrimoine-immeubles-non-loues'] label[for*='yes-field']"
  ).click()
  cy.get('[data-testid="livret_a"]').type("5000")
  cy.get('[data-testid="epargne_revenus_non_imposables"]').type("150000")
  cy.get('[data-testid="epargne_revenus_imposables"]').type("100000")
  submit()
}

export default {
  submit,
  fillRadio,
  fillRange,
  fillCheckboxes,
  fillNumber,
  fillPatrimoine,
}
