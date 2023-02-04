const submit = () => cy.get('button[type="submit"]').click()

const fillRadio = (url, value, noSubmit) => {
  cy.url().should("include", url)
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

const fillCheckboxes = (url, values) => {
  cy.url().should("include", url)
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
  cy.url().should("include", url)
  cy.checkA11y()
  cy.get("form").find('input[type="text"]').type(value)
  submit()
}

const fillPatrimoine = () => {
  cy.get('[data-testid="immobilier-title"]').should("exist")
  cy.get(
    "[data-testid='patrimoine-terrain-non-loues'] label[for*='yes-field']"
  ).click()
  cy.get("input#valeur_terrains_non_loues").type("1000")
  cy.get("input#valeur_locative_terrains_non_loues").type("500")
  cy.get(
    "[data-testid='patrimoine-immeubles-non-loues'] label[for*='yes-field']"
  ).click()
  cy.get('[data-testid="livret_a"]').type("750")
  cy.get('[data-testid="epargne_revenus_non_imposables"]').type("150")
  cy.get('[data-testid="epargne_revenus_imposables"]').type("100")
}

export default {
  submit,
  fillRadio,
  fillCheckboxes,
  fillNumber,
  fillPatrimoine,
}
