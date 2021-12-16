import { submit } from "./form"

const wait = () => {
  cy.wait("@results")
  cy.get("#print-disclaimer").invoke("text").should("contain", "engagement")
}

const getBenefitSummary = (id) => cy.get(`@${id}-summary`)

const back = () => cy.get('button[data-testid="back"]').click()

const IdentifyBenefit = (id, name) => {
  cy.get(
    `.droits-list [itemtype="http://schema.org/GovernmentService"][data-testid="${id}"]`,
    { timeout: 10000 }
  ).as(`${id}-summary`)
  getBenefitSummary(id)
    .find('[itemprop="name"]')
    .invoke("text")
    .should("match", name)
}

const hasPrimeActivite = () => {
  const name = /Prime d’activité/
  const id = "ppa"
  const description = /revenus/
  IdentifyBenefit(id, name)
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

const captureFiscalResources = () => {
  const name = /Livret d’épargne populaire/
  const id = "livret_epargne_populaire_taux"
  cy.get(".aj-droit-details-back-button").click()
  IdentifyBenefit(id, name)
  getBenefitSummary(id).click()
  cy.get(".notification.warning").invoke("text").should("contain", "ressources")
  cy.get(".button.outline.red").click()
  cy.get('input[type="number"]').first().type("50000")
  submit()
  cy.get(id + "-summary").should("not.exist")
}

const hasHousingBenefit = () => {
  const name = /Aides au logement/
  const id = "aide_logement"
  const description = /Apl/
  IdentifyBenefit(id, name)
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

const hasCSS = () => {
  const name = /Complémentaire santé solidaire/
  const id = "css_participation_forfaitaire"
  IdentifyBenefit(id, name)
  getBenefitSummary(id).find(
    '[data-testid="aj-droit-estime-icon-fa-check-circle"]'
  )
}

const hasAAH = () => {
  const name = /Allocation aux adultes handicapés/
  const id = "aah"
  const description = "AAH"
  IdentifyBenefit(id, name)
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

const hasBourseCriteresSociaux = () => {
  const name = /Bourse sur critères sociaux/
  const id = "bourse_criteres_sociaux"
  const description = /BCS/
  IdentifyBenefit(id, name)
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

const hasIleDeFranceAideBachelierMeritants = () => {
  const name = /Aide aux bacheliers méritants/
  const id = "ile-de-france-aide-aux-bacheliers-meritants"
  IdentifyBenefit(id, name)
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
