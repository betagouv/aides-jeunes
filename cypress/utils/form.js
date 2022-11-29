const submit = () => cy.get('button[type="submit"]').click()

const fillRadio = (url, value, noSubmit) => {
  cy.url().should("include", url)
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
  cy.get("form").find('input[type="number"]').type(value)
  submit()
}

export default {
  submit,
  fillRadio,
  fillCheckboxes,
  fillNumber,
}
