const submit = () => cy.get('button[type="submit"]').click()

const fillRadio = (url, value, noSubmit) => {
  cy.url().should("include", url)
  cy.get('input[type="radio"]').check(value.toString())

  if (!noSubmit) {
    submit()
  }
}

export default {
  submit,
  fillRadio,
}
