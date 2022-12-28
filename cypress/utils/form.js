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

const fillRange = (url, value) => {
  cy.url().should("include", url)
  cy.checkA11y()
  cy.get(`input[type="range"]`).invoke("val", value).trigger("change")
  submit()
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

export default {
  submit,
  fillRadio,
  fillRange,
  fillCheckboxes,
  fillNumber,
}
