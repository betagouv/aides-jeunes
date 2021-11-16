const submit = () => cy.get('button[type="submit"]').click()

const trySubmitWithoutAnswer = (url) => {
  cy.url().should("include", url)
  submit()
}

const fillRadio = (url, value, noSubmit) => {
  cy.url().should("include", url)
  cy.get('input[type="radio"]').check(value.toString())

  if (!noSubmit) {
    submit()
  }
}

const fillNumber = (url, value) => {
  cy.url().should("include", url)
  cy.get("form").find('input[type="number"]').type(value)
  submit()
}

const fillDate = (url, get, value) => {
  cy.url().should("include", url)
  cy.get(get).type(value)

  submit()
}

export default {
  submit,
  trySubmitWithoutAnswer,
  fillRadio,
  fillNumber,
  fillDate,
}
