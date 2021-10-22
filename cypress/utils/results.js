import { submit } from "./form"

const wait = () => {
  cy.wait("@results")
  cy.get("#print-disclaimer").invoke("text").should("contain", "engagement")
}

const getHelp = (id) => cy.get(`@${id}-summary`)

const identifyHelp = (position, id, name) => {
  cy.get(
    `.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(${position})`,
    { timeout: 10000 }
  ).as(`${id}-summary`)
  getHelp(id).find('[itemprop="name"]').invoke("text").should("match", name)
}

const hasPrimeActivite = (position) => {
  const name = /Prime d’activité/
  const id = "ppa"
  const description = /revenus/
  identifyHelp(position, id, name)
  getHelp(id)
    .find('[itemprop="offers"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  getHelp(id).find(".aj-aide-cta").click()

  cy.get(".aj-droit-detail").as(id)
  cy.get("@" + id)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get("@" + id)
    .get('[itemprop="termsOfService"]')
    .should("be.visible")
}

const captureFiscalResources = (position) => {
  const name = /Livret d’épargne populaire/
  const id = "livretEpargnePopulaire"
  cy.get(".aj-droit-details-back-button").click()
  identifyHelp(position, id, name)
  getHelp(id).click()
  cy.get(".notification.warning").invoke("text").should("contain", "ressources")
  cy.get(".button.outline.red").click()
  cy.get('input[type="number"]').first().type("50000")
  submit()
  cy.get(id + "-summary").should("not.exist")
}

const hasAideLogement = (position) => {
  const name = /Aides au logement/
  const id = "aide_logement"
  const description = /Apl/
  identifyHelp(position, id, name)
  getHelp(id)
    .find('[itemprop="offers"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  getHelp(id).find(".aj-aide-cta").click()

  cy.get(".aj-droit-detail").as(id)
  cy.get("@" + id)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get("@" + id)
    .get('[itemprop="termsOfService"]')
    .should("be.visible")
  // Vérifie si la page patrimoine est bien affichée
  cy.get("#patrimoine-link").click()
  cy.get('h2[data-testid="immobilier-title"]').should("exist")
  submit()
}

const hasCSS = (position) => {
  const name = /Complémentaire santé solidaire/
  const id = "css"
  identifyHelp(position, id, name)
  getHelp(id).find('[data-testid="droit-montant-icon-fa-check-circle"]')
}

const hasAAH = (position) => {
  const name = /Allocation aux adultes handicapés/
  const id = "aah"
  const description = "AAH"
  identifyHelp(position, id, name)
  getHelp(id)
    .find('[itemprop="offers"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  getHelp(id).find(".aj-aide-cta").click()

  cy.get(".aj-droit-detail").as(id)
  cy.get("@" + id)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("contain", description)
  cy.get("@" + id)
    .get('[itemprop="termsOfService"]')
    .should("be.visible")
}

const hasBourseCriteresSociaux = (position) => {
  const name = /Bourse sur critères sociaux/
  const id = "bourse_criteres_sociaux"
  const description = /BCS/
  identifyHelp(position, id, name)
  getHelp(id)
    .find('[itemprop="offers"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  getHelp(id).find(".aj-aide-cta").click()

  cy.get(".aj-droit-detail").as(id)
  cy.get("@" + id)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get("@" + id)
    .get('[itemprop="termsOfService"]')
    .should("be.visible")
}

export default {
  wait,
  hasPrimeActivite,
  hasAideLogement,
  hasCSS,
  hasAAH,
  hasBourseCriteresSociaux,
  captureFiscalResources,
}
