import navigate from "./navigate.js"

const pursueSimulationButton = () => {
  cy.get('button[data-testid="pursue-simulation-button"]')
    .should("be.visible")
    .click()
  cy.url().should("not.include", "/simulation/revenir-plus-tard")
}

const temporarySaveSimulationButton = () => {
  cy.get('button[data-testid="temporary-save-simulation-button"]').click()
  cy.wait("@post-simulation").then(({ request, response }) => {
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
    cy.get('div[data-testid="simulation-saved-success-alert"]', {
      timeout: 10000,
    }).should("be.visible")
  })
}

const copySimulationButton = () => {
  cy.get('button[data-testid="simulation-link-clipboard-button"]')
    .focus()
    .click()
  cy.window().then((win) => {
    const clipboard = win.navigator.clipboard
    clipboard.readText().then((text) => {
      expect(text).to.include("/s/t/")
    })
  })
}

const simulationNewTabAccessLink = () => {
  cy.get('a[data-testid="simulation-new-tab-access-link"]')
    .invoke("removeAttr", "target")
    .click()
  cy.url().should("include", "/recapitulatif")
  cy.injectAxe()
}

const checkAll = () => {
  navigate.goToComeBackLater()
  pursueSimulationButton()
  navigate.goToComeBackLater()
  temporarySaveSimulationButton()
  copySimulationButton()
  simulationNewTabAccessLink()
  navigate.next()
}

export default {
  checkAll,
}
