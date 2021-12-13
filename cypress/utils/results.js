import { submit } from "./form"

const wait = () => {
  cy.wait("@results")
  cy.get("#print-disclaimer").invoke("text").should("contain", "engagement")
}

const getBenefitSummary = (id) => cy.get(`@${id}-summary`)

const back = () => cy.get('button[data-testid="back"]').click()

const IdentifyBenefit = (position, id, name) => {
  cy.get(
    `.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(${position})`,
    { timeout: 10000 }
  ).as(`${id}-summary`)
  getBenefitSummary(id)
    .find('[itemprop="name"]')
    .invoke("text")
    .should("match", name)
}

const hasPrimeActivite = (position) => {
  const name = /Prime d’activité/
  const id = "ppa"
  const description = /revenus/
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id)
    .find(".aj-droit-estime-value")
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find(".aj-droit-estime-legend")
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find(".aj-aide-cta").click()

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
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id).click()
  cy.get(".notification.warning").invoke("text").should("contain", "ressources")
  cy.get(".button.outline.red").click()
  cy.get('input[type="number"]').should("be.visible").first().type("50000")
  submit()
  cy.get(id + "-summary").should("not.exist")
}

const hasHousingBenefit = (position) => {
  const name = /Aides au logement/
  const id = "aide_logement"
  const description = /Apl/
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id)
    .find(".aj-droit-estime-value")
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find(".aj-droit-estime-legend")
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find(".aj-aide-cta").click()

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
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id).find(
    '[data-testid="aj-droit-estime-icon-fa-check-circle"]'
  )
}

const hasAAH = (position) => {
  const name = /Allocation aux adultes handicapés/
  const id = "aah"
  const description = "AAH"
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id)
    .find(".aj-droit-estime-value")
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find(".aj-droit-estime-legend")
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find(".aj-aide-cta").click()

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
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id)
    .find(".aj-droit-estime-value")
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find(".aj-droit-estime-legend")
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find(".aj-aide-cta").click()

  cy.get(".aj-droit-detail").as(id)
  cy.get("@" + id)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get("@" + id)
    .get('[itemprop="termsOfService"]')
    .should("be.visible")
}

const hasIleDeFranceAideBachelierMeritants = (position) => {
  const name = /Aide aux bacheliers méritants/
  const id = "ile-de-france-aide-aux-bacheliers-meritants"
  IdentifyBenefit(position, id, name)
  getBenefitSummary(id)
    .find(".aj-droit-estime-value")
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
}

export default {
  wait,
  back,
  hasPrimeActivite,
  hasHousingBenefit,
  hasCSS,
  hasAAH,
  hasBourseCriteresSociaux,
  captureFiscalResources,
  hasIleDeFranceAideBachelierMeritants,
}
