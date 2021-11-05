import { submit } from "./form"

const fill_ressources_types = (types = []) => {
  cy.url().should("includes", "ressources/types")
  types.forEach((type) =>
    cy.get("form").find(`input[type="checkbox"][id="${type}"]`).check()
  )
  submit()
}

const fillConstantRevenu = (revenu) => {
  cy.get("div").as("salarySection")
  cy.get("@salarySection")
    .find('input[type="radio"][value="true"]')
    .first()
    .check()
  cy.get("@salarySection").find('input[type="number"]').type(revenu)
  submit()
}

const fillInconstantRevenu = (revenus) => {
  cy.get("div").as("salarySection")
  cy.get("@salarySection")
    .find('input[type="radio"][value="false"]')
    .first()
    .check()
  cy.get("@salarySection").find('input[type="number"]').as("inputs")
  cy.get("@inputs").its("length").should("equal", 13)

  revenus.forEach((revenu) => {
    cy.get("@inputs").eq(revenu.index).type(revenu.value)
  })
  submit()
}

const fillRevenuBrut = (revenu) => {
  cy.get("form").find('input[type="number"]').type(revenu)
  submit()
}

const fillChildrenRessources = (childrenRessource) => {
  childrenRessource.forEach((childrenHasRessource, index) => {
    cy.get("form")
      .find(`input[value=${childrenHasRessource}]`)
      .eq(index)
      .check()
  })
  submit()
}

export default {
  fill_ressources_types,
  fillConstantRevenu,
  fillInconstantRevenu,
  fillRevenuBrut,
  fillChildrenRessources,
}
