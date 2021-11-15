const submit = () => cy.get('button[type="submit"]').click()

const previous = () => cy.get('button[data-testid="previous"]').click()

const submitTest = (url, optional) => {
  submit()
  if (optional) {
    previous()
  }
  cy.url().should("include", url)
}

const fillRadio = (url, value, { noSubmit, optional } = {}) => {
  cy.url().should("include", url)

  if (!noSubmit) {
    submitTest(url, optional)
  }

  cy.get('input[type="radio"]').check(value.toString())

  if (!noSubmit) {
    submit()
  }
}

const fillNumber = (url, value, { noSubmit, optional } = {}) => {
  cy.url().should("include", url)

  if (!noSubmit) {
    submitTest(url, optional)
  }

  cy.get("form").find('input[type="number"]').type(value)

  if (!noSubmit) {
    submit()
  }
}

const fillDate = (url, get, value, { noSubmit, optional } = {}) => {
  cy.url().should("include", url)

  if (!noSubmit) {
    submitTest(url, optional)
  }

  cy.get(get).type(value)

  if (!noSubmit) {
    submit()
  }
}

export default {
  submit,
  fillRadio,
  fillNumber,
  fillDate,
}
