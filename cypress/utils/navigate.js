const init = () => {
  cy.intercept("GET", "/api/simulation/*/openfisca-response").as("results")
  cy.intercept("GET", "/api/outils/communes/*").as("communes")
  cy.visit("http://localhost:8080/init-ci")
}

const goHome = () => {
  cy.get('meta[property="og:description"]')
    .invoke("attr", "content")
    .should("match", /\d+ aides/i)

  cy.get(".aj-home-hero-content").invoke("text").should("contain", "aides")

  cy.get('[data-testid="new-simulation"]').click()
}

export default {
  init,
  goHome,
}
