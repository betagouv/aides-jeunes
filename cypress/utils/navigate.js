const init = () => {
  cy.intercept("GET", "/api/simulation/*/results").as("results")
  cy.intercept("GET", "/api/outils/communes/*").as("communes")
  cy.intercept("POST", "/api/simulation").as("post-simulation")
  cy.intercept("GET", "**/v3/communes/**", (req) => {
    if (req.url.includes("caf")) {
      req.reply({
        statusCode: 200,
        body: {
          features: [
            {
              properties: {
                id: "caf-fontenay-1",
                nom: "Caisse d'allocations familiales - Fontenay-sous-Bois",
                pivotLocal: "caf",
                url: "https://www.caf.fr",
                adresses: [
                  {
                    type: "physique",
                    codePostal: "94120",
                    commune: "Fontenay-sous-Bois",
                    lignes: ["1 Rue de la CAF"],
                  },
                ],
              },
            },
          ],
        },
      })
      return
    }

    if (req.url.includes("mairie")) {
      req.reply({
        statusCode: 200,
        body: {
          features: [
            {
              properties: {
                id: "mairie-fontenay-1",
                nom: "Mairie - Fontenay-sous-Bois",
                pivotLocal: "mairie",
                adresses: [
                  {
                    type: "physique",
                    codePostal: "94120",
                    commune: "Fontenay-sous-Bois",
                    lignes: ["4 Esplanade Louis Bayeurte"],
                  },
                ],
              },
            },
          ],
        },
      })
      return
    }

    req.continue()
  }).as("lieux")
  cy.intercept("GET", "**/api/lieux/**").as("lieux")
  cy.clearCookies()
  cy.clearAllLocalStorage()
  cy.visit("http://localhost:8080/init-ci")
}

const goToBafaBenefitsPage = () => {
  cy.get('[data-testid="bafa-bafd-preview"]').click()
}

const goToAidesVeloBenefitsPage = () => {
  cy.get('[data-testid="velo-preview"]').click()
}

const goHome = () => {
  cy.get('meta[property="og:description"]')
    .invoke("attr", "content")
    .should("match", /\d+ aides/i)

  cy.get('[data-testid="home-page"]').invoke("text").should("contain", "aides")

  cy.get('[data-testid="new-simulation"]').click()
}

const goToIframe = () => {
  cy.visit("http://localhost:8080/iframe")
}

const goRecap = () => {
  cy.get('[data-testid="previous-or-recap-button"]').click()
}

const checkRecap = () => {
  cy.get('[data-testid="recapitulatif"]').should("not.contain", "undefined")
}

const next = () => {
  cy.get(`a[data-testid="button-continue"]`).click()
}

const updateFromRecap = (sectionTitle, buttonLabel) => {
  cy.get(`div.chapter-block:contains('${sectionTitle}')`).within(() => {
    cy.get(`div[data-testid="question-row"]:contains('${buttonLabel}')`)
      .siblings()
      .contains("Modifier")
      .click()
  })
}

const goToComeBackLater = () => {
  cy.get('a[data-testid="come-back-later-link"]').should("be.visible").click()
  cy.url().should("include", "/simulation/revenir-plus-tard")
}

const goToEnSavoirPlus = () => {
  cy.get('[data-testid="en-savoir-plus-button"]').should("be.visible").click()
  cy.get('[data-testid="en-savoir-plus-button"]').should("not.exist")
  cy.url().should("include", "/en_savoir_plus")
  cy.get('[data-testid="en-savoir-plus-back-button"]')
    .should("be.visible")
    .click()
}

export default {
  init,
  goToComeBackLater,
  goToEnSavoirPlus,
  goToBafaBenefitsPage,
  goToAidesVeloBenefitsPage,
  goHome,
  goToIframe,
  goRecap,
  next,
  updateFromRecap,
  checkRecap,
}
