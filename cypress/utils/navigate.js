const init = () => {
  cy.intercept("GET", "/api/simulation/*/results").as("results")
  cy.intercept("GET", "/api/outils/communes/*").as("communes")
  cy.visit("http://localhost:8080/init-ci")
}

const goHome = () => {
  cy.get('meta[property="og:description"]')
    .invoke("attr", "content")
    .should("match", /\d+ aides/i)

  cy.get('[data-testid="home-hero-content"]')
    .invoke("text")
    .should("contain", "aides")

  cy.get('[data-testid="new-simulation"]').click()
}

const goRecap = () => {
  cy.get('[data-testid="previous-or-recap-button"]').click()
}

const next = () => {
  cy.get(`a[data-testid="button-continue"]`).click()
}

const updateFromRecap = (buttonLabel) => {
  cy.get(`div[data-testclass="question-row"]:contains('${buttonLabel}')`)
    .siblings()
    .contains("Modifier")
    .click()
}
export default {
  init,
  goHome,
  goRecap,
  next,
  updateFromRecap,
}
