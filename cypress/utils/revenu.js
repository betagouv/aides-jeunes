import { submit } from "./form"
import { urlInclude } from "./controllers"

const fill_ressources_types = (types = []) => {
  urlInclude("ressources/types")
  cy.checkA11y()
  types.forEach((type) =>
    cy
      .get("form")
      .find(`input[type="checkbox"][id="${type}"]`)
      .then(() => {
        return cy.get("form").find(`label[for="${type}"]`)
      })
      .click()
  )
  submit()
}

const fillConstantRevenu = (revenu) => {
  cy.get("div").as("salarySection")
  cy.checkA11y()
  cy.get("@salarySection")
    .find('input[type="radio"][value="true"]')
    .first()
    .invoke("attr", "id")
    .then((id) => {
      return cy.get(`label[for="${id}"]`)
    })
    .click()
  cy.get("@salarySection").find('input[type="text"]').type(revenu)
  submit()
}

const fillInconstantRevenu = (revenus) => {
  cy.get("div").as("salarySection")
  cy.checkA11y()
  cy.get("@salarySection")
    .find('input[type="radio"][value="false"]')
    .first()
    .invoke("attr", "id")
    .then((id) => {
      return cy.get(`label[for="${id}"]`)
    })
    .click()
  cy.get("@salarySection").find('input[type="text"]').as("inputs")
  cy.get("@inputs").its("length").should("equal", 13)

  revenus.forEach((revenu) => {
    cy.get("@inputs").eq(revenu.index).type(revenu.value)
  })
  submit()
}

const fillRevenuBrut = (revenu) => {
  cy.get("form").find('input[type="text"]').type(revenu)
  cy.checkA11y()
  submit()
}

const fillChildrenRessources = (childrenRessource) => {
  cy.checkA11y()
  childrenRessource.forEach((childrenHasRessource, index) => {
    cy.get("[data-testid='_hasRessources']")
      .find(`input[value="${childrenHasRessource}"]`)
      .eq(index)
      .invoke("attr", "id")
      .then((id) => {
        return cy.get(`label[for="${id}"]`)
      })
      .click()
  })
  submit()
}

const ignore = submit

export default {
  ignore,
  fill_ressources_types,
  fillConstantRevenu,
  fillInconstantRevenu,
  fillRevenuBrut,
  fillChildrenRessources,
}
