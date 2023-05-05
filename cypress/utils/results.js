import { submit } from "./form"

const wait = () => {
  cy.wait("@results")
}

const getBenefitSummary = (id) => cy.get(`@${id}-summary`)

const back = () => cy.get('[data-testid="back-button"]').click()

const IdentifyBenefit = (id, name) => {
  cy.get(
    `[itemtype="http://schema.org/GovernmentService"][data-testid="${id}"]`,
    { timeout: 10000 }
  ).as(`${id}-summary`)
  cy.checkA11y()
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
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasPrimeActiviteNearbyPlacesWithABTesting = () => {
  cy.window()
    .its("localStorage.ABTesting")
    .then((abtestingValue) => {
      const abtestingObject = JSON.parse(abtestingValue).css_text.value
      if (abtestingObject === "D") {
        // Historical version
        cy.get("#cta-proximity").should("be.visible").click()
        cy.get("#cta-proximity").should("not.exist")
        cy.get('[data-testid="lieux"]').should("be.visible")
        cy.get('[data-testid="etablissement-title"]').should(
          "contain",
          "Caisse d'allocations familiales"
        )
        back()
      } else {
        // Refonte UX
        cy.get('[data-testid="nearby-places"]').should("be.visible")
        cy.get('[data-testid="etablissement-title"]').should(
          "contain",
          "Caisse d'allocations familiales"
        )
        cy.get('[data-testid="etablissement-informations-link"]').should(
          "contain",
          "Voir les informations"
        )
      }
    })
}

const hasSituationNearbyPlaces = () => {
  cy.get('[data-testid="nearby-help"]').should("be.visible").click()
  cy.get('[data-testid="nearby-help"]').should("not.exist")
  cy.get('[data-testid="etablissement-title"]')
    .first()
    .should("contain", "Mairie - Fontenay-sous-Bois")
  cy.get('[data-testid="etablissement-address"]').first().should("be.visible")
}

const captureFiscalResources = () => {
  const name = /Livret d’épargne populaire/
  const id = "livret_epargne_populaire_taux"
  cy.get('[data-testid="back-button"]').click()
  IdentifyBenefit(id, name)
  getBenefitSummary(id).click()
  cy.get(`div[data-testid="benefit-detail-warning"]`)
    .invoke("text")
    .should("contain", "ressources")
  cy.get(`a[data-testid="benefit-ressources-link"]`).click()
  cy.get('input[type="number"]').first().type("50000")
  cy.checkA11y()
  submit()
  cy.get(`${id}-summary`).should("not.exist")
}

const hasHousingBenefit = () => {
  const name = /Aides au logement/
  const id = "aide_logement"
  const description = /Apl/
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasCSS = () => {
  const name = /Complémentaire santé solidaire/
  const id = "css_participation_forfaitaire"
  IdentifyBenefit(id, name)
}

const hasAAH = () => {
  const name = /Allocation aux adultes handicapés/
  const id = "aah"
  const description = "AAH"
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("contain", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasBourseCriteresSociaux = () => {
  const name = /Bourse sur critères sociaux/
  const id = "bourse_criteres_sociaux"
  const description = /BCS/
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasIleDeFranceAideAuMerite = () => {
  const name = /Aide au mérite/
  const id = "ile-de-france-aide-au-merite"
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
}

const hasAideVeloNationale = () => {
  const name = /Aide à l'achat d'un vélo : Bonus vélo/
  const id = "aidesvelo_aides_bonus_vélo"
  IdentifyBenefit(id, name)
}

const hasRSA = () => {
  const name = /Revenu de solidarité active/
  const id = "rsa"
  IdentifyBenefit(id, name)
}

const hasNotBenefit = (id) => {
  cy.checkA11y()
  cy.get(`[data-testid="${id}"]`, { timeout: 10000 }).should("not.exist")
}

const receiveResultsEmail = () => {
  cy.intercept({
    method: "POST",
    url: "/api/simulation/*/followup",
  }).as("post-receive-results-email")

  cy.get("[data-testid='send-email-button']", {
    timeout: 20000,
  })
    .should("be.visible")
    .click()
  cy.get("input#email").should("be.visible").type("prenom.nom@beta.gouv.fr")
  cy.get(".fr-btn:contains(J'accepte d'être recontacté)")
    .should("be.visible")
    .click()

  cy.wait("@post-receive-results-email").should(({ request, response }) => {
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
  })
}

const checkResultsRequests = () => {
  cy.wait("@post-simulation").should(({ request, response }) => {
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
  })
  cy.wait("@results").should(({ request, response }) => {
    expect(request.method).to.equal("GET")
    expect(response.statusCode).to.equal(200)
  })
}

export default {
  wait,
  back,
  hasPrimeActivite,
  hasPrimeActiviteNearbyPlacesWithABTesting,
  hasSituationNearbyPlaces,
  hasHousingBenefit,
  hasCSS,
  hasAAH,
  hasBourseCriteresSociaux,
  hasRSA,
  hasNotBenefit,
  captureFiscalResources,
  hasIleDeFranceAideAuMerite,
  hasAideVeloNationale,
  receiveResultsEmail,
  checkResultsRequests,
}
